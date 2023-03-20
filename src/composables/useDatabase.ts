import { Dark, uid } from 'quasar'
import { liveQuery, type IndexableType, type Observable } from 'dexie'
import {
  DatabaseField,
  DatabaseTable,
  DatabaseType,
  SettingId,
  Severity,
  type DatabaseParentType,
} from '@/types/database'
import { LogRetention, type AppObject } from '@/types/misc'
import type { DatabaseRecord, Log, Setting } from '@/types/models'
import { dexieWrapper } from '@/services/DexieWrapper'
import { getChildType } from '@/services/DatabaseUtils'

export default function useDatabase() {
  // Only table used by the app for now is the "Records" table.
  const db = dexieWrapper[DatabaseTable.RECORDS]

  // TODO
  async function initSettings(): Promise<void> {
    // Defaults are set after the nullish coalescing operator, which means no setting data was found
    const showIntroduction = (await getSetting(SettingId.SHOW_INTRODUCTION))?.value ?? true
    const darkMode = (await getSetting(SettingId.DARK_MODE))?.value ?? true
    const showAllDataColumns = (await getSetting(SettingId.SHOW_ALL_DATA_COLUMNS))?.value ?? false
    const showConsoleLogs = (await getSetting(SettingId.SHOW_CONSOLE_LOGS))?.value ?? false
    const showDebugMessages = (await getSetting(SettingId.SHOW_DEBUG_MESSAGES))?.value ?? false
    const showInfoMessages = (await getSetting(SettingId.SHOW_INFO_MESSAGES))?.value ?? false
    const dashboardListSelection =
      (await getSetting(SettingId.DASHBOARD_LIST_SELECTION))?.value ?? DatabaseType.EXAMPLES
    const logRetentionTime =
      (await getSetting(SettingId.LOG_RETENTION_TIME))?.value ?? LogRetention.THREE_MONTHS

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
      setSetting(SettingId.DASHBOARD_LIST_SELECTION, dashboardListSelection),
      setSetting(SettingId.LOG_RETENTION_TIME, logRetentionTime),
    ])
  }

  // TODO
  function liveSettings(): Observable<Setting[]> {
    return liveQuery(() => db.where(DatabaseField.TYPE).equals(DatabaseType.SETTINGS).toArray())
  }

  // TODO
  function liveDashboard(): Observable<DatabaseRecord[]> {
    return liveQuery(() =>
      db
        .where(DatabaseField.TYPE)
        .anyOf(DatabaseType.SETTINGS, DatabaseType.EXAMPLES, DatabaseType.TESTS)
        .toArray()
    )
  }

  // TODO
  async function getSetting(id: SettingId): Promise<any> {
    return await db.get([DatabaseType.SETTINGS, id])
  }

  // TODO
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
      return await db.add(setting as DatabaseRecord)
    } else {
      return await db.update([DatabaseType.SETTINGS, id], { value })
    }
  }

  // TODO
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

    return await db.add(log as DatabaseRecord)
  }

  // TODO
  async function purgeExpiredLogs(): Promise<number> {
    const logRetentionTime = (await getSetting(SettingId.LOG_RETENTION_TIME))?.value

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
    const logs = (await db.where(DatabaseField.TYPE).equals(DatabaseType.LOGS).toArray()) as Log[]

    const logsToDelete = logs.filter((log: Log) => {
      const logCreatedTimestamp = log[DatabaseField.CREATED_TIMESTAMP] ?? 0
      const logAgeMilliseconds = new Date().getTime() - logCreatedTimestamp
      return logAgeMilliseconds > logRetentionMilliseconds
    })

    // Delete all logs that are older than the retention time
    await db.bulkDelete(logsToDelete.map((log: Log) => log[DatabaseField.ID]))

    // Return the number of logs deleted
    return logsToDelete.length
  }

  // TODO
  async function getAllRecords() {
    return await db.toArray()
  }

  // TODO
  async function getRecordsByType(type: DatabaseType) {
    return await db.where(DatabaseField.TYPE).equals(type).toArray()
  }

  // TODO
  async function bulkAddRecords(records: DatabaseRecord[]) {
    // allKeys = true will ensure a list of added ids is returned
    return await db.bulkAdd(records, { allKeys: true })
  }

  // TODO
  async function clearRecordsByType(type: DatabaseType) {
    await db.where(DatabaseField.TYPE).equals(type).delete()
  }

  // TODO
  async function deleteDatabase() {
    return await dexieWrapper.delete()
  }

  // TODO
  async function getPreviousChildRecord(type: DatabaseParentType, id: string) {
    const childType = getChildType(type)
    return (
      await db
        .where({ [DatabaseField.TYPE]: childType, [DatabaseField.PARENT_ID]: id })
        .sortBy(DatabaseField.CREATED_TIMESTAMP)
    ).reverse()[0]
  }

  return {
    initSettings,
    liveSettings,
    liveDashboard,
    getPreviousChildRecord,
    getSetting,
    setSetting,
    addLog,
    purgeExpiredLogs,
    getAllRecords,
    getRecordsByType,
    bulkAddRecords,
    clearRecordsByType,
    deleteDatabase,
  }
}
