import Dexie, { type Table } from 'dexie'
import { AppText, Field } from '@/constants/globals'
import { TableName } from '@/constants/globals'
import type { Log, Setting, Example, ExampleRecord, TestRecord, Test } from '@/models/models'

export class DexieWrapper extends Dexie {
  [TableName.SETTINGS]!: Table<Setting>;
  [TableName.LOGS]!: Table<Log>;
  [TableName.EXAMPLES]!: Table<Example>;
  [TableName.EXAMPLE_RECORDS]!: Table<ExampleRecord>;
  [TableName.TESTS]!: Table<Test>;
  [TableName.TEST_RECORDS]!: Table<TestRecord>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      [TableName.SETTINGS]: `&${Field.KEY}`,
      [TableName.LOGS]: `++${Field.AUTO_ID}`,
      [TableName.EXAMPLES]: `&${Field.ID}, ${Field.NAME}`,
      [TableName.EXAMPLE_RECORDS]: `&${Field.ID}, ${Field.PARENT_ID}`,
      [TableName.TESTS]: `&${Field.ID}, ${Field.NAME}`,
      [TableName.TEST_RECORDS]: `&${Field.ID}, ${Field.PARENT_ID}`,
    })
  }
}

/**
 * Preconfigured DexieWrapper
 */
export const dexieWrapper = new DexieWrapper(AppText.APP_NAME)
