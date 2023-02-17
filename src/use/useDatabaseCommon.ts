import { Dark } from 'quasar'
import type { IndexableType } from 'dexie'
import type { AnyModel, SettingValue } from '@/constants/types'
import type { Setting } from '@/models/models'
import { TableName, SettingKey, Field } from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import useSettingsStore from '@/stores/settings'

export default function useDatabaseCommon() {
  const settingsStore = useSettingsStore()

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

  /**
   * Gets all data from a table.
   * @returns Database table data as an array
   */
  async function getTable(table: TableName): Promise<AnyModel[]> {
    return await dexieWrapper.table(table).toArray()
  }

  /**
   * Bulk add items into a defined table. Do NOT mismatch tables and item types!
   * @param table (TableName)
   * @param items (Matching table model type)
   * @returns Array of imported item ids
   */
  async function bulkAddItems(table: TableName, items: AnyModel[]): Promise<IndexableType[]> {
    return await dexieWrapper.table(table).bulkAdd(items, { allKeys: true })
  }

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
    getTable,
    bulkAddItems,
    deleteItem,
    clearTable,
    deleteDatabase,
  }
}
