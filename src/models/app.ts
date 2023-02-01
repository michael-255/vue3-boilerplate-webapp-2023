/**
 * App Specific Model Interfaces
 *
 * These interfaces are those that you would add for your own app
 * functionality and are unique to this app.
 */

import type { IDBParent, IDBRecord } from '@/models/core'
import type { Field } from '@/constants/globals'
import type { AppObject } from '@/constants/types'

export interface IDBExample extends IDBParent {
  [Field.EXAMPLE_DATA]: AppObject // TODO
}

export interface IDBExampleRecord extends IDBRecord {
  [Field.EXAMPLE_TEST]: AppObject // TODO
}
