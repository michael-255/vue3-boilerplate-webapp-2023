import { Dark, uid } from 'quasar'
import type { IndexableType } from 'dexie'
import type {
  AnyModel,
  ParentModel,
  ParentTable,
  RecordModel,
  RecordTable,
  SettingValue,
} from '@/constants/types'
import type { Log, Setting } from '@/models/models'
import { TableName, SettingKey, Field, Severity, RecordStatus, AppText } from '@/constants/globals'
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
    const settings: Setting[] = await dexieWrapper.table(TableName.SETTINGS).toArray()

    // Function that returns the Setting value field or undefined
    const findSettingValue = (key: SettingKey): SettingValue | undefined => {
      return settings.find((s: Setting) => s[Field.KEY] === key)?.value
    }

    // Defaults are set after the nullish coalescing operator, which means no setting data was found
    const showIntroduction = findSettingValue(SettingKey.SHOW_INTRODUCTION) ?? true
    const darkMode = findSettingValue(SettingKey.DARK_MODE) ?? true
    const showConsoleLogs = findSettingValue(SettingKey.SHOW_CONSOLE_LOGS) ?? false
    const showDebugMessages = findSettingValue(SettingKey.SHOW_DEBUG_MESSAGES) ?? false
    const saveInfoMessages = findSettingValue(SettingKey.SAVE_INFO_MESSAGES) ?? false
    const parentListSelection =
      findSettingValue(SettingKey.PARENT_LIST_SELECTION) ?? TableName.EXAMPLES
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
      setSetting(SettingKey.SAVE_INFO_MESSAGES, saveInfoMessages),
      setSetting(SettingKey.PARENT_LIST_SELECTION, parentListSelection),
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
      .table(TableName.SETTINGS)
      .where(Field.KEY)
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
      return await dexieWrapper.table(TableName.SETTINGS).add({ key, value } as Setting)
    } else {
      return await dexieWrapper.table(TableName.SETTINGS).update(key, { value })
    }
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
   * @returns Id of new Log
   */
  async function addLog(severity: Severity, label: string, details?: any): Promise<IndexableType> {
    const log: Log = {
      [Field.TIMESTAMP]: new Date().getTime(),
      [Field.SEVERITY]: severity,
      [Field.APP_NAME]: AppText.APP_NAME,
      [Field.LABEL]: label,
      [Field.DETAILS]: details,
    }

    return await dexieWrapper.table(TableName.LOGS).add(log)
  }

  /**
   * TODO
   * @param parentId
   * @param exampleNumber
   * @returns
   */
  async function addExampleRecord(
    parentId: string,
    exampleNumber?: number
  ): Promise<IndexableType> {
    return await dexieWrapper.table(TableName.EXAMPLE_RECORDS).add({
      [Field.ID]: uid(),
      [Field.CREATED_TIMESTAMP]: new Date().getTime(),
      [Field.UPDATED_TIMESTAMP]: new Date().getTime(),
      [Field.PARENT_ID]: parentId,
      [Field.RECORD_STATUS]: RecordStatus.FINISHED,
      [Field.NOTE]: '',
      [Field.EXAMPLE_NUMBER]: Number(exampleNumber) || 0,
    })
  }

  /**
   * Bulk add items into a defined table. Do NOT mismatch tables and item types!
   * @param tableName
   * @param items Must matching table model type
   * @returns Array of imported item ids
   */
  async function bulkAddItems(table: TableName, items: AnyModel[]): Promise<IndexableType[]> {
    return await dexieWrapper.table(table).bulkAdd(items, { allKeys: true })
  }

  ///////////////////////////////////////////////////////////////////////////////
  //                                                                           //
  //     Update                                                                //
  //                                                                           //
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Force a live query update on a table by updating the updated timestamp.
   * @param tableName
   * @param id
   * @returns 1 on a successful update
   */
  async function forceLiveQueryUpdate(tableName: TableName, id: string) {
    await dexieWrapper
      .table(tableName)
      .update(id, { [Field.UPDATED_TIMESTAMP]: new Date().getTime() })
  }

  /**
   * Update provided properties on a table item by the originalId.
   * @param tableName
   * @param originalId
   * @param props
   * @returns 1 on a successful update
   */
  async function updateItem(
    tableName: ParentTable,
    originalId: string,
    props: Partial<ParentModel>
  ): Promise<IndexableType> {
    return await dexieWrapper.table(tableName).update(originalId, props)
  }

  ///////////////////////////////////////////////////////////////////////////////
  //                                                                           //
  //     Read                                                                  //
  //                                                                           //
  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Gets all data from a table.
   * @returns Database table data as an array
   */
  async function getTable(tableName: TableName): Promise<AnyModel[]> {
    return await dexieWrapper.table(tableName).toArray()
  }

  /**
   * Get most recent previous record item by parent id.
   * @param tableName
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
        .where(Field.PARENT_ID)
        .equalsIgnoreCase(parentId)
        .sortBy(Field.CREATED_TIMESTAMP)
    ).reverse()[0]
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
  async function deleteItem(table: TableName, id: string | number | SettingKey): Promise<void> {
    return await dexieWrapper.table(table).delete(id)
  }

  /**
   * Deletes all items from table.
   * @param table
   * @returns undefined
   */
  async function clearTable(table: TableName): Promise<void> {
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
    addLog,
    addExampleRecord,
    forceLiveQueryUpdate,
    updateItem,
    getTable,
    getPreviousRecord,
    bulkAddItems,
    deleteItem,
    clearTable,
    deleteDatabase,
  }
}
