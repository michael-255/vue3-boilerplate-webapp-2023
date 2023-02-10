import Dexie, { type Table } from 'dexie'
import { AppText, Field } from '@/constants/globals'
import { TableName } from '@/constants/globals'
import type {
  IDBLog,
  IDBSetting,
  IDBExample,
  IDBExampleRecord,
  IDBTestRecord,
  IDBTest,
} from '@/models/models'

export class DexieWrapper extends Dexie {
  [TableName.SETTINGS]!: Table<IDBSetting>;
  [TableName.LOGS]!: Table<IDBLog>;
  [TableName.EXAMPLES]!: Table<IDBExample>;
  [TableName.EXAMPLE_RECORDS]!: Table<IDBExampleRecord>;
  [TableName.TESTS]!: Table<IDBTest>;
  [TableName.TEST_RECORDS]!: Table<IDBTestRecord>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      [TableName.SETTINGS]: `&${Field.KEY}`,
      [TableName.LOGS]: `++${Field.ID}`,
      [TableName.EXAMPLES]: `&${Field.ID}, ${Field.PARENT_STATUS}`,
      [TableName.EXAMPLE_RECORDS]: `&${Field.ID}, ${Field.RECORD_STATUS}, ${Field.PARENT_ID}`,
      [TableName.TESTS]: `&${Field.ID}, ${Field.PARENT_STATUS}`,
      [TableName.TEST_RECORDS]: `&${Field.ID}, ${Field.RECORD_STATUS}, ${Field.PARENT_ID}`,
    })
  }
}

/**
 * Preconfigured DexieWrapper
 */
export const dexieWrapper = new DexieWrapper(AppText.APP_NAME)
