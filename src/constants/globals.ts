///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     App                                                                   //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

import type { Example, ExampleRecord, Log, Setting, Test, TestRecord } from '@/models/models'

/**
 * Generic strings that are reused throughout the app.
 */
export enum AppText {
  APP_NAME = 'Vue 3 Web App Template',
}

/**
 * Material Design icons.
 * @see https://fonts.google.com/icons
 */
export enum Icon {
  // Severity
  DEBUG = 'bug_report',
  INFO = 'info',
  WARN = 'warning',
  ERROR = 'error',
  // Actions
  NONE = 'select',
  SAVE = 'save',
  CLOSE = 'close',
  ADD = 'add',
  REMOVE = 'remove',
  EDIT = 'edit',
  INSPECT = 'manage_search',
  DELETE = 'delete',
  CREATE = 'add_circle',
  CLEAR = 'delete_sweep',
  // Pages
  DONATE = 'redeem',
  DASHBOARD = 'dashboard',
  SETTINGS = 'settings',
  LOGS = 'plagiarism',
  CHARTS = 'bar_chart',
  RECORDS = 'storage',
  EXAMPLES = 'smart_toy',
  TESTS = 'cruelty_free',
  // Misc
  DESCRIPTION = 'description',
  HELP = 'help_center',
  LIST = 'view_list',
  TABLE = 'table_chart',
  OPTIONS = 'tune',
  RECOMMEND = 'recommend',
  REMINDER = 'notifications_active',
  STOPWATCH = 'timer',
  CLOCK = 'access_time',
  CALENDAR_DATE = 'event',
  CALENDAR_CHECK = 'event_available',
  CALENDAR_CLEAR = 'event_busy',
  EXIT = 'exit_to_app',
  BACK = 'arrow_back',
  REFRESH = 'refresh',
  PREVIOUS = 'undo',
  CODE = 'code',
  WEB = 'language',
  MENU_STANDARD = 'menu',
  MENU_VERTICAL = 'more_vert',
  TOP_OF_PAGE = 'keyboard_arrow_up',
  FAVORITE_ON = 'star',
  FAVORITE_OFF = 'star_border',
}

/**
 * Limits for various rules and inputs.
 */
export enum Limit {
  FILESIZE = 100000000, // ~100 megabytes
}

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
//     Charts                                                                //
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
//     Models                                                                //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Field names used by the tables for the database objects.
 */
export enum DatabaseField {
  // Setting
  KEY = 'key',
  VALUE = 'value',
  // Log
  AUTO_ID = 'autoId',
  TIMESTAMP = 'timestamp',
  SEVERITY = 'severity',
  APP_NAME = 'appName',
  LABEL = 'label',
  DETAILS = 'details',
  // Entity
  ID = 'id',
  CREATED_TIMESTAMP = 'createdTimestamp',
  UPDATED_TIMESTAMP = 'updatedTimestamp',
  // Parent
  NAME = 'name',
  DESCRIPTION = 'description',
  PARENT_STATUS = 'parentStatus',
  FAVORITE = 'favorite',
  // Record
  PARENT_ID = 'parentId',
  RECORD_STATUS = 'recordStatus',
  NOTE = 'note',
  // Example Parent
  EXAMPLE_MESSAGE = 'exampleMessage',
  // Example Record
  EXAMPLE_NUMBER = 'exampleNumber',
}

export type SettingField = DatabaseField.KEY | DatabaseField.VALUE

export const settingFields: readonly SettingField[] = [DatabaseField.KEY, DatabaseField.VALUE]

export type LogField =
  | DatabaseField.AUTO_ID
  | DatabaseField.TIMESTAMP
  | DatabaseField.SEVERITY
  | DatabaseField.APP_NAME
  | DatabaseField.LABEL
  | DatabaseField.DETAILS

export const logFields: readonly LogField[] = [
  DatabaseField.AUTO_ID,
  DatabaseField.TIMESTAMP,
  DatabaseField.SEVERITY,
  DatabaseField.APP_NAME,
  DatabaseField.LABEL,
  DatabaseField.DETAILS,
]

export type EntityField =
  | DatabaseField.ID
  | DatabaseField.CREATED_TIMESTAMP
  | DatabaseField.UPDATED_TIMESTAMP

export const entityFields: readonly EntityField[] = [
  DatabaseField.ID,
  DatabaseField.CREATED_TIMESTAMP,
  DatabaseField.UPDATED_TIMESTAMP,
]

export type ParentField =
  | EntityField
  | DatabaseField.NAME
  | DatabaseField.DESCRIPTION
  | DatabaseField.PARENT_STATUS
  | DatabaseField.FAVORITE

export const parentFields: readonly ParentField[] = [
  ...entityFields,
  DatabaseField.NAME,
  DatabaseField.DESCRIPTION,
  DatabaseField.PARENT_STATUS,
  DatabaseField.FAVORITE,
]

export type RecordField =
  | EntityField
  | DatabaseField.PARENT_ID
  | DatabaseField.RECORD_STATUS
  | DatabaseField.NOTE

export const recordFields: readonly RecordField[] = [
  ...entityFields,
  DatabaseField.PARENT_ID,
  DatabaseField.RECORD_STATUS,
  DatabaseField.NOTE,
]

export type ExampleField = ParentField | DatabaseField.EXAMPLE_MESSAGE

export const exampleFields: readonly ExampleField[] = [
  ...entityFields,
  ...parentFields,
  DatabaseField.EXAMPLE_MESSAGE,
]

export type ExampleRecordField = RecordField | DatabaseField.EXAMPLE_NUMBER

export const exampleRecordFields: readonly ExampleRecordField[] = [
  ...entityFields,
  ...recordFields,
  DatabaseField.EXAMPLE_NUMBER,
]

export type TestField = ParentField | DatabaseField.EXAMPLE_MESSAGE

export const testFields: readonly TestField[] = [
  ...entityFields,
  ...parentFields,
  DatabaseField.EXAMPLE_MESSAGE,
]

export type TestRecordField = RecordField | DatabaseField.EXAMPLE_NUMBER

export const testRecordFields: readonly TestRecordField[] = [
  ...entityFields,
  ...recordFields,
  DatabaseField.EXAMPLE_NUMBER,
]

export type AnyModel = Setting | Log | Example | ExampleRecord | Test | TestRecord

export type ParentModel = Example | Test

export type RecordModel = ExampleRecord | TestRecord

export enum ParentStatus {
  ENABLED = 'Enabled',
  DISABLED = 'Disabled',
}

export enum RecordStatus {
  NONE = 'None',
  FINISHED = 'Finished',
}

export enum Severity {
  DEBUG = 'Debug',
  INFO = 'Info',
  WARN = 'Warning',
  ERROR = 'Error',
}

export enum SettingKey {
  SHOW_INTRODUCTION = 'show-introduction',
  DARK_MODE = 'dark-mode',
  SHOW_CONSOLE_LOGS = 'show-console-logs',
  SHOW_DEBUG_MESSAGES = 'show-debug-messages',
  SAVE_INFO_MESSAGES = 'save-info-messages',
  PARENT_LIST_SELECTION = 'primary-list-selection',
  // ACTIVE_RECORD_IDS = 'active-record-ids',
  // PARENTS_TABLE_VISIBLE_COLUMNS = 'parents-table-visible-columns',
  // RECORDS_TABLE_VISIBLE_COLUMNS = 'records-table-visible-columns',
}

export type SettingValue = any // May make this more specific in the future

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Router                                                                //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Route names used by Vue router.
 */
export enum RouteName {
  DASHBOARD = 'Dashboard',
  SETTINGS = 'Settings',
  FAQ = 'FAQ',
  ABOUT = 'About',
  DONATE = 'Donate',
  NOT_FOUND = 'NotFound',
  DATA = 'Data',
  ACTIONS = 'Actions',
  CHARTS = 'Charts',
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Tables                                                                //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Database table names used throughout the app.
 */
export enum DatabaseTable {
  // Core
  SETTINGS = 'Settings',
  LOGS = 'Logs',
  // Parent
  EXAMPLES = 'Examples',
  TESTS = 'Tests',
  // Record
  EXAMPLE_RECORDS = 'Example Records',
  TEST_RECORDS = 'Test Records',
}

export enum ComputedTable {
  UNUSED = 'Unused Items',
  ORPHANED = 'Orphaned Items',
}

export type CoreTable = DatabaseTable.SETTINGS | DatabaseTable.LOGS

export const coreTables: readonly CoreTable[] = [DatabaseTable.SETTINGS, DatabaseTable.LOGS]

export type ParentTable = DatabaseTable.EXAMPLES | DatabaseTable.TESTS

export const parentTables: readonly ParentTable[] = [DatabaseTable.EXAMPLES, DatabaseTable.TESTS]

export type RecordTable = DatabaseTable.EXAMPLE_RECORDS | DatabaseTable.TEST_RECORDS

export const recordTables: readonly RecordTable[] = [
  DatabaseTable.EXAMPLE_RECORDS,
  DatabaseTable.TEST_RECORDS,
]

export const allTables: readonly DatabaseTable[] = [...coreTables, ...parentTables, ...recordTables]

/**
 * Table actions that can be performed. Each table may support a subset of these actions.
 */
export enum DatabaseAction {
  NONE = 'None',
  CREATE = 'Create',
  INSPECT = 'Inspect',
  EDIT = 'Edit',
  DELETE = 'Delete',
  CLEAR = 'Clear',
  CHARTS = 'Charts',
}

/**
 * Properties used to display data items in a QTable.
 * Use "hiddenId" for column "0" so a truncated version can be shown.
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
//     Utilities                                                             //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Milliseconds per time value.
 */
export enum Milliseconds {
  PER_DAY = 86400000,
  PER_HOUR = 3600000,
  PER_MINUTE = 60000,
  PER_SECOND = 1000,
}
