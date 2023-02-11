import { type Ref, ref, computed } from 'vue'
import type { IDBExample, IDBExampleRecord, IDBTest, IDBTestRecord } from '@/models/models'
import { TableName } from '@/constants/globals'
import { Icon, AppText, SettingKey, ParentStatus, RecordStatus } from '@/constants/globals'
import { exportFile, uid } from 'quasar'
import useDBSettings from '@/use/useDBSettings'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDBCommon from '@/use/useDBCommon'
import useLogger from '@/use/useLogger'
import useSettingsStore from '@/stores/settings'

export default function useViewSettings() {
  const settingsStore = useSettingsStore()
  const { log, consoleDebug } = useLogger()
  const { initializeSettings, setSetting } = useDBSettings()
  const { confirmDialog } = useSimpleDialogs()
  const { getTable, clearTable, deleteDatabase, bulkAddItems } = useDBCommon()

  const importFile: Ref<any> = ref(null)

  const deleteDataOptions: Ref<TableName[]> = ref(Object.values(TableName))
  const deleteDataModel: Ref<TableName | null> = ref(null)

  //
  // Toggles
  //

  const showIntroduction = computed({
    get() {
      return !!settingsStore[SettingKey.SHOW_INTRODUCTION]
    },
    async set(bool: boolean) {
      await setSetting(SettingKey.SHOW_INTRODUCTION, bool)
    },
  })

  const darkMode = computed({
    get() {
      return !!settingsStore[SettingKey.DARK_MODE]
    },
    async set(bool: boolean) {
      await setSetting(SettingKey.DARK_MODE, bool)
    },
  })

  const showConsoleLogs = computed({
    get() {
      return !!settingsStore[SettingKey.SHOW_CONSOLE_LOGS]
    },
    async set(bool: boolean) {
      await setSetting(SettingKey.SHOW_CONSOLE_LOGS, bool)
    },
  })

  const showDebugMessages = computed({
    get() {
      return !!settingsStore[SettingKey.SHOW_DEBUG_MESSAGES]
    },
    async set(bool: boolean) {
      await setSetting(SettingKey.SHOW_DEBUG_MESSAGES, bool)
    },
  })

  const saveInfoMessages = computed({
    get() {
      return !!settingsStore[SettingKey.SAVE_INFO_MESSAGES]
    },
    async set(bool: boolean) {
      await setSetting(SettingKey.SAVE_INFO_MESSAGES, bool)
    },
  })

  /**
   * Generates example logs that can be examined on the Logs table and the console.
   */
  function onTestLogger(): void {
    log.debug('This is a Debug Log', {
      name: 'Debug',
      message: 'Debug message',
      stack: 'Debug stack trace',
    })
    log.info('This is an Info Log', {
      name: 'Info',
      message: 'Info message',
      stack: 'Info stack trace',
    })
    log.warn('This is a Warning Log', {
      name: 'Warning',
      message: 'Warning message',
      stack: 'Warning stack trace',
    })
    log.error('This is an Error Log', {
      name: 'Error',
      message: 'Error message',
      stack: 'Error stack trace',
    })
  }

  /**
   * Generate default Examples for the app.
   */
  async function onDefaultExamples(): Promise<void> {
    confirmDialog(
      'Load Default Examples',
      `Would you like the load default Examples into the database?`,
      Icon.INFO,
      'info',
      async (): Promise<void> => {
        try {
          const examples: IDBExample[] = []
          const exampleRecords: IDBExampleRecord[] = []
          const tests: IDBTest[] = []
          const testRecords: IDBTestRecord[] = []

          for (let i = 0; i < 3; i++) {
            const example: IDBExample = {
              id: uid(),
              createdTimestamp: new Date().getTime(),
              parentStatus: ParentStatus.ENABLED,
              name: `Example ${i}`,
              description: `Example ${i} description goes here.`,
              favorite: i % 2 === 0 ? true : false,
              exampleMessage: 'Example Test Message',
            }
            const exampleRecord: IDBExampleRecord = {
              id: uid(),
              createdTimestamp: new Date().getTime(),
              recordStatus: RecordStatus.COMPLETED,
              parentId: example.id,
              note: 'Example Record Note',
              exampleNumber: i,
            }
            const test: IDBTest = {
              id: uid(),
              createdTimestamp: new Date().getTime(),
              parentStatus: ParentStatus.ENABLED,
              name: `Example ${i}`,
              description: `Example ${i} description goes here.`,
              favorite: i % 2 === 0 ? true : false,
              exampleMessage: 'Example Test Message',
            }
            const testRecord: IDBTestRecord = {
              id: uid(),
              createdTimestamp: new Date().getTime(),
              recordStatus: RecordStatus.COMPLETED,
              parentId: example.id,
              note: 'Example Record Note',
              exampleNumber: i,
            }

            examples.push(example)
            exampleRecords.push(exampleRecord)
            tests.push(test)
            testRecords.push(testRecord)
          }

          await bulkAddItems(TableName.EXAMPLES, examples)
          await bulkAddItems(TableName.EXAMPLE_RECORDS, exampleRecords)
          await bulkAddItems(TableName.TESTS, tests)
          await bulkAddItems(TableName.TEST_RECORDS, testRecords)

          log.info('Default Examples loaded')
        } catch (error) {
          log.error('Failed to load default Examples', error)
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
   * Confirm if you want to import your data from a JSON file.
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

          // Use table keys as guide for what data can be imported
          const tableKeys = Object.values(TableName)

          // Only retrieve data stored under a matching table key
          const importData = tableKeys.reduce(
            (o, key: TableName) => ({ ...o, [key]: parsedFileData[key] || [] }),
            {} as any
          )

          consoleDebug('importData =', importData)

          await Promise.all(
            tableKeys.map((table: TableName) => bulkAddItems(table, importData[table]))
          )

          importFile.value = null // Clear input
          log.info('Imported available data')
        } catch (error) {
          log.error('Import failed', error)
        }
      }
    )
  }

  /**
   * Confirm if you want to export your data as a JSON file.
   */
  function onExportData(): void {
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
          // Use table keys as guide for what data can be exported
          const tableKeys = Object.values(TableName)

          // Get all data from each table
          const tableData = await Promise.all(
            tableKeys.map((table) => getTable(table as TableName))
          )

          // Converting the data array into a object with table names as keys
          const exportData = tableKeys.reduce((o, key, i) => ({ ...o, [key]: tableData[i] }), {})

          consoleDebug('exportData =', exportData)

          // Attempt to download the export data
          const fileStatus = exportFile(filename, JSON.stringify(exportData), {
            encoding: 'UTF-8',
            mimeType: 'application/json',
          })

          if (fileStatus === true) {
            log.info('File downloaded succesfully')
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
   * @todo
   * @param table
   */
  async function onDeleteTableData(table: TableName): Promise<void> {
    confirmDialog(
      `Delete ${table} Data`,
      `Permanetly delete all ${table} data from the database?`,
      Icon.DELETE,
      'negative',
      async (): Promise<void> => {
        try {
          await clearTable(table)
          await initializeSettings()
        } catch (error) {
          log.error(`Error deleting ${table} data`, error)
        }
      }
    )
  }

  /**
   * @todo
   */
  async function onDeleteAllData(): Promise<void> {
    confirmDialog(
      'Delete All Data',
      'Permanetly delete all data from the database?',
      Icon.DELETE,
      'negative',
      async (): Promise<void> => {
        try {
          await Promise.all(Object.values(TableName).map((table) => clearTable(table as TableName)))
          await initializeSettings()
        } catch (error) {
          log.error('Error deleting all data', error)
        }
      }
    )
  }

  /**
   * @todo
   */
  async function onDeleteDatabase(): Promise<void> {
    confirmDialog(
      'Delete Database',
      'Delete the underlining database? All data will be lost. You must reload the website after this action to reinitialize the database.',
      Icon.DELETE,
      'negative',
      async (): Promise<void> => {
        try {
          await deleteDatabase()
          log.error('Reload the website now')
        } catch (error) {
          log.error('Database deletion failed', error)
        }
      }
    )
  }

  return {
    showIntroduction,
    darkMode,
    showConsoleLogs,
    showDebugMessages,
    saveInfoMessages,
    importFile,
    deleteDataModel,
    deleteDataOptions,
    onTestLogger,
    onDefaultExamples,
    onRejectedFile,
    onImportFile,
    onExportData,
    onDeleteTableData,
    onDeleteAllData,
    onDeleteDatabase,
  }
}
