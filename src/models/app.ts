/**
 * App Specific Model Interfaces
 *
 * These interfaces are those that you would add for your own app
 * functionality and are unique to this app.
 */

import type { IDBPrimary, IDBRecord } from '@/models/core'
import type { Field } from '@/constants/globals'

export interface IDBExample extends IDBPrimary {
  [Field.TEST_MESSAGE]: string
}

export interface IDBExampleRecord extends IDBRecord {
  [Field.TEST_NUMBER]: number
}

export interface IDBTests extends IDBPrimary {
  [Field.TEST_MESSAGE]: string
}

export interface IDBTestRecord extends IDBRecord {
  [Field.TEST_NUMBER]: number
}
