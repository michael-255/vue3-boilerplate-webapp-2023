/**
 * App Specific Model Interfaces
 *
 * These interfaces are those that you would add for your own app
 * functionality and are unique to this app.
 */

import type { IDBParent, IDBRecord } from '@/models/core'
import type { Field } from '@/constants/globals'

export interface IDBExample extends IDBParent {
  [Field.EXAMPLE_MESSAGE]: string
}

export interface IDBExampleRecord extends IDBRecord {
  [Field.EXAMPLE_NUMBER]: number
}
