/**
 * Core Model Interfaces
 *
 * These interfaces are required for the core functionality of many parts of
 * the app (like Settings and Logs).
 */

import type { Field, PrimaryStatus, RecordStatus, Severity, SettingKey } from '@/constants/globals'
import type { AppObject, SettingValue } from '@/constants/types'

export interface IDBItem {
  [Field.ID]: string
  [Field.CREATED_TIMESTAMP]: number
}

export interface IDBParent extends IDBItem {
  [Field.PRIMARY_STATUS]: PrimaryStatus
  [Field.NAME]: string
  [Field.DESCRIPTION]: string
  [Field.FAVORITE]: boolean
}

export interface IDBRecord extends IDBItem {
  [Field.RECORD_STATUS]: RecordStatus
  [Field.PRIMARY_ID]: string
  [Field.NOTE]: string
}

export interface IDBLog {
  [Field.ID]?: string // Optional - Gets auto generated and incremented by the table
  [Field.CREATED_TIMESTAMP]: number
  [Field.SEVERITY]: Severity
  [Field.LABEL]: string
  [Field.DETAILS]?: AppObject
}

export interface IDBSetting {
  [Field.KEY]: SettingKey
  [Field.VALUE]: SettingValue
}

export interface IDBImage extends IDBItem {
  [Field.IMAGE]: string // TODO - base64 image or blob?
}
