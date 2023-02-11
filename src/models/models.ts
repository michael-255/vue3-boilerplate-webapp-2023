import type { Field, ParentStatus, RecordStatus, Severity, SettingKey } from '@/constants/globals'
import type { AppObject, SettingValue } from '@/constants/types'

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Core Models                                                           //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export interface IDBItem {
  [Field.ID]: string
  [Field.CREATED_TIMESTAMP]: number
}

export interface IDBParent extends IDBItem {
  [Field.PARENT_STATUS]: ParentStatus
  [Field.NAME]: string
  [Field.DESCRIPTION]: string
  [Field.FAVORITE]: boolean
}

export interface IDBRecord extends IDBItem {
  [Field.RECORD_STATUS]: RecordStatus
  [Field.PARENT_ID]: string
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

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     App Models                                                            //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export interface IDBExample extends IDBParent {
  [Field.EXAMPLE_MESSAGE]: string
}

export interface IDBExampleRecord extends IDBRecord {
  [Field.EXAMPLE_NUMBER]: number
}

export interface IDBTest extends IDBParent {
  [Field.EXAMPLE_MESSAGE]: string
}

export interface IDBTestRecord extends IDBRecord {
  [Field.EXAMPLE_NUMBER]: number
}
