import { Dark, uid } from 'quasar'
import { liveQuery, type IndexableType, type Observable } from 'dexie'
import { DatabaseField, DatabaseTable, DatabaseType, SettingId, Severity } from '@/types/database'
import { LogRetention, type AppObject, type Optional } from '@/types/misc'
import type { DatabaseRecord, Log, Setting } from '@/types/models'
import { dexieWrapper } from '@/services/DexieWrapper'

export default function useDatabase() {
  // Only table used by the app for now is the "Records" table.
  const records = dexieWrapper[DatabaseTable.RECORDS]

  async function initSettings(): Promise<void> {
    const settings: Setting[] = await records
      .where(DatabaseField.TYPE)
      .equals(DatabaseType.SETTINGS)
      .toArray()

    // Function that returns the Setting value field or undefined
    const findSettingValue = (id: SettingId): any => {
      return settings.find((s: Setting) => s[DatabaseField.ID] === id)?.value
    }

    // Defaults are set after the nullish coalescing operator, which means no setting data was found
    const showIntroduction = findSettingValue(SettingId.SHOW_INTRODUCTION) ?? true
    const darkMode = findSettingValue(SettingId.DARK_MODE) ?? true
    const showAllDataColumns = findSettingValue(SettingId.SHOW_ALL_DATA_COLUMNS) ?? false
    const showConsoleLogs = findSettingValue(SettingId.SHOW_CONSOLE_LOGS) ?? false
    const showDebugMessages = findSettingValue(SettingId.SHOW_DEBUG_MESSAGES) ?? false
    const showInfoMessages = findSettingValue(SettingId.SHOW_INFO_MESSAGES) ?? false
    const dashboardListSelection =
      findSettingValue(SettingId.DASHBOARD_LIST_SELECTIONG) ?? DatabaseType.EXAMPLES
    const logRetentionTime =
      findSettingValue(SettingId.LOG_RETENTION_TIME) ?? LogRetention.THREE_MONTHS

    // Set Quasar dark mode
    Dark.set(!!darkMode) // Cast to boolean

    // Set all settings before continuing
    await Promise.all([
      setSetting(SettingId.SHOW_INTRODUCTION, showIntroduction),
      setSetting(SettingId.DARK_MODE, darkMode),
      setSetting(SettingId.SHOW_ALL_DATA_COLUMNS, showAllDataColumns),
      setSetting(SettingId.SHOW_CONSOLE_LOGS, showConsoleLogs),
      setSetting(SettingId.SHOW_DEBUG_MESSAGES, showDebugMessages),
      setSetting(SettingId.SHOW_INFO_MESSAGES, showInfoMessages),
      setSetting(SettingId.DASHBOARD_LIST_SELECTIONG, dashboardListSelection),
      setSetting(SettingId.LOG_RETENTION_TIME, logRetentionTime),
    ])
  }

  function liveSettings(): Observable<Setting[]> {
    return liveQuery(() =>
      records.where(DatabaseField.TYPE).equals(DatabaseType.SETTINGS).toArray()
    )
  }

  async function getSetting(id: SettingId): Promise<Optional<Setting>> {
    return await records.get([DatabaseType.SETTINGS, id])
  }

  async function setSetting(id: SettingId, value: any): Promise<IndexableType> {
    const existingSetting = await getSetting(id)

    // Set Quasar dark mode if the key is for dark mode
    if (id === SettingId.DARK_MODE) {
      Dark.set(!!value) // Cast to boolean just in case
    }

    const setting: Setting = {
      [DatabaseField.TYPE]: DatabaseType.SETTINGS,
      [DatabaseField.ID]: id,
      [DatabaseField.VALUE]: value,
    }

    // Add or Update depending on if the Setting already exists
    if (!existingSetting) {
      return await records.add(setting as DatabaseRecord)
    } else {
      return await records.update([DatabaseType.SETTINGS, id], { value })
    }
  }

  async function addLog(
    severity: Severity,
    name: string,
    details?: AppObject
  ): Promise<IndexableType> {
    const log: Log = {
      [DatabaseField.TYPE]: DatabaseType.LOGS,
      [DatabaseField.ID]: uid(),
      [DatabaseField.CREATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.SEVERITY]: severity,
      [DatabaseField.NAME]: name,
      [DatabaseField.DETAILS]: details,
    }

    return await records.add(log as DatabaseRecord)
  }

  async function purgeExpiredLogs(): Promise<number> {
    const logRetentionTime = (await getSetting(SettingId.LOG_RETENTION_TIME))?.value as LogRetention

    if (!logRetentionTime || logRetentionTime === LogRetention.FOREVER) {
      return 0 // No logs purged
    }

    const getLogRetentionMilliseconds = (logRetention: LogRetention): number => {
      return {
        [LogRetention.ONE_WEEK]: 7 * 24 * 60 * 60 * 1000,
        [LogRetention.ONE_MONTH]: 30 * 24 * 60 * 60 * 1000,
        [LogRetention.THREE_MONTHS]: 90 * 24 * 60 * 60 * 1000,
        [LogRetention.SIX_MONTHS]: 180 * 24 * 60 * 60 * 1000,
        [LogRetention.ONE_YEAR]: 365 * 24 * 60 * 60 * 1000,
        [LogRetention.FOREVER]: Infinity, // This should never happen
      }[logRetention]
    }

    const logRetentionMilliseconds = getLogRetentionMilliseconds(logRetentionTime)

    // Get all logs
    const logs = (await records
      .where(DatabaseField.TYPE)
      .equals(DatabaseType.LOGS)
      .toArray()) as Log[]

    const logsToDelete = logs.filter((log: Log) => {
      const logCreatedTimestamp = log[DatabaseField.CREATED_TIMESTAMP] ?? 0
      const logAgeMilliseconds = new Date().getTime() - logCreatedTimestamp
      return logAgeMilliseconds > logRetentionMilliseconds
    })

    // Delete all logs that are older than the retention time
    await records.bulkDelete(logsToDelete.map((log: Log) => log[DatabaseField.ID]))

    // Return the number of logs deleted
    return logsToDelete.length
  }

  return { initSettings, liveSettings, getSetting, setSetting, addLog, purgeExpiredLogs }
}
