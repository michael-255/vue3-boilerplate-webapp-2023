import { TableName } from '@/constants/globals'
import { Icon, AppString, SettingKey } from '@/constants/globals'
import { exportFile } from 'quasar'
import { type Ref, ref, computed } from 'vue'
import useDBSettings from '@/use/useDBSettings'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDBShared from '@/use/useDBShared'
import useLogger from '@/use/useLogger'
import useSettingsStore from '@/stores/settings'

export default function useSettingsView() {
  const settingsStore = useSettingsStore()
  const { log, consoleDebug } = useLogger()
  const { initializeSettings, setSetting } = useDBSettings()
  const { confirmDialog } = useSimpleDialogs()
  const { getTable, clearTable, deleteDatabase, importItems } = useDBShared()

  const importFile: Ref<any> = ref(null)

  const accessTableOptions: Ref<TableName[]> = ref(Object.values(TableName))
  const accessTableModel: Ref<TableName | null> = ref(null)

  const deleteDataOptions: Ref<TableName[]> = ref(Object.values(TableName))
  const deleteDataModel: Ref<TableName | null> = ref(null)

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
            tableKeys.map((table: TableName) => importItems(table, importData[table]))
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
    const appName = AppString.APP_NAME.toLowerCase().split(' ').join('-')
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

  async function onDeleteDatabase(): Promise<void> {
    confirmDialog(
      'Delete Database',
      'Delete the underlining database? All data will be lost. You must reload the website after this action to reinitialize the database.',
      Icon.DELETE,
      'negative',
      async (): Promise<void> => {
        try {
          await deleteDatabase()
          log.error('Reload the website now.')
        } catch (error) {
          log.error('Database deletion failed', error)
        }
      }
    )
  }

  return {
    darkMode,
    showConsoleLogs,
    showDebugMessages,
    saveInfoMessages,
    importFile,
    accessTableModel,
    accessTableOptions,
    deleteDataModel,
    deleteDataOptions,
    onTestLogger,
    onRejectedFile,
    onImportFile,
    onExportData,
    onDeleteTableData,
    onDeleteAllData,
    onDeleteDatabase,
  }
}
