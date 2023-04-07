<script setup lang="ts">
import { QSelect, QBtn, QOptionGroup, uid, exportFile } from 'quasar'
import { Icon } from '@/types/icons'
import { AppText, Limit, LogRetention, type Optional } from '@/types/misc'
import { DatabaseField, DatabaseType, SettingId } from '@/types/database'
import { type Ref, ref, onUnmounted } from 'vue'
import type { DatabaseRecord, Example, ExampleResult, Test } from '@/types/models'
import useLogger from '@/composables/useLogger'
import useNotifications from '@/composables/useNotifications'
import useSimpleDialogs from '@/composables/useSimpleDialogs'
import useDatabase from '@/composables/useDatabase'
import ResponsivePage from '@/components/ResponsivePage.vue'
import useRoutingHelpers from '@/composables/useRoutingHelpers'

const { log, consoleDebug } = useLogger()
const { notify } = useNotifications()
const { confirmDialog } = useSimpleDialogs()
const { goToData } = useRoutingHelpers()
const {
  liveSettings,
  initSettings,
  setSetting,
  bulkAddRecords,
  getAllRecords,
  clearRecordsByType,
  deleteDatabase,
  // getUnusedParentIds,
  // getOrphanedRecordIds,
  // bulkDeleteItems,
} = useDatabase()

const settings: Ref<any[]> = ref([])
const logRetentionIndex: Ref<number> = ref(0)
// Data Management
const importFile: Ref<any> = ref(null)
const exportModel: Ref<DatabaseType[]> = ref([])
const exportOptions = Object.values(DatabaseType).map((table) => ({
  value: table,
  label: table,
}))
const accessModel: Ref<Optional<DatabaseType>> = ref(null)
const accessOptions: Ref<DatabaseType[]> = ref(Object.values(DatabaseType))
// Danger Zone
const deleteModel: Ref<Optional<DatabaseType>> = ref(null)
const deleteOptions: Ref<DatabaseType[]> = ref(Object.values(DatabaseType))

const subscription = liveSettings().subscribe({
  next: (records) => {
    settings.value = records

    const logRetentionTime = records.find((s) => s.id === SettingId.LOG_RETENTION_TIME)?.value

    logRetentionIndex.value = Object.values(LogRetention).findIndex((i) => i === logRetentionTime)
  },
  error: (error) => {
    log.error('Error loading live settings', error)
  },
})

onUnmounted(() => {
  subscription.unsubscribe()
})

/**
 * Generates example logs that can be examined on the Logs table and the console.
 */
function onTestLogger(): void {
  log.debug('This is a Debug Log', { name: 'Debug' })
  log.info('This is an Info Log', { name: 'Info' })
  log.warn('This is a Warning Log', { name: 'Warning' })
  log.error('This is an Error Log', { name: 'Error' })
}

/**
 * Generate default demostration data for the app.
 */
async function onDefaults(): Promise<void> {
  confirmDialog(
    'Load Defaults',
    `Would you like the load defaults into the database?`,
    Icon.INFO,
    'info',
    async (): Promise<void> => {
      try {
        const randomLetter = (): string => {
          const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
          return alphabetLetters[Math.floor(Math.random() * alphabetLetters.length)]
        }

        const randomBoolean = (): boolean => {
          return Math.random() >= 0.5
        }

        const randomInt = (min: number, max: number): number => {
          return Math.floor(Math.random() * (max - min + 1) + min)
        }

        let initialTimestamp = new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 2 // minus two year

        const addDay = (timestamp: number): number => {
          const date = new Date(timestamp)
          date.setDate(date.getDate() + 1)
          return date.getTime()
        }

        const records: DatabaseRecord[] = []

        const createExamples = (count: number) => {
          for (let i = 0; i < count; i++) {
            records.push({
              [DatabaseField.TYPE]: DatabaseType.EXAMPLE,
              [DatabaseField.ID]: uid(),
              [DatabaseField.NAME]: `Example ${randomLetter()}`,
              [DatabaseField.DESCRIPTION]: `Example description ${i}`,
              [DatabaseField.IS_FAVORITED]: randomBoolean(),
              [DatabaseField.IS_ENABLED]: true,
            } as Example)

            initialTimestamp = addDay(initialTimestamp)
          }
        }

        const createExampleResults = (count: number, parent?: Example) => {
          for (let i = 0; i < count; i++) {
            records.push({
              [DatabaseField.TYPE]: DatabaseType.EXAMPLE_RESULT,
              [DatabaseField.ID]: uid(),
              [DatabaseField.CREATED_TIMESTAMP]: initialTimestamp,
              [DatabaseField.PARENT_ID]: parent?.id || `orphaned-record-id-${i}`,
              [DatabaseField.NOTE]: randomBoolean() ? `Previous note ${parent?.id}` : '',
              [DatabaseField.NUMBER]: randomInt(1, 100) + i / 2,
            } as ExampleResult)

            initialTimestamp = addDay(initialTimestamp)
          }
        }

        // Creating demo data
        createExamples(1)
        records.map((example) => createExampleResults(725, example)) // about 2 years of records
        // Unused parents and orphaned results
        createExamples(2)
        createExampleResults(2)

        records.push({
          [DatabaseField.TYPE]: DatabaseType.TEST,
          [DatabaseField.ID]: uid(),
          [DatabaseField.NAME]: `Lonely Test ${randomLetter()}`,
          [DatabaseField.DESCRIPTION]: 'Test description X',
          [DatabaseField.IS_FAVORITED]: false,
          [DatabaseField.IS_ENABLED]: true,
        } as Test)

        await bulkAddRecords(records)

        log.info('Defaults loaded', { count: records.length })
      } catch (error) {
        log.error('Failed to load defaults', error)
      }
    }
  )
}

/**
 * Called when a file has been rejected by the input.
 * @param entries
 */
function onRejectedFile(entries: any): void {
  const fileName = entries[0]?.importFile?.name || undefined
  log.warn(`Cannot import "${fileName}"`, entries)
}

/**
 * On confirmation, import your data from a JSON file.
 */
function onImportFile(): void {
  confirmDialog(
    'Import Data',
    `Import file ${importFile?.value?.name} and attempt to load data from it?`,
    Icon.INFO,
    'info',
    async (): Promise<void> => {
      try {
        const parsedFileData = JSON.parse(await importFile.value.text())

        consoleDebug('parsedFileData =', parsedFileData)

        const { appName, records } = parsedFileData

        // Do NOT allow importing data from another app
        if (parsedFileData?.appName !== AppText.APP_NAME) {
          throw new Error(`Cannot import data from this app: ${appName} `)
        }

        const types = Object.values(DatabaseType)

        const importedData = records?.filter((record: DatabaseRecord) =>
          types.includes(record.type)
        )

        consoleDebug('importedData =', importedData)

        await bulkAddRecords(importedData)

        importFile.value = null // Clear input

        log.info('Successfully imported available data')
      } catch (error) {
        log.error('Import failed', error)
      }
    }
  )
}

/**
 * On confirmation, export your records as a JSON file.
 */
function onExportRecords(types: DatabaseType[]): void {
  // Build export file name
  const appName = AppText.APP_NAME.toLowerCase().split(' ').join('-')
  const date = new Date().toISOString().split('T')[0]
  const filename = `export-${appName}-${date}.json`

  confirmDialog(
    'Export Data',
    `Export all of your data as the file ${filename}?`,
    Icon.INFO,
    'info',
    async (): Promise<void> => {
      try {
        // Get all data records from the database
        const records = await getAllRecords()

        // Include record in export if it is one of the selected types
        const exportRecords = records.filter((record) => types.includes(record.type))

        // Build export file meta data
        // TODO - this should be a type
        const exportData = {
          appName: AppText.APP_NAME,
          exportedTimestamp: new Date().getTime(),
          exportedRecordsCount: exportRecords.length,
          records: exportRecords,
        }

        consoleDebug('exportData =', exportData)

        // Attempt to download the export records as a JSON file
        const fileStatus = exportFile(filename, JSON.stringify(exportData), {
          encoding: 'UTF-8',
          mimeType: 'application/json',
        })

        if (fileStatus === true) {
          log.info('File downloaded successfully', { filename })
        } else {
          throw new Error('Browser denied file download')
        }
      } catch (error) {
        log.error('Export failed', error)
      }
    }
  )
}

/**
 * TODO
 * @param logRetentionIndex
 */
async function onChangeLogRetention(logRetentionIndex: number): Promise<void> {
  try {
    const logRetentionTime = Object.values(LogRetention)[logRetentionIndex]
    await setSetting(SettingId.LOG_RETENTION_TIME, logRetentionTime)
    log.info('Updated log retention time', { time: logRetentionTime, index: logRetentionIndex })
  } catch (error) {
    log.error('Log retention update failed', error)
  }
}

/**
 * TODO
 * @param table
 */
async function onDeleteTableData(table: DatabaseType): Promise<void> {
  confirmDialog(
    `Delete ${table} Data`,
    `Permanetly delete all ${table} data from the database?`,
    Icon.CLEAR,
    'negative',
    async (): Promise<void> => {
      try {
        await clearRecordsByType(table)
        await initSettings()
        log.info(`${table} data successfully deleted`)
      } catch (error) {
        log.error(`Error deleting ${table} data`, error)
      }
    }
  )
}

/**
 * On confirmation, deletes all items from all tables.
 */
async function onDeleteAllData(): Promise<void> {
  confirmDialog(
    'Delete All Data',
    'Permanetly delete all data from the database?',
    Icon.CLEAR,
    'negative',
    async (): Promise<void> => {
      try {
        await Promise.all(
          Object.values(DatabaseType).map(async (table) => await clearRecordsByType(table))
        )
        await initSettings()
        log.info('All data successfully deleted')
      } catch (error) {
        log.error('Error deleting all data', error)
      }
    }
  )
}

/**
 * On confirmation, completely deletes the database and all of its data (must reload the app after).
 */
async function onDeleteDatabase(): Promise<void> {
  confirmDialog(
    'Delete Database',
    'Delete the underlining database? All data will be lost. You must reload the website after this action to reinitialize the database.',
    Icon.CLEAR,
    'negative',
    async (): Promise<void> => {
      try {
        await deleteDatabase()
        notify('Reload the website now', Icon.WARN, 'warning')
      } catch (error) {
        log.error('Database deletion failed', error)
      }
    }
  )
}
</script>

<template>
  <ResponsivePage :banner-icon="Icon.SETTINGS" banner-title="Settings">
    <!-- Options -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Options</div>

        <!-- Toggles -->
        <div class="q-mb-md">
          Introduction provides instructions on the Home page on how to use the app.
        </div>

        <QToggle
          class="q-mb-md"
          label="Show Introduction"
          :model-value="settings.find((s) => s.id === SettingId.SHOW_INTRODUCTION)?.value"
          @update:model-value="setSetting(SettingId.SHOW_INTRODUCTION, $event)"
        />

        <div class="q-mb-md">
          Dark Mode allows you to switch between a light or dark theme for the app.
        </div>

        <QToggle
          class="q-mb-md"
          label="Dark Mode"
          :model-value="settings.find((s) => s.id === SettingId.DARK_MODE)?.value"
          @update:model-value="setSetting(SettingId.DARK_MODE, $event)"
        />

        <div class="q-mb-md">
          Show all columns while on the data table page or only show the default columns. You can
          change the individual columns while on the page.
        </div>

        <QToggle
          label="Show All Data Columns"
          :model-value="settings.find((s) => s.id === SettingId.SHOW_ALL_DATA_COLUMNS)?.value"
          @update:model-value="setSetting(SettingId.SHOW_ALL_DATA_COLUMNS, $event)"
        />
      </QCardSection>
    </QCard>

    <!-- Defaults -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Defaults</div>

        <!-- Examples -->
        <div class="q-mb-md">Load default Examples into the database.</div>

        <QBtn label="Load Examples" color="primary" @click="onDefaults()" />
      </QCardSection>
    </QCard>

    <!-- Data Management -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Data Management</div>

        <!-- Import -->
        <div class="q-mb-md">
          Import data into the database from a JSON file. The app expects the data in the file to be
          structured the same as the exported version.
        </div>

        <QFile
          v-model="importFile"
          dense
          outlined
          counter
          bottom-slots
          label="File Select"
          :max-file-size="Limit.FILESIZE"
          accept="application/json"
          @rejected="onRejectedFile"
        >
          <template v-slot:before>
            <QBtn :disable="!importFile" label="Import" color="primary" @click="onImportFile()" />
          </template>

          <template v-slot:append>
            <QIcon
              v-if="importFile"
              :name="Icon.CLOSE"
              class="cursor-pointer"
              @click.stop="importFile = null"
            />
          </template>
        </QFile>

        <!-- Export -->
        <div class="q-mb-md">
          Export the selected data tables as a JSON file. Do this on a regularly basis so you have a
          backup of your data.
        </div>

        <QOptionGroup
          class="q-mb-md"
          v-model="exportModel"
          :options="exportOptions"
          type="checkbox"
        />

        <QBtn
          class="q-mb-md"
          :disable="exportModel.length === 0"
          label="Export"
          color="primary"
          @click="onExportRecords(exportModel)"
        />

        <!-- Access Internal Tables -->
        <div class="q-mb-md">
          Access the internal {{ AppText.APP_NAME }} data tables if you need to troubleshoot issues.
        </div>

        <QSelect
          v-model="accessModel"
          outlined
          dense
          label="Database Type"
          :options="accessOptions"
          class="q-mb-md"
        >
          <template v-slot:before>
            <QBtn
              :disable="!accessModel"
              label="Access Data"
              color="primary"
              @click="goToData(accessModel as DatabaseType)"
            />
          </template>
        </QSelect>
      </QCardSection>
    </QCard>

    <!-- Logs -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Logs</div>

        <!-- Toggles -->
        <div class="q-mb-md">
          Show Console Logs will display all log messages in the developer console.
        </div>

        <QToggle
          class="q-mb-md"
          label="Show Console Logs"
          :model-value="settings.find((s) => s.id === SettingId.SHOW_CONSOLE_LOGS)?.value"
          @update:model-value="setSetting(SettingId.SHOW_CONSOLE_LOGS, $event)"
        />

        <div class="q-mb-md">Show Debug Messages will display debug level notification alerts.</div>

        <QToggle
          class="q-mb-md"
          label="Show Debug Messages"
          :model-value="settings.find((s) => s.id === SettingId.SHOW_DEBUG_MESSAGES)?.value"
          @update:model-value="setSetting(SettingId.SHOW_DEBUG_MESSAGES, $event)"
        />

        <div class="q-mb-md">Show Info Messages will display info level notification alerts.</div>

        <QToggle
          class="q-mb-md"
          label="Show Info Messages"
          :model-value="settings.find((s) => s.id === SettingId.SHOW_INFO_MESSAGES)?.value"
          @update:model-value="setSetting(SettingId.SHOW_INFO_MESSAGES, $event)"
        />

        <!-- Test Logger -->
        <div class="q-mb-md">
          Validate that your logging settings above are working as expected by using the test action
          below.
        </div>

        <QBtn class="q-mb-md" label="Test Logger" color="primary" @click="onTestLogger()" />

        <!-- Log Retention Time -->
        <div class="q-mb-md">
          Change log retention time below. Logs older than the selected time will be deleted. This
          functions retroactivley, so if you change the time to 3 months, all logs older than 3
          months will be deleted. Expired log processing occurs every time the app is loaded.
        </div>

        <QSlider
          v-model="logRetentionIndex"
          :label-value="Object.values(LogRetention)[logRetentionIndex]"
          class="q-mb-lg"
          color="primary"
          markers
          label-always
          switch-label-side
          :min="0"
          :max="5"
          :step="1"
          @change="(index) => onChangeLogRetention(index)"
        />
      </QCardSection>
    </QCard>

    <!-- DANGER ZONE -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 text-negative q-mb-md">DANGER ZONE</div>

        <div class="q-mb-md">
          The following operations cannot be undone. Consider exporting your data before proceeding.
        </div>

        <!-- Delete Table Data -->
        <div class="q-mb-md">Select a table and permanently delete all of its data.</div>

        <QSelect
          v-model="deleteModel"
          outlined
          dense
          label="Database Type"
          class="q-mb-md"
          :options="deleteOptions"
        >
          <template v-slot:before>
            <QBtn
              :disable="!deleteModel"
              label="Delete Data"
              color="negative"
              @click="onDeleteTableData(deleteModel as DatabaseType)"
            />
          </template>
        </QSelect>

        <!-- Delete All Data -->
        <div class="q-mb-md">Permanently delete all data from the database.</div>

        <QBtn class="q-mb-md" label="Delete All Data" color="negative" @click="onDeleteAllData()" />

        <!-- Delete Database -->
        <div class="q-mb-md">
          Delete the underlining database and all of its data (requires website reload).
        </div>

        <QBtn label="Delete Database" color="negative" @click="onDeleteDatabase()" />
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
