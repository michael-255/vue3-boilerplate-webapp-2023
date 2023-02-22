import Dexie, { type Table } from 'dexie'
import { AppText, DatabaseField } from '@/constants/globals'
import { DatabaseTable } from '@/constants/globals'
import type { Log, Setting, Example, ExampleRecord, TestRecord, Test } from '@/models/models'

export class DexieWrapper extends Dexie {
  [DatabaseTable.SETTINGS]!: Table<Setting>;
  [DatabaseTable.LOGS]!: Table<Log>;
  [DatabaseTable.EXAMPLES]!: Table<Example>;
  [DatabaseTable.EXAMPLE_RECORDS]!: Table<ExampleRecord>;
  [DatabaseTable.TESTS]!: Table<Test>;
  [DatabaseTable.TEST_RECORDS]!: Table<TestRecord>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      [DatabaseTable.SETTINGS]: `&${DatabaseField.KEY}`,
      [DatabaseTable.LOGS]: `++${DatabaseField.AUTO_ID}`,
      [DatabaseTable.EXAMPLES]: `&${DatabaseField.ID}, ${DatabaseField.NAME}`,
      [DatabaseTable.EXAMPLE_RECORDS]: `&${DatabaseField.ID}, ${DatabaseField.PARENT_ID}`,
      [DatabaseTable.TESTS]: `&${DatabaseField.ID}, ${DatabaseField.NAME}`,
      [DatabaseTable.TEST_RECORDS]: `&${DatabaseField.ID}, ${DatabaseField.PARENT_ID}`,
    })
  }
}

/**
 * Preconfigured DexieWrapper
 */
export const dexieWrapper = new DexieWrapper(AppText.APP_NAME)
