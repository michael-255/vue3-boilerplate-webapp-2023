import type { Field, TableName } from '@/constants/globals'
import type { Setting, Log, Example, ExampleRecord, Test, TestRecord } from '@/models/models'

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     App Types                                                             //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Generic type for an object with string based properties storing any value.
 */
export type AppObject = { [x: string]: any }

export type ParentCardItem = {
  id: string
  name: string
  favorite: boolean
  previousTimestamp?: number
  previousNumber?: number
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Model Types                                                           //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export type AnyModel = Setting | Log | Example | ExampleRecord | Test | TestRecord

export type ParentModel = Example | Test

export type RecordModel = ExampleRecord | TestRecord

export type SettingValue = any // May make this more specific in the future

export type SettingField = Field.KEY | Field.VALUE

export type LogField =
  | Field.AUTO_ID
  | Field.TIMESTAMP
  | Field.SEVERITY
  | Field.APP_NAME
  | Field.LABEL
  | Field.DETAILS

export type EntityField = Field.ID | Field.CREATED_TIMESTAMP | Field.UPDATED_TIMESTAMP

export type ParentField =
  | EntityField
  | Field.NAME
  | Field.DESCRIPTION
  | Field.PARENT_STATUS
  | Field.FAVORITE

export type RecordField = EntityField | Field.PARENT_ID | Field.RECORD_STATUS | Field.NOTE

export type ExampleField = ParentField | Field.EXAMPLE_MESSAGE

export type ExampleRecordField = RecordField | Field.EXAMPLE_NUMBER

export type TestField = ParentField | Field.EXAMPLE_MESSAGE

export type TestRecordField = RecordField | Field.EXAMPLE_NUMBER

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Report Types                                                          //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export type GeneratedReport = {
  title: string
  firstRecordDate: string
  lastRecordDate: string
  chartLabels: string[]
  chartDatasets: ChartDataset[]
}

export type ReportChart = {
  options: ChartOptions
  firstRecordDate: string
  lastRecordDate: string
  chartData: ChartData
}

export type ChartOptions = {
  responsive: boolean
  radius: number
  plugins: { [x: string]: any }
}

export type ChartData = {
  labels: string[]
  datasets: ChartDataset[]
}

export type ChartDataset = {
  label: string
  borderColor: string
  data: (number | null)[]
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Router Types                                                          //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 *
 */

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Table Types                                                           //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export type ParentTable = TableName.EXAMPLES | TableName.TESTS

export type RecordTable = TableName.EXAMPLE_RECORDS | TableName.TEST_RECORDS

/**
 * Properties used to display data items in a QTable.
 * Use "hidden_id" for column "0" so a truncated version can be shown.
 */
export type ColumnProps = {
  name: Field | 'hidden_id'
  label: string
  align: string
  sortable: boolean
  required: boolean
  field: (val: any) => any
  format: (val: any) => any
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Utility Types                                                         //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 *
 */
