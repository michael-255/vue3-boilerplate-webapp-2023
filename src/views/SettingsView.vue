<script setup lang="ts">
import { exportFile } from 'quasar'
import { Icon } from '@/types/icons'
import { AppText, Limit, LogRetention } from '@/types/misc'
import { DatabaseType, SettingId } from '@/types/database'
import { type Ref, ref, onUnmounted } from 'vue'
import type { DatabaseRecord } from '@/types/models'
import useLogger from '@/composables/useLogger'
import useNotifications from '@/composables/useNotifications'
import useDialogs from '@/composables/useDialogs'
import useDefaults from '@/composables/useDefaults'
import useRoutables from '@/composables/useRoutables'
import ResponsivePage from '@/components/ResponsivePage.vue'
import DB from '@/services/LocalDatabase'

/**
 * The format of the JSON file from an export.
 */
export type ExportData = {
  appName: AppText.APP_NAME
  exportedTimestamp: number
  recordsCount: number
  records: DatabaseRecord[]
}

// Composables & Stores
const { log } = useLogger()
const { notify } = useNotifications()
const { confirmDialog } = useDialogs()
const { goToData } = useRoutables()
const { onDefaults } = useDefaults()

// Data
const settings: Ref<any[]> = ref([])
const logRetentionIndex: Ref<number> = ref(0)
const importFile: Ref<any> = ref(null)
const exportModel: Ref<DatabaseType[]> = ref([])
const exportOptions = Object.values(DatabaseType).map((type) => ({
  value: type,
  label: type,
}))
const accessOptions = ref(Object.values(DatabaseType))
const accessModel = ref(accessOptions.value[0])
const deleteOptions = ref(Object.values(DatabaseType))
const deleteModel = ref(deleteOptions.value[0])

const subscription = DB.liveSettings().subscribe({
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
 * Generates example logs that can be examined in the database and console.
 */
function onTestLogger() {
  log.debug('This is a Debug Log', { name: 'Debug' })
  log.info('This is an Info Log', { name: 'Info' })
  log.warn('This is a Warning Log', { name: 'Warning' })
  log.error('This is an Error Log', { name: 'Error' })
}

/**
 * Called when a file has been rejected by the input.
 * @param entries
 */
function onRejectedFile(entries: any) {
  const fileName = entries[0]?.importFile?.name || undefined
  log.warn(`Cannot import "${fileName}"`, entries)
}

/**
 * On confirmation, imports your data from a JSON file.
 */
function onImportFile() {
  confirmDialog(
    'Import Data',
    `Import file ${importFile?.value?.name} and attempt to load data from it?`,
    Icon.INFO,
    'info',
    async () => {
      try {
        const parsedFileData = JSON.parse(await importFile.value.text())

        log.silentDebug('parsedFileData =', parsedFileData)

        const { appName, records } = parsedFileData

        // Do NOT allow importing data from another app
        if (parsedFileData?.appName !== AppText.APP_NAME) {
          throw new Error(`Cannot import data from this app: ${appName} `)
        }

        const types = Object.values(DatabaseType)

        const importedData = records?.filter((record: DatabaseRecord) =>
          types.includes(record.type)
        )

        log.silentDebug('importedData =', importedData)

        await DB.bulkAddRecords(importedData)

        importFile.value = null // Clear input

        log.info('Successfully imported available data')
      } catch (error) {
        log.error('Import failed', error)
      }
    }
  )
}

/**
 * On confirmation, exports your records as a JSON file.
 */
function onExportRecords(types: DatabaseType[]) {
  // Build export file name
  const appName = AppText.APP_NAME.toLowerCase().split(' ').join('-')
  const date = new Date().toISOString().split('T')[0]
  const filename = `export-${appName}-${date}.json`

  confirmDialog(
    'Export Data',
    `Export all of your data as the file ${filename}?`,
    Icon.INFO,
    'info',
    async () => {
      try {
        // Get all data records from the database
        const records = await DB.getAllRecords()

        // Include record in export if it is one of the selected types
        const exportRecords = records.filter((record) => types.includes(record.type))

        // Build export file meta data
        const exportData = {
          appName: AppText.APP_NAME,
          exportedTimestamp: new Date().getTime(),
          recordsCount: exportRecords.length,
          records: exportRecords,
        } as ExportData

        log.silentDebug('exportData =', exportData)

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
 * Updates the log retention time in the database.
 * @param logRetentionIndex
 */
async function onChangeLogRetention(logRetentionIndex: number) {
  try {
    const logRetentionTime = Object.values(LogRetention)[logRetentionIndex]
    await DB.setSetting(SettingId.LOG_RETENTION_TIME, logRetentionTime)
    log.info('Updated log retention time', { time: logRetentionTime, index: logRetentionIndex })
  } catch (error) {
    log.error('Log retention update failed', error)
  }
}

/**
 * On confirmation, deletes all records of a specified type.
 * @param type
 */
async function onDeleteDataType(type: DatabaseType) {
  confirmDialog(
    `Delete ${type} Data`,
    `Permanetly delete all ${type} data from the database?`,
    Icon.CLEAR,
    'negative',
    async () => {
      try {
        await DB.clearRecordsByType(type)
        await DB.initSettings()
        log.info(`${type} data successfully deleted`)
      } catch (error) {
        log.error(`Error deleting ${type} data`, error)
      }
    }
  )
}

/**
 * On confirmation, deletes all records of any type from the database. Re-initializes the settings.
 */
async function onDeleteAllData() {
  confirmDialog(
    'Delete All Data',
    'Permanetly delete all data from the database?',
    Icon.CLEAR,
    'negative',
    async () => {
      try {
        await Promise.all(
          Object.values(DatabaseType).map(async (type) => await DB.clearRecordsByType(type))
        )
        await DB.initSettings()
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
async function onDeleteDatabase() {
  confirmDialog(
    'Delete Database',
    'Delete the underlining database? All data will be lost. You must reload the website after this action to reinitialize the database.',
    Icon.CLEAR,
    'negative',
    async (): Promise<void> => {
      try {
        await DB.deleteDatabase()
        notify('Reload the website now', Icon.WARN, 'warning')
      } catch (error) {
        log.error('Database deletion failed', error)
      }
    }
  )
}
</script>

<template>
  <ResponsivePage :bannerIcon="Icon.SETTINGS" bannerTitle="Settings">
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
          @update:model-value="DB.setSetting(SettingId.SHOW_INTRODUCTION, $event)"
        />

        <div class="q-mb-md">
          Dark Mode allows you to switch between a light or dark theme for the app.
        </div>

        <QToggle
          class="q-mb-md"
          label="Dark Mode"
          :model-value="settings.find((s) => s.id === SettingId.DARK_MODE)?.value"
          @update:model-value="DB.setSetting(SettingId.DARK_MODE, $event)"
        />

        <div class="q-mb-md">
          Show all columns while on the data table page or only show the default columns. You can
          change the individual columns while on the page.
        </div>

        <QToggle
          label="Show All Data Columns"
          :model-value="settings.find((s) => s.id === SettingId.SHOW_ALL_DATA_COLUMNS)?.value"
          @update:model-value="DB.setSetting(SettingId.SHOW_ALL_DATA_COLUMNS, $event)"
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
              @click="goToData(accessModel)"
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
          @update:model-value="DB.setSetting(SettingId.SHOW_CONSOLE_LOGS, $event)"
        />

        <div class="q-mb-md">Show Debug Messages will display debug level notification alerts.</div>

        <QToggle
          class="q-mb-md"
          label="Show Debug Messages"
          :model-value="settings.find((s) => s.id === SettingId.SHOW_DEBUG_MESSAGES)?.value"
          @update:model-value="DB.setSetting(SettingId.SHOW_DEBUG_MESSAGES, $event)"
        />

        <div class="q-mb-md">Show Info Messages will display info level notification alerts.</div>

        <QToggle
          class="q-mb-md"
          label="Show Info Messages"
          :model-value="settings.find((s) => s.id === SettingId.SHOW_INFO_MESSAGES)?.value"
          @update:model-value="DB.setSetting(SettingId.SHOW_INFO_MESSAGES, $event)"
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
              @click="onDeleteDataType(deleteModel)"
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
