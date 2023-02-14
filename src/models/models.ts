import type { Field, ParentStatus, RecordStatus, Severity, SettingKey } from '@/constants/globals'
import type { AppObject, SettingValue } from '@/constants/types'

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Core Models                                                           //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export interface Entity {
  [Field.ID]: string
  [Field.CREATED_TIMESTAMP]: number
}

export interface Parent extends Entity {
  [Field.NAME]: string
  [Field.DESCRIPTION]: string
  [Field.PARENT_STATUS]: ParentStatus
  [Field.FAVORITE]: boolean
}

export interface Record extends Entity {
  [Field.PARENT_ID]: string
  [Field.RECORD_STATUS]: RecordStatus
  [Field.NOTE]: string
}

export interface Log {
  [Field.AUTO_ID]?: number // Optional - Gets auto generated and incremented by the table
  [Field.TIMESTAMP]: number
  [Field.SEVERITY]: Severity
  [Field.LABEL]: string
  [Field.DETAILS]?: AppObject
}

export interface Setting {
  [Field.KEY]: SettingKey
  [Field.VALUE]: SettingValue
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     App Models                                                            //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export interface Example extends Parent {
  [Field.EXAMPLE_MESSAGE]: string
}

export interface ExampleRecord extends Record {
  [Field.EXAMPLE_NUMBER]: number
}

export interface Test extends Parent {
  [Field.EXAMPLE_MESSAGE]: string
}

export interface TestRecord extends Record {
  [Field.EXAMPLE_NUMBER]: number
}
