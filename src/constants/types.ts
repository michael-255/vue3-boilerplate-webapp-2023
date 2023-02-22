import type { DatabaseField, DatabaseTable } from '@/constants/globals'
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

export type SettingField = DatabaseField.KEY | DatabaseField.VALUE

export type LogField =
  | DatabaseField.AUTO_ID
  | DatabaseField.TIMESTAMP
  | DatabaseField.SEVERITY
  | DatabaseField.APP_NAME
  | DatabaseField.LABEL
  | DatabaseField.DETAILS

export type EntityField =
  | DatabaseField.ID
  | DatabaseField.CREATED_TIMESTAMP
  | DatabaseField.UPDATED_TIMESTAMP

export type ParentField =
  | EntityField
  | DatabaseField.NAME
  | DatabaseField.DESCRIPTION
  | DatabaseField.PARENT_STATUS
  | DatabaseField.FAVORITE

export type RecordField =
  | EntityField
  | DatabaseField.PARENT_ID
  | DatabaseField.RECORD_STATUS
  | DatabaseField.NOTE

export type ExampleField = ParentField | DatabaseField.EXAMPLE_MESSAGE

export type ExampleRecordField = RecordField | DatabaseField.EXAMPLE_NUMBER

export type TestField = ParentField | DatabaseField.EXAMPLE_MESSAGE

export type TestRecordField = RecordField | DatabaseField.EXAMPLE_NUMBER

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

export type ParentTable = DatabaseTable.EXAMPLES | DatabaseTable.TESTS

export type RecordTable = DatabaseTable.EXAMPLE_RECORDS | DatabaseTable.TEST_RECORDS

/**
 * Properties used to display data items in a QTable.
 * Use "hidden_id" for column "0" so a truncated version can be shown.
 */
export type ColumnProps = {
  name: DatabaseField | 'hidden_id'
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
