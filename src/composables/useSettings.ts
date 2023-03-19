import { type Ref, ref, onUnmounted } from 'vue'
import { exportFile, uid } from 'quasar'
import { DatabaseParentType, DatabaseType, SettingId } from '@/types/database'
import { Icon } from '@/types/icons'
import { AppText, LogRetention, type Optional } from '@/types/misc'
import type { DatabaseRecord, Example, ExampleResult, Test } from '@/types/models'
import { RouteName } from '@/router/route-names'
import { useRouter } from 'vue-router'
import { slugify } from '@/utils/common'
import useSimpleDialogs from '@/composables/useSimpleDialogs'
import useDatabase from '@/composables/useDatabase'
import useLogger from '@/composables/useLogger'
import useNotifications from '@/composables/useNotifications'

export default function useSettings() {
  const { log, consoleDebug } = useLogger()
  const { notify } = useNotifications()
  const { confirmDialog } = useSimpleDialogs()
  const router = useRouter()
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

      const logRetentionTime = settings.value.find(
        (s) => s.id === SettingId.LOG_RETENTION_TIME
      )?.value

      logRetentionIndex.value = Object.values(LogRetention).findIndex((i) => i === logRetentionTime)
    },
    error: (error) => {
      log.error('Error loading settings', error)
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
          const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

          const randomLetter = (): string => {
            return alphabetLetters[Math.floor(Math.random() * alphabetLetters.length)]
          }

          const randomBoolean = (): boolean => {
            return Math.random() >= 0.5
          }

          const randomInt = (min: number, max: number): number => {
            return Math.floor(Math.random() * (max - min + 1) + min)
          }

          let initialTimestamp = new Date().getTime() - 30 * 24 * 60 * 60 * 1000

          const addMinute = (timestamp: number): number => {
            const date = new Date(timestamp)
            date.setMinutes(date.getMinutes() + 1)
            return date.getTime()
          }

          const records: DatabaseRecord[] = []

          const createExamples = (count: number) => {
            for (let i = 0; i < count; i++) {
              records.push({
                type: DatabaseType.EXAMPLES,
                id: uid(),
                name: `Example ${randomLetter()}`,
                text: `Example Description ${i}`,
                isFavorited: randomBoolean(),
                isEnabled: randomBoolean(),
              } as Example)

              initialTimestamp = addMinute(initialTimestamp)
            }
          }

          const createExampleResults = (count: number, parent?: Example) => {
            for (let i = 0; i < count; i++) {
              records.push({
                type: DatabaseType.EXAMPLE_RESULTS,
                id: uid(),
                createdTimestamp: initialTimestamp,
                parentId: parent?.id || `orphaned-record-id-${i}`,
                text: randomBoolean() ? `Previous record note = ${parent?.id} [${i}]` : '',
                number: randomInt(1, 100),
              } as ExampleResult)

              initialTimestamp = addMinute(initialTimestamp)
            }
          }

          // Creating demo data
          createExamples(5)
          records.map((example) => createExampleResults(2, example))
          // Unused parents and orphaned results
          createExamples(2)
          createExampleResults(2)

          records.push({
            type: DatabaseType.TESTS,
            id: uid(),
            name: 'Lonely Test',
            text: 'Test Description',
            isFavorited: false,
            isEnabled: true,
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
      'Import',
      `Import file "${importFile.value.name}" and attempt to load data from it?`,
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
      'Export',
      `Export the file "${filename}" with all of your records?`,
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
   * @param databaseType
   */
  async function onAccessData(databaseType: DatabaseType) {
    try {
      router.push({
        name: RouteName.DATA,
        params: { databaseTypeSlug: slugify(databaseType) },
      })
    } catch (error) {
      log.error('Error accessing data type', error)
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
   * TODO
   */
  async function onDeleteUnusedData(): Promise<void> {
    confirmDialog(
      'Delete Unused Data',
      `Permanetly delete all unused parent data from the database?`,
      Icon.CLEAR,
      'negative',
      async (): Promise<void> => {
        // try {
        //   Object.values(DatabaseParentType).map(async (table) => {
        //     const parentIds = await getUnusedParentIds(table)
        //     await bulkDeleteItems(table, parentIds)
        //   })
        //   log.info('successfully deleted unused parents')
        // } catch (error) {
        //   log.error('Error deleting unused parent data', error)
        // }
      }
    )
  }

  /**
   * TODO
   */
  async function onDeleteOrphanedData(): Promise<void> {
    confirmDialog(
      'Delete Orphaned Data',
      `Permanetly delete all orphaned record data from the database?`,
      Icon.CLEAR,
      'negative',
      async (): Promise<void> => {
        // try {
        //   Object.values(DatabaseChildType).map(async (table) => {
        //     const recordIds = await getOrphanedRecordIds(table)
        //     await bulkDeleteItems(table, recordIds)
        //   })
        //   log.info('successfully deleted orphaned records')
        // } catch (error) {
        //   log.error('Error deleting orphaned record data', error)
        // }
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

  return {
    settings,
    importFile,
    exportModel,
    exportOptions,
    logRetentionIndex,
    accessModel,
    accessOptions,
    deleteModel,
    deleteOptions,
    onAccessData,
    onTestLogger,
    onDefaults,
    onRejectedFile,
    onImportFile,
    onExportRecords,
    onChangeLogRetention,
    onDeleteUnusedData,
    onDeleteOrphanedData,
    onDeleteTableData,
    onDeleteAllData,
    onDeleteDatabase,
  }
}
