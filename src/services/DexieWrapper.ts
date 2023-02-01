import Dexie, { type Table } from 'dexie'
import { AppString, Field } from '@/constants/globals'
import { TableName } from '@/constants/globals'
import type { IDBLog, IDBSetting, IDBImage } from '@/models/core'

export class DexieWrapper extends Dexie {
  [TableName.SETTINGS]!: Table<IDBSetting>;
  [TableName.LOGS]!: Table<IDBLog>;
  [TableName.IMAGES]!: Table<IDBImage>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      [TableName.SETTINGS]: `&${Field.KEY}`,
      [TableName.LOGS]: `++${Field.ID}`,
      [TableName.IMAGES]: `&${Field.ID}`,
    })
  }
}

/**
 * Preconfigured DexieWrapper
 */
export const dexieWrapper = new DexieWrapper(AppString.APP_NAME)
