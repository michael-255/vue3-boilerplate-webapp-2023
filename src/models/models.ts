import type {
  DatabaseField,
  ParentStatus,
  RecordStatus,
  Severity,
  SettingKey,
  AppObject,
  SettingValue,
} from '@/constants/globals'

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Core Models                                                           //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export interface Entity {
  [DatabaseField.ID]: string
  [DatabaseField.CREATED_TIMESTAMP]: number
  [DatabaseField.UPDATED_TIMESTAMP]: number
}

export interface Parent extends Entity {
  [DatabaseField.NAME]: string
  [DatabaseField.DESCRIPTION]: string
  [DatabaseField.PARENT_STATUS]: ParentStatus
  [DatabaseField.FAVORITE]: boolean
}

export interface Record extends Entity {
  [DatabaseField.PARENT_ID]: string
  [DatabaseField.RECORD_STATUS]: RecordStatus
  [DatabaseField.NOTE]: string
}

export interface Log {
  [DatabaseField.AUTO_ID]?: number // Optional - Gets auto generated and incremented by the table
  [DatabaseField.TIMESTAMP]: number
  [DatabaseField.SEVERITY]: Severity
  [DatabaseField.APP_NAME]: string
  [DatabaseField.LABEL]: string
  [DatabaseField.DETAILS]?: AppObject
}

export interface Setting {
  [DatabaseField.KEY]: SettingKey
  [DatabaseField.VALUE]: SettingValue
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     App Models                                                            //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export interface Example extends Parent {
  [DatabaseField.EXAMPLE_MESSAGE]: string
}

export interface ExampleRecord extends Record {
  [DatabaseField.EXAMPLE_NUMBER]: number
}

export interface Test extends Parent {
  [DatabaseField.EXAMPLE_MESSAGE]: string
}

export interface TestRecord extends Record {
  [DatabaseField.EXAMPLE_NUMBER]: number
}
