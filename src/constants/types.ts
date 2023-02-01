import type { Field } from '@/constants/globals'

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     App Types                                                             //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Generic type for an object with string based properties storing any value.
 */
export type AppObject = { [x: string]: any }

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Model Types                                                           //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export type SettingValue = any

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
