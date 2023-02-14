import type { IndexableType } from 'dexie'
import { TableName } from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import type { Example, ExampleRecord, Test, TestRecord } from '@/models/models'

/**
 * Remove this when building your own app
 */
export default function useDBExamples() {
  /**
   * Adds an Example to the database.
   * @param example
   * @returns
   */
  async function addExample(example: Example): Promise<IndexableType> {
    return await dexieWrapper.table(TableName.EXAMPLES).add(example)
  }

  /**
   * Adds an Example Record to the database.
   * @param exampleRecord
   * @returns
   */
  async function addExampleRecord(exampleRecord: ExampleRecord): Promise<IndexableType> {
    return await dexieWrapper.table(TableName.EXAMPLE_RECORDS).add(exampleRecord)
  }
  /**
   * Adds a Test to the database.
   * @param test
   * @returns
   */
  async function addTest(test: Test): Promise<IndexableType> {
    return await dexieWrapper.table(TableName.TESTS).add(test)
  }

  /**
   * Adds a Test Record to the database.
   * @param testRecord
   * @returns
   */
  async function addTestRecord(testRecord: TestRecord): Promise<IndexableType> {
    return await dexieWrapper.table(TableName.TEST_RECORDS).add(testRecord)
  }

  return { addExample, addExampleRecord, addTest, addTestRecord }
}
