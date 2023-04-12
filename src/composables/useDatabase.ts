import { Dark, uid } from 'quasar'
import { liveQuery, type IndexableType } from 'dexie'
import {
  DatabaseField,
  DatabaseTable,
  DatabaseType,
  SettingId,
  Severity,
  type DatabaseChildType,
  type DatabaseParentType,
  type SettingValue,
} from '@/types/database'
import { LogRetention, type AppObject, Milliseconds } from '@/types/misc'
import type { DatabaseRecord, Log, Setting } from '@/types/models'
import { dexieWrapper } from '@/services/DexieWrapper'

/**
 * Composable for interacting with the Dexie database.
 */
export default function useDatabase() {
  /////////////////////////////////////////////////////////////////////////////
  //                                                                         //
  // MISCELLANEOUS                                                           //
  //                                                                         //
  /////////////////////////////////////////////////////////////////////////////

  // Only "Records" table is used by the app for now.
  const db = dexieWrapper[DatabaseTable.RECORDS]

  /**
   * Initializes all settings with existing or default values.
   */
  async function initSettings() {
    // Defaults are set after the nullish coalescing operator, which means no setting data was found
    const showIntroduction =
      (await getRecord(DatabaseType.SETTING, SettingId.SHOW_INTRODUCTION))?.value ?? true
    const darkMode = (await getRecord(DatabaseType.SETTING, SettingId.DARK_MODE))?.value ?? true
    const showAllDataColumns =
      (await getRecord(DatabaseType.SETTING, SettingId.SHOW_ALL_DATA_COLUMNS))?.value ?? false
    const showConsoleLogs =
      (await getRecord(DatabaseType.SETTING, SettingId.SHOW_CONSOLE_LOGS))?.value ?? false
    const showDebugMessages =
      (await getRecord(DatabaseType.SETTING, SettingId.SHOW_DEBUG_MESSAGES))?.value ?? false
    const showInfoMessages =
      (await getRecord(DatabaseType.SETTING, SettingId.SHOW_INFO_MESSAGES))?.value ?? true
    const logRetentionTime =
      (await getRecord(DatabaseType.SETTING, SettingId.LOG_RETENTION_TIME))?.value ??
      LogRetention.THREE_MONTHS

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
      setSetting(SettingId.LOG_RETENTION_TIME, logRetentionTime),
    ])
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                                                         //
  // LIVE QUERIES                                                            //
  //                                                                         //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Observable of the Settings database type.
   */
  function liveSettings() {
    return liveQuery(() =>
      db.where(DatabaseField.TYPE).equals(DatabaseType.SETTING).sortBy(DatabaseField.ID)
    )
  }

  /**
   * Observable of the Settings, Examples, and Tests database types sorted by name (when present).
   */
  function liveDashboard() {
    return liveQuery(() =>
      db
        .where(DatabaseField.TYPE)
        .anyOf(DatabaseType.SETTING, DatabaseType.EXAMPLE, DatabaseType.TEST)
        .sortBy(DatabaseField.NAME)
    )
  }

  /**
   * Observable of the provided database type sorted by the created timestamp.
   * @param type
   */
  function liveDataType(type: DatabaseType) {
    return liveQuery(() =>
      db.where(DatabaseField.TYPE).equals(type).sortBy(DatabaseField.CREATED_TIMESTAMP)
    )
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                                                         //
  // CREATE                                                                  //
  //                                                                         //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Create a new log record with the provided severity, label, and details.
   * @param severity
   * @param label
   * @param details
   */
  async function addLog(
    severity: Severity,
    label: string,
    details?: AppObject
  ): Promise<IndexableType> {
    const log: Log = {
      [DatabaseField.TYPE]: DatabaseType.LOG,
      [DatabaseField.ID]: uid(),
      [DatabaseField.CREATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.SEVERITY]: severity,
      [DatabaseField.LABEL]: label,
      [DatabaseField.DETAILS]: details,
    }

    return await db.add(log as DatabaseRecord)
  }

  /**
   * Create a new record.
   * @param record
   */
  async function addRecord(record: DatabaseRecord) {
    return await db.add(record)
  }

  /**
   * Bulk add records to the database. The new record ids will be returned.
   * @param records
   */
  async function bulkAddRecords(records: DatabaseRecord[]) {
    return await db.bulkAdd(records, { allKeys: true }) // allKeys returns the new record ids
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                                                         //
  // READ                                                                    //
  //                                                                         //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Gets ALL records from the database.
   */
  async function getAllRecords() {
    return await db.toArray()
  }

  /**
   * Get all records by database type.
   * @param type
   */
  async function getRecordsByType(type: DatabaseType) {
    return await db.where(DatabaseField.TYPE).equals(type).toArray()
  }

  /**
   * Get specific record by database type and id.
   * @param type
   * @param id
   */
  async function getRecord(type: DatabaseType, id: string | SettingId) {
    return await db.get([type, id])
  }

  /**
   * Get all enabled records by database parent type.
   * @param parentType
   */
  async function getEnabledParentRecords(parentType: DatabaseParentType) {
    return await db
      .where(DatabaseField.TYPE)
      .equals(parentType)
      .filter((r) => r[DatabaseField.IS_ENABLED] === true)
      .toArray()
  }

  /**
   * Gets the most recent child record by database child type and parent id.
   * @param childType
   * @param parentId
   */
  async function getPreviousChildRecord(childType: DatabaseChildType, parentId: string) {
    return (
      await db
        .where({ [DatabaseField.TYPE]: childType, [DatabaseField.PARENT_ID]: parentId })
        .sortBy(DatabaseField.CREATED_TIMESTAMP)
    ).reverse()[0]
  }

  /**
   * Gets all child records by database child type and parent id.
   * @param childType
   * @param parentId
   */
  async function getChildRecordsByParentId(
    childType: DatabaseChildType,
    parentId: string
  ): Promise<DatabaseRecord[]> {
    return await db
      .where({ [DatabaseField.TYPE]: childType, [DatabaseField.PARENT_ID]: parentId })
      .sortBy(DatabaseField.CREATED_TIMESTAMP)
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                                                         //
  // UPDATE                                                                  //
  //                                                                         //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Updates a setting record by id and value or creates a new one if it doesn't exist.
   * @param id
   * @param value
   */
  async function setSetting(id: SettingId, value: SettingValue) {
    const existingSetting = await getRecord(DatabaseType.SETTING, id)

    // Set Quasar dark mode if the key is for dark mode
    if (id === SettingId.DARK_MODE) {
      Dark.set(!!value) // Cast to boolean just in case
    }

    const setting: Setting = {
      [DatabaseField.TYPE]: DatabaseType.SETTING,
      [DatabaseField.ID]: id,
      [DatabaseField.VALUE]: value,
    }

    // Add or Update depending on if the Setting already exists
    if (!existingSetting) {
      return await db.add(setting as DatabaseRecord)
    } else {
      return await db.update([DatabaseType.SETTING, id], { value })
    }
  }

  /**
   * Updates a record by providing the database type, original id, and any properties you want to change.
   * @param type
   * @param originalId
   * @param updateProps
   */
  async function updateRecord(
    type: DatabaseType,
    originalId: string | SettingId,
    updateProps: Partial<DatabaseRecord>
  ) {
    return await db.update([type, originalId], updateProps)
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                                                         //
  // DELETE                                                                  //
  //                                                                         //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Deletes all logs that are older than the log retention time setting.
   */
  async function purgeExpiredLogs(): Promise<number> {
    const logRetentionTime = (await getRecord(DatabaseType.SETTING, SettingId.LOG_RETENTION_TIME))
      ?.value

    if (!logRetentionTime || logRetentionTime === LogRetention.FOREVER) {
      return 0 // No logs purged
    }

    const getLogRetentionMilliseconds = (logRetention: LogRetention): number => {
      return {
        [LogRetention.ONE_WEEK]: Milliseconds.PER_WEEK,
        [LogRetention.ONE_MONTH]: Milliseconds.PER_MONTH,
        [LogRetention.THREE_MONTHS]: Milliseconds.PER_THREE_MONTHS,
        [LogRetention.SIX_MONTHS]: Milliseconds.PER_SIX_MONTHS,
        [LogRetention.ONE_YEAR]: Milliseconds.PER_YEAR,
        [LogRetention.FOREVER]: Milliseconds.FOREVER, // This should never happen
      }[logRetention]
    }

    const logRetentionMilliseconds = getLogRetentionMilliseconds(logRetentionTime as LogRetention)

    // Get all logs
    const logs = (await db.where(DatabaseField.TYPE).equals(DatabaseType.LOG).toArray()) as Log[]

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

  /**
   * Delete specific record by database type and id.
   * @param type
   * @param id
   */
  async function deleteRecord(type: DatabaseType, id: string | SettingId) {
    return await db.delete([type, id])
  }

  /**
   * Delete all records by database type.
   * @param type
   */
  async function clearRecordsByType(type: DatabaseType) {
    await db.where(DatabaseField.TYPE).equals(type).delete()
  }

  /**
   * Delete the entire database. This will require an app reload.
   */
  async function deleteDatabase() {
    return await dexieWrapper.delete()
  }

  return {
    initSettings,
    liveSettings,
    liveDashboard,
    liveDataType,
    getPreviousChildRecord,
    setSetting,
    getRecord,
    getEnabledParentRecords,
    addLog,
    purgeExpiredLogs,
    getAllRecords,
    getRecordsByType,
    bulkAddRecords,
    clearRecordsByType,
    deleteDatabase,
    deleteRecord,
    updateRecord,
    addRecord,
    getChildRecordsByParentId,
  }
}
