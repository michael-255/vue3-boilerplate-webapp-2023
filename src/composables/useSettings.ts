import { type Ref, ref, onUnmounted } from 'vue'
import { exportFile, uid } from 'quasar'
import { DatabaseChildType, DatabaseParentType, DatabaseType, SettingId } from '@/types/database'
import { Icon } from '@/types/icons'
import { AppText, LogRetention } from '@/types/misc'
import type { DatabaseRecord, Example, ExampleResult } from '@/types/models'
import useSimpleDialogs from '@/composables/useSimpleDialogs'
import useDatabase from '@/composables/useDatabase'
import useLogger from '@/composables/useLogger'

export default function useSettings() {
  const { log, consoleDebug } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const {
    liveSettings,
    initSettings,
    setSetting,
    bulkAddItems,
    getTable,
    clearTable,
    deleteDatabase,
    getUnusedParentIds,
    getOrphanedRecordIds,
    bulkDeleteItems,
  } = useDatabase()

  const settings: Ref<any[]> = ref([])
  const logRetentionIndex: Ref<number> = ref(0)
  const importFile: Ref<any> = ref(null)
  const deleteDataOptions: Ref<DatabaseType[]> = ref(Object.values(DatabaseType))
  const deleteDataModel: Ref<DatabaseType | null> = ref(null)
  const exportTableModel: Ref<DatabaseType[]> = ref([])
  const exportTableOptions = Object.values(DatabaseType).map((table) => ({
    value: table,
    label: table,
  }))

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

          const examples: Example[] = []
          const exampleRecords: ExampleResult[] = []

          const createExamples = (count: number) => {
            for (let i = 0; i < count; i++) {
              examples.push({
                type: DatabaseType.EXAMPLES,
                id: uid(),
                name: `Parent ${randomLetter()}`,
                text: `Parent Description ${i}`,
                isFavorited: randomBoolean(),
                isEnabled: randomBoolean(),
              })

              initialTimestamp = addMinute(initialTimestamp)
            }
          }

          const createExampleRecords = (count: number, parent?: Example) => {
            for (let i = 0; i < count; i++) {
              exampleRecords.push({
                type: DatabaseType.EXAMPLE_RESULTS,
                id: uid(),
                createdTimestamp: initialTimestamp,
                parentId: parent?.id || `orphaned-record-id-${i}`,
                text: randomBoolean() ? `Previous record note = ${parent?.id} [${i}]` : '',
                number: randomInt(1, 100),
              })

              initialTimestamp = addMinute(initialTimestamp)
            }
          }

          // Create demo data here...
          createExamples(2) // Unused parent items
          createExampleRecords(2) // Orphaned record items
          createExamples(5)
          examples.map((example) => createExampleRecords(2, example))

          await bulkAddItems(DatabaseType.EXAMPLES, examples)
          await bulkAddItems(DatabaseType.EXAMPLE_RESULTS, exampleRecords)
          await bulkAddItems(DatabaseType.TESTS, [
            {
              id: uid(),
              createdTimestamp: new Date().getTime(),
              name: 'Lonely Test',
              text: 'Test Description',
              isFavorited: false,
            },
          ])

          log.info('Defaults loaded', { count: examples.length + exampleRecords.length })
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
          // Imports data properties it can parse that are defined below.
          const parsedFileData = JSON.parse(await importFile.value.text())

          // Only retrieve data stored under a matching table key
          // TODO - Manually add new keys for data here???
          const importData = Object.values(DatabaseType).reduce(
            (accumulateObject, key: DatabaseType) => {
              return {
                ...accumulateObject,
                [key]: parsedFileData[key] || [],
              }
            },
            {} as DatabaseRecord
          )

          consoleDebug('importData =', importData)

          await Promise.all(
            Object.values(DatabaseType).map(
              async (table: DatabaseType) => await bulkAddItems(table, importData[table])
            )
          )

          importFile.value = null // Clear input
          log.info('Successfully imported available data')
        } catch (error) {
          log.error('Import failed', error)
        }
      }
    )
  }

  /**
   * On confirmation, export your data as a JSON file.
   */
  function onExportData(tables: DatabaseType[]): void {
    const appName = AppText.APP_NAME.toLowerCase().split(' ').join('-')
    const date = new Date().toISOString().split('T')[0]
    const filename = `export-${appName}-${date}.json`

    confirmDialog(
      'Export',
      `Export the file "${filename}" with all of your data?`,
      Icon.INFO,
      'info',
      async (): Promise<void> => {
        try {
          // Get all data from each table
          const tableData = await Promise.all(tables.map(async (table) => await getTable(table)))

          // Converting the data array into an object with table names as keys
          const exportData = tables.reduce((o, key, i) => ({ ...o, [key]: tableData[i] }), {})

          consoleDebug('exportData =', exportData)

          // Attempt to download the export data
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
          await clearTable(table)
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
        try {
          Object.values(DatabaseParentType).map(async (table) => {
            const parentIds = await getUnusedParentIds(table)
            await bulkDeleteItems(table, parentIds)
          })
          log.info('successfully deleted unused parents')
        } catch (error) {
          log.error('Error deleting unused parent data', error)
        }
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
        try {
          Object.values(DatabaseChildType).map(async (table) => {
            const recordIds = await getOrphanedRecordIds(table)
            await bulkDeleteItems(table, recordIds)
          })
          log.info('successfully deleted orphaned records')
        } catch (error) {
          log.error('Error deleting orphaned record data', error)
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
            Object.values(DatabaseType).map(async (table) => await clearTable(table))
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
          log.warn('Reload the website now')
        } catch (error) {
          log.error('Database deletion failed', error)
        }
      }
    )
  }

  return {
    settings,
    importFile,
    deleteDataOptions,
    deleteDataModel,
    exportTableOptions,
    exportTableModel,
    logRetentionIndex,
    onTestLogger,
    onDefaults,
    onRejectedFile,
    onImportFile,
    onExportData,
    onChangeLogRetention,
    onDeleteUnusedData,
    onDeleteOrphanedData,
    onDeleteTableData,
    onDeleteAllData,
    onDeleteDatabase,
  }
}
