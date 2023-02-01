import Dexie, { type Table } from 'dexie'
import { AppString, Field } from '@/constants/globals'
import { TableName } from '@/constants/globals'
import type { IDBLog, IDBSetting, IDBImage } from '@/models/core'
import type { IDBExample, IDBExampleRecord } from '@/models/app'

export class DexieWrapper extends Dexie {
  [TableName.SETTINGS]!: Table<IDBSetting>;
  [TableName.LOGS]!: Table<IDBLog>;
  [TableName.IMAGES]!: Table<IDBImage>;
  [TableName.EXAMPLES]!: Table<IDBExample>;
  [TableName.EXAMPLE_RECORDS]!: Table<IDBExampleRecord>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      [TableName.SETTINGS]: `&${Field.KEY}`,
      [TableName.LOGS]: `++${Field.ID}`,
      [TableName.IMAGES]: `&${Field.ID}`,
      [TableName.EXAMPLES]: `&${Field.ID}, ${Field.PARENT_STATUS}`,
      [TableName.EXAMPLE_RECORDS]: `&${Field.ID}, ${Field.RECORD_STATUS}, ${Field.PARENT_ID}`,
    })
  }
}

/**
 * Preconfigured DexieWrapper
 */
export const dexieWrapper = new DexieWrapper(AppString.APP_NAME)
