import { Dark, uid } from 'quasar'
import { liveQuery, type IndexableType, type Observable } from 'dexie'
import type { Log, Setting } from '@/models/models'
import {
  type AnyModel,
  type ParentModel,
  type ParentTable,
  type RecordModel,
  type RecordTable,
  type SettingValue,
  DatabaseTable,
  SettingKey,
  DatabaseField,
  Severity,
  AppText,
  LogRetention,
  ParentStatus,
} from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import { getRecordTable, getParentTable } from '@/services/DatabaseUtils'
import useSettingsStore from '@/stores/settings'

export default function useDatabase() {
  const settingsStore = useSettingsStore()

  ///////////////////////////////////////////////////////////////////////////////
  //                                                                           //
  //     Settings                                                              //
  //                                                                           //
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Sets the Settings to their database or default values.
   */
  async function initializeSettings(): Promise<void> {
    settingsStore.$reset()
    const settings: Setting[] = await dexieWrapper.table(DatabaseTable.SETTINGS).toArray()

    // Function that returns the Setting value field or undefined
    const findSettingValue = (key: SettingKey): SettingValue | undefined => {
      return settings.find((s: Setting) => s[DatabaseField.KEY] === key)?.value
    }

    // Defaults are set after the nullish coalescing operator, which means no setting data was found
    const showIntroduction = findSettingValue(SettingKey.SHOW_INTRODUCTION) ?? true
    const darkMode = findSettingValue(SettingKey.DARK_MODE) ?? true
    const showAllDataColumns = findSettingValue(SettingKey.SHOW_ALL_DATA_COLUMNS) ?? false
    const showConsoleLogs = findSettingValue(SettingKey.SHOW_CONSOLE_LOGS) ?? false
    const showDebugMessages = findSettingValue(SettingKey.SHOW_DEBUG_MESSAGES) ?? false
    const showInfoMessages = findSettingValue(SettingKey.SHOW_INFO_MESSAGES) ?? false
    const parentListSelection =
      findSettingValue(SettingKey.PARENT_LIST_SELECTION) ?? DatabaseTable.EXAMPLES
    const logRetentionTime =
      findSettingValue(SettingKey.LOG_RETENTION_TIME) ?? LogRetention.THREE_MONTHS

    // Set Quasar dark mode
    Dark.set(!!darkMode) // Cast to boolean

    // Set all settings before continuing
    await Promise.all([
      setSetting(SettingKey.SHOW_INTRODUCTION, showIntroduction),
      setSetting(SettingKey.DARK_MODE, darkMode),
      setSetting(SettingKey.SHOW_ALL_DATA_COLUMNS, showAllDataColumns),
      setSetting(SettingKey.SHOW_CONSOLE_LOGS, showConsoleLogs),
      setSetting(SettingKey.SHOW_DEBUG_MESSAGES, showDebugMessages),
      setSetting(SettingKey.SHOW_INFO_MESSAGES, showInfoMessages),
      setSetting(SettingKey.PARENT_LIST_SELECTION, parentListSelection),
      setSetting(SettingKey.LOG_RETENTION_TIME, logRetentionTime),
    ])
  }

  /**
   * Sets the Setting with the provided key to the provided value in the database. Also sets quasar dark mode.
   * @param key
   * @param value
   * @returns Added Setting key, or 1 on successful update
   */
  async function setSetting(key: SettingKey, value: SettingValue): Promise<IndexableType> {
    const existingSetting = await dexieWrapper
      .table(DatabaseTable.SETTINGS)
      .where(DatabaseField.KEY)
      .equalsIgnoreCase(key)
      .first()

    // Set Quasar dark mode if the key is for dark mode
    if (key === SettingKey.DARK_MODE) {
      Dark.set(!!value) // Cast to boolean
    }

    // Update setting store value
    settingsStore[key] = value

    // Add or Update depending on if the Setting already exists
    if (!existingSetting) {
      return await dexieWrapper.table(DatabaseTable.SETTINGS).add({ key, value } as Setting)
    } else {
      return await dexieWrapper.table(DatabaseTable.SETTINGS).update(key, { value })
    }
  }

  /**
   * TODO
   * @param key
   * @returns
   */
  async function getSettingByKey(key: SettingKey): Promise<SettingValue | undefined> {
    return await dexieWrapper
      .table(DatabaseTable.SETTINGS)
      .where(DatabaseField.KEY)
      .equalsIgnoreCase(key)
      .first()
  }

  ///////////////////////////////////////////////////////////////////////////////
  //                                                                           //
  //     Logs                                                                  //
  //                                                                           //
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * TODO
   * @param autoId
   * @returns
   */
  async function getLogById(autoId: number): Promise<Log | undefined> {
    return await dexieWrapper
      .table(DatabaseTable.LOGS)
      .where(DatabaseField.AUTO_ID)
      .equals(autoId)
      .first()
  }

  /**
   * Adds a Log to the database.
   * @param severity
   * @param label
   * @param error
   * @param location
   * @returns Id of new item
   */
  async function addLog(severity: Severity, label: string, details?: any): Promise<IndexableType> {
    const log: Log = {
      [DatabaseField.TIMESTAMP]: new Date().getTime(),
      [DatabaseField.SEVERITY]: severity,
      [DatabaseField.APP_NAME]: AppText.APP_NAME,
      [DatabaseField.LABEL]: label,
      [DatabaseField.DETAILS]: details,
    }

    return await dexieWrapper.table(DatabaseTable.LOGS).add(log)
  }

  /**
   * Deletes logs that are past the log retention time.
   * @returns Number of logs to be deleted
   */
  async function purgeExpiredLogs(): Promise<number> {
    const logRetentionTime = settingsStore[SettingKey.LOG_RETENTION_TIME]

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

    const logs = await dexieWrapper.table(DatabaseTable.LOGS).toArray()

    const logsToDelete = logs.filter((log: Log) => {
      const logAgeMilliseconds = new Date().getTime() - log[DatabaseField.TIMESTAMP]
      return logAgeMilliseconds > logRetentionMilliseconds
    })

    await dexieWrapper
      .table(DatabaseTable.LOGS)
      .bulkDelete(logsToDelete.map((log: Log) => log[DatabaseField.AUTO_ID] as number))

    return logsToDelete.length
  }

  ///////////////////////////////////////////////////////////////////////////////
  //                                                                           //
  //     Create                                                                //
  //                                                                           //
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * TODO
   * @param parentId
   * @param recordNote
   * @param exampleNumber
   * @returns Id of new item
   */
  async function addExampleRecord(
    parentId: string,
    recordNote?: string,
    exampleNumber?: number
  ): Promise<IndexableType> {
    return await dexieWrapper.table(DatabaseTable.EXAMPLE_RECORDS).add({
      [DatabaseField.ID]: uid(),
      [DatabaseField.CREATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.UPDATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.PARENT_ID]: parentId,
      [DatabaseField.NOTE]: recordNote,
      [DatabaseField.EXAMPLE_NUMBER]: Number(exampleNumber) || 0,
    })
  }

  /**
   * TODO
   * @param parentId
   * @param recordNote
   * @param exampleNumber
   * @returns Id of new item
   */
  async function addTestRecord(
    parentId: string,
    recordNote?: string,
    exampleNumber?: number
  ): Promise<IndexableType> {
    return await dexieWrapper.table(DatabaseTable.TEST_RECORDS).add({
      [DatabaseField.ID]: uid(),
      [DatabaseField.CREATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.UPDATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.PARENT_ID]: parentId,
      [DatabaseField.NOTE]: recordNote,
      [DatabaseField.EXAMPLE_NUMBER]: Number(exampleNumber) || 0,
    })
  }

  /**
   * Bulk add items into a defined table. Do NOT mismatch tables and item types!
   * @param table
   * @param items Must matching table model type
   * @returns Array of imported item ids
   */
  async function bulkAddItems(table: DatabaseTable, items: AnyModel[]): Promise<IndexableType[]> {
    return await dexieWrapper.table(table).bulkAdd(items, { allKeys: true })
  }

  ///////////////////////////////////////////////////////////////////////////////
  //                                                                           //
  //     Read                                                                  //
  //                                                                           //
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Do NOT make this function async. TODO
   * @param table
   * @returns Observable of Parent Table data
   */
  function liveQueryDashboard(table: ParentTable): Observable<ParentModel[]> {
    return liveQuery(() =>
      dexieWrapper
        .table(table)
        .orderBy(DatabaseField.NAME)
        .filter((item) => item[DatabaseField.PARENT_STATUS] === ParentStatus.ENABLED)
        .toArray()
    )
  }

  /**
   * Do NOT make this function async. TODO
   * @param table
   * @returns Observable of Database Table data
   */
  function liveQueryDataTable(table: DatabaseTable): Observable<any[]> {
    return liveQuery(() => dexieWrapper.table(table).toArray())
  }

  // TODO
  async function getUnusedParentIds(table: ParentTable): Promise<string[]> {
    const parents = await dexieWrapper.table(table).toArray()
    const records = await dexieWrapper.table(getRecordTable(table)).toArray()

    // Build array of parent ids
    const parentIds = parents.map((parent) => parent[DatabaseField.ID])

    const unusedParentIds: string[] = []

    parentIds.forEach((parentId) => {
      const hasRecord = records.some((record) => record[DatabaseField.PARENT_ID] === parentId)
      if (!hasRecord) unusedParentIds.push(parentId)
    })

    return unusedParentIds
  }

  // TODO
  async function getOrphanedRecordIds(table: RecordTable): Promise<string[]> {
    const records = await dexieWrapper.table(table).toArray()
    const parents = await dexieWrapper.table(getParentTable(table)).toArray()

    // Build array of parent ids
    const parentIds = parents.map((parent) => parent[DatabaseField.ID])

    const orphanedRecordIds: string[] = []

    records.forEach((record) => {
      const hasParent = parentIds.some((parentId) => parentId === record[DatabaseField.PARENT_ID])
      if (!hasParent) orphanedRecordIds.push(record[DatabaseField.ID])
    })

    return orphanedRecordIds
  }

  /**
   * Gets all data from a table.
   * @returns Database table data as an array
   */
  async function getTable(table: DatabaseTable): Promise<AnyModel[]> {
    return await dexieWrapper.table(table).toArray()
  }

  /**
   * Get first item by table and id.
   * @param table
   * @param id
   * @returns Single item or undefined
   */
  async function getItemById(table: DatabaseTable, id: string): Promise<AnyModel | undefined> {
    return await dexieWrapper.table(table).where(DatabaseField.ID).equalsIgnoreCase(id).first()
  }

  /**
   * Get most recent previous record item by parent id.
   * @param table
   * @param parentId
   * @returns Record item or undefined
   */
  async function getPreviousRecord(
    recordTable: RecordTable,
    parentId: string
  ): Promise<RecordModel | undefined> {
    return (
      await dexieWrapper
        .table(recordTable)
        .where(DatabaseField.PARENT_ID)
        .equalsIgnoreCase(parentId)
        .sortBy(DatabaseField.CREATED_TIMESTAMP)
    ).reverse()[0]
  }

  ///////////////////////////////////////////////////////////////////////////////
  //                                                                           //
  //     Update                                                                //
  //                                                                           //
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Force a live query update on a table by updating the updated timestamp.
   * @param table
   * @param id
   * @returns 1 on a successful update
   */
  async function forceLiveQueryUpdate(table: DatabaseTable, id: string) {
    await dexieWrapper
      .table(table)
      .update(id, { [DatabaseField.UPDATED_TIMESTAMP]: new Date().getTime() })
  }

  /**
   * Update provided properties on a table item by the originalId.
   * @param table
   * @param originalId
   * @param props
   * @returns 1 on a successful update
   */
  async function updateItem(
    table: ParentTable,
    originalId: string,
    props: Partial<ParentModel>
  ): Promise<IndexableType> {
    return await dexieWrapper.table(table).update(originalId, props)
  }

  ///////////////////////////////////////////////////////////////////////////////
  //                                                                           //
  //     Delete                                                                //
  //                                                                           //
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Delete item in table by id or key.
   * @param table
   * @param id id string, log number, or setting key
   * @returns undefined, even if nothing was deleted
   */
  async function deleteItem(table: DatabaseTable, id: string | number | SettingKey): Promise<void> {
    return await dexieWrapper.table(table).delete(id)
  }

  /**
   * TODO
   * @param table
   * @param ids
   * @returns undefined
   */
  async function bulkDeleteItems(table: DatabaseTable, ids: string[]): Promise<void> {
    return await dexieWrapper.table(table).bulkDelete(ids)
  }

  /**
   * Deletes all items from table.
   * @param table
   * @returns undefined
   */
  async function clearTable(table: DatabaseTable): Promise<void> {
    return await dexieWrapper.table(table).clear()
  }

  /**
   * Completely deletes the database and all of its data (must reload the app after).
   * @returns undefined
   */
  async function deleteDatabase(): Promise<void> {
    return await dexieWrapper.delete()
  }

  return {
    initializeSettings,
    setSetting,
    getSettingByKey,
    getLogById,
    purgeExpiredLogs,
    addLog,
    addExampleRecord,
    addTestRecord,
    forceLiveQueryUpdate,
    updateItem,
    liveQueryDashboard,
    liveQueryDataTable,
    getUnusedParentIds,
    getOrphanedRecordIds,
    getTable,
    getItemById,
    getPreviousRecord,
    bulkAddItems,
    deleteItem,
    bulkDeleteItems,
    clearTable,
    deleteDatabase,
  }
}
