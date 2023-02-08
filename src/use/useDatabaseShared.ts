import type { IndexableType } from 'dexie'
import type { TableName, SettingKey } from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import type { IDBLog, IDBSetting } from '@/models/core'
import type { IDBExample, IDBExampleRecord, IDBTest, IDBTestRecord } from '@/models/app'

type AnyModel = IDBSetting | IDBLog | IDBExample | IDBExampleRecord | IDBTest | IDBTestRecord

export default function useDatabaseShared() {
  /**
   * Gets all data from a table.
   * @returns Database table data as an array
   */
  async function getTable(table: TableName): Promise<AnyModel[]> {
    return await dexieWrapper.table(table).toArray()
  }

  /**
   * Import items into the defined table. Do NOT mismatch tables and item types!
   * @param table (TableName)
   * @param items (Matching table model type)
   * @returns Array of imported item ids
   */
  async function importItems(table: TableName, items: AnyModel[]): Promise<IndexableType[]> {
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

  return { getTable, importItems, deleteItem, clearTable, deleteDatabase }
}
