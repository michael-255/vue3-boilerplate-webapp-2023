import type { AnyModel } from '@/constants/types'
import type { IndexableType } from 'dexie'
import { type Ref, ref, computed } from 'vue'
import type { Example, ExampleRecord, Test, TestRecord } from '@/models/models'
import { TableName } from '@/constants/globals'
import { Icon, AppText, SettingKey, ParentStatus, RecordStatus } from '@/constants/globals'
import { exportFile, uid } from 'quasar'
import { dexieWrapper } from '@/services/DexieWrapper'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDatabaseCommon from '@/use/useDatabaseCommon'
import useLogger from '@/use/useLogger'
import useSettingsStore from '@/stores/settings'

export default function useSettings() {
  const settingsStore = useSettingsStore()
  const { log, consoleDebug } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const { initializeSettings, setSetting } = useDatabaseCommon()

  /**
   * Bulk add items into a defined table. Do NOT mismatch tables and item types!
   * @param tableName (TableName)
   * @param items (Matching table model type)
   * @returns Array of imported item ids
   */
  async function bulkAddItems(tableName: TableName, items: AnyModel[]): Promise<IndexableType[]> {
    return await dexieWrapper.table(tableName).bulkAdd(items, { allKeys: true })
  }

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
          const examples: Example[] = []
          const exampleRecords: ExampleRecord[] = []
          const tests: Test[] = []
          const testRecords: TestRecord[] = []

          const greekLetters = [
            'Alpha',
            'Beta',
            'Gamma',
            'Delta',
            'Epsilon',
            'Zeta',
            'Eta',
            'Theta',
            'Iota',
            'Kappa',
            'Lambda',
            'Mu',
            'Nu',
            'Xi',
            'Omicron',
            'Pi',
            'Rho',
            'Sigma',
            'Tau',
            'Upsilon',
            'Phi',
            'Chi',
            'Psi',
            'Omega',
          ]

          const randomGreekLetter = (): string => {
            return greekLetters[Math.floor(Math.random() * greekLetters.length)]
          }

          const randomBoolean = (): boolean => {
            return Math.random() >= 0.5
          }

          let initialTimestamp = new Date('2023-01-01T00:00:00.000Z').getTime()

          const addDay = (timestamp: number): number => {
            const date = new Date(timestamp)
            date.setDate(date.getDate() + 1)
            return date.getTime()
          }

          const createExampleRecords = (example: Example): ExampleRecord[] => {
            const records: ExampleRecord[] = []

            for (let i = 0; i < 3; i++) {
              const record: ExampleRecord = {
                id: uid(),
                createdTimestamp: initialTimestamp,
                recordStatus: RecordStatus.COMPLETED,
                parentId: example.id,
                note: `Example Record Note ${i}`,
                exampleNumber: i,
              }
              records.push(record)
              initialTimestamp = addDay(initialTimestamp)
            }

            return records
          }

          const createTestRecords = (test: Test): TestRecord[] => {
            const records: TestRecord[] = []

            for (let i = 0; i < 3; i++) {
              const record: TestRecord = {
                id: uid(),
                createdTimestamp: initialTimestamp,
                recordStatus: RecordStatus.COMPLETED,
                parentId: test.id,
                note: `Test Record Note ${i}`,
                exampleNumber: i,
              }
              records.push(record)
              initialTimestamp = addDay(initialTimestamp)
            }

            return records
          }

          for (let i = 0; i < 3; i++) {
            const example: Example = {
              id: uid(),
              createdTimestamp: initialTimestamp,
              parentStatus: ParentStatus.ENABLED,
              name: `Example ${randomGreekLetter()} - ${i}`,
              description: `Example ${i} description goes here.`,
              favorite: randomBoolean(),
              exampleMessage: 'Example Message',
            }
            const exampleRecords = createExampleRecords(example)
            const test: Test = {
              id: uid(),
              createdTimestamp: initialTimestamp,
              parentStatus: ParentStatus.ENABLED,
              name: `Test ${randomGreekLetter()} - ${i}`,
              description: `Test ${i} description goes here.`,
              favorite: randomBoolean(),
              exampleMessage: 'Test Message',
            }
            const testRecords = createTestRecords(test)

            initialTimestamp = addDay(initialTimestamp)

            examples.push(example)
            exampleRecords.push(...exampleRecords)
            tests.push(test)
            testRecords.push(...testRecords)
          }

          await bulkAddItems(TableName.EXAMPLES, examples)
          await bulkAddItems(TableName.EXAMPLE_RECORDS, exampleRecords)
          await bulkAddItems(TableName.TESTS, tests)
          await bulkAddItems(TableName.TEST_RECORDS, testRecords)

          log.info('Defaults loaded')
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
            tableKeys.map((table) => dexieWrapper.table(table).toArray())
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
            log.info('File downloaded successfully')
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
  async function onDeleteTableData(tableName: TableName): Promise<void> {
    confirmDialog(
      `Delete ${tableName} Data`,
      `Permanetly delete all ${tableName} data from the database?`,
      Icon.CLEAR,
      'negative',
      async (): Promise<void> => {
        try {
          await dexieWrapper.table(tableName).clear()
          await initializeSettings()
          log.info(`${tableName} data successfully deleted`)
        } catch (error) {
          log.error(`Error deleting ${tableName} data`, error)
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
            Object.values(TableName).map((table) => dexieWrapper.table(table).clear())
          )
          await initializeSettings()
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
          await dexieWrapper.delete()
          log.warn('Reload the website now')
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
    onDefaults,
    onRejectedFile,
    onImportFile,
    onExportData,
    onDeleteTableData,
    onDeleteAllData,
    onDeleteDatabase,
  }
}
