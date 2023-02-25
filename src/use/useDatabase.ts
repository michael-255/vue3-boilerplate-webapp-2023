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
  RecordStatus,
  AppText,
  LogRetention,
  ParentStatus,
} from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
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
    const showConsoleLogs = findSettingValue(SettingKey.SHOW_CONSOLE_LOGS) ?? false
    const showDebugMessages = findSettingValue(SettingKey.SHOW_DEBUG_MESSAGES) ?? false
    const showInfoMessages = findSettingValue(SettingKey.SHOW_INFO_MESSAGES) ?? false
    const parentListSelection =
      findSettingValue(SettingKey.PARENT_LIST_SELECTION) ?? DatabaseTable.EXAMPLES
    const logRetentionTime =
      findSettingValue(SettingKey.LOG_RETENTION_TIME) ?? LogRetention.THREE_MONTHS
    // const favoriteParentIds = findSettingValue(SettingKey.FAVORITE_PARENT_IDS) ?? []
    // const orphanedRecordIds = findSettingValue(SettingKey.ORPHANED_RECORD_IDS) ?? []
    // const activeRecordIds = findSettingValue(SettingKey.ACTIVE_RECORD_IDS) ?? []
    // const parentsTableVisibleColumns = findSettingValue(
    //   SettingKey.PARENTS_TABLE_VISIBLE_COLUMNS
    // ) ?? [Field.NAME]
    // const recordsTableVisibleColumns = findSettingValue(
    //   SettingKey.RECORDS_TABLE_VISIBLE_COLUMNS
    // ) ?? [Field.PARENT_ID]

    // Set Quasar dark mode
    Dark.set(!!darkMode) // Cast to boolean

    // Set all settings before continuing
    await Promise.all([
      setSetting(SettingKey.SHOW_INTRODUCTION, showIntroduction),
      setSetting(SettingKey.DARK_MODE, darkMode),
      setSetting(SettingKey.SHOW_CONSOLE_LOGS, showConsoleLogs),
      setSetting(SettingKey.SHOW_DEBUG_MESSAGES, showDebugMessages),
      setSetting(SettingKey.SHOW_INFO_MESSAGES, showInfoMessages),
      setSetting(SettingKey.PARENT_LIST_SELECTION, parentListSelection),
      setSetting(SettingKey.LOG_RETENTION_TIME, logRetentionTime),
      // setSetting(SettingKey.FAVORITE_PARENT_IDS, favoriteParentIds),
      // setSetting(SettingKey.ORPHANED_RECORD_IDS, orphanedRecordIds),
      // setSetting(SettingKey.ACTIVE_RECORD_IDS, activeRecordIds),
      // setSetting(SettingKey.PARENTS_TABLE_VISIBLE_COLUMNS, parentsTableVisibleColumns),
      // setSetting(SettingKey.RECORDS_TABLE_VISIBLE_COLUMNS, recordsTableVisibleColumns),
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
   * TODO
   * @param parentId
   * @param exampleNumber
   * @returns Id of new item
   */
  async function addExampleRecord(
    parentId: string,
    exampleNumber?: number
  ): Promise<IndexableType> {
    return await dexieWrapper.table(DatabaseTable.EXAMPLE_RECORDS).add({
      [DatabaseField.ID]: uid(),
      [DatabaseField.CREATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.UPDATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.PARENT_ID]: parentId,
      [DatabaseField.RECORD_STATUS]: RecordStatus.FINISHED,
      [DatabaseField.NOTE]: '',
      [DatabaseField.EXAMPLE_NUMBER]: Number(exampleNumber) || 0,
    })
  }

  /**
   * TODO
   * @param parentId
   * @param exampleNumber
   * @returns Id of new item
   */
  async function addTestRecord(parentId: string, exampleNumber?: number): Promise<IndexableType> {
    return await dexieWrapper.table(DatabaseTable.TEST_RECORDS).add({
      [DatabaseField.ID]: uid(),
      [DatabaseField.CREATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.UPDATED_TIMESTAMP]: new Date().getTime(),
      [DatabaseField.PARENT_ID]: parentId,
      [DatabaseField.RECORD_STATUS]: RecordStatus.FINISHED,
      [DatabaseField.NOTE]: '',
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
    purgeExpiredLogs,
    addLog,
    addExampleRecord,
    addTestRecord,
    forceLiveQueryUpdate,
    updateItem,
    liveQueryDashboard,
    getTable,
    getItemById,
    getPreviousRecord,
    bulkAddItems,
    deleteItem,
    clearTable,
    deleteDatabase,
  }
}
