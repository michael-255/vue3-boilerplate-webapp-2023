import type { AppObject, Optional } from '@/constants/misc'

/**
 * Actions that can be performed on database types. Each type may support a subset of these actions.
 */
export enum DatabaseAction {
  CREATE = 'Create',
  INSPECT = 'Inspect',
  EDIT = 'Edit',
  DELETE = 'Delete',
  CHARTS = 'Charts',
}

/**
 * Database types that separate the different types of records.
 */
export enum DatabaseType {
  SETTINGS = 'Settings',
  LOGS = 'Logs',
  EXAMPLES = 'Examples',
  EXAMPLE_RESULTS = 'Example Results',
  TESTS = 'Tests',
  TEST_RESULTS = 'Test Results',
}

export enum DatabaseParentType {
  EXAMPLES = 'Examples',
  TESTS = 'Tests',
}

export enum DatabaseChildType {
  EXAMPLE_RESULTS = 'Example Results',
  TEST_RESULTS = 'Test Results',
}

/**
 * Field names used by database objects.
 */
export enum DatabaseField {
  TYPE = 'type',
  ID = 'id',
  CREATED_TIMESTAMP = 'createdTimestamp',
  UPDATED_TIMESTAMP = 'updatedTimestamp',
  SETTING = 'setting',
  SEVERITY = 'severity',
  APP_NAME = 'appName',
  DETAILS = 'details',
  NAME = 'name',
  TEXT = 'text',
  IS_FAVORITED = 'isFavorited',
  IS_ENABLED = 'isEnabled',
  IS_ACTIVE = 'isActive',
  PARENT_ID = 'parentId',
  LINKED_IDS = 'linkedIds',
  MESSAGE = 'message',
  NUMBER = 'number',
}

export enum SettingId {
  SHOW_INTRODUCTION = 'show-introduction',
  DARK_MODE = 'dark-mode',
  SHOW_ALL_DATA_COLUMNS = 'show-all-data-columns',
  SHOW_CONSOLE_LOGS = 'show-console-logs',
  SHOW_DEBUG_MESSAGES = 'show-debug-messages',
  SHOW_INFO_MESSAGES = 'show-info-messages',
  PARENT_LIST_SELECTION = 'primary-list-selection',
  LOG_RETENTION_TIME = 'log-retention-time',
}

export enum Severity {
  DEBUG = 'Debug',
  INFO = 'Info',
  WARN = 'Warning',
  ERROR = 'Error',
}

/**
 * All database record types. Cast your result to the one you are currently working with if known.
 */
export type DatabaseRecord = Setting | Log | Example | ExampleResult | Test | TestResult

//
// Setting Model
//

export interface Setting {
  [DatabaseField.TYPE]: DatabaseType
  [DatabaseField.ID]: SettingId // Setting ids only
  [DatabaseField.CREATED_TIMESTAMP]: number
  [DatabaseField.UPDATED_TIMESTAMP]: number
  [DatabaseField.SETTING]: any
}

export const settingFields: readonly DatabaseField[] = [
  DatabaseField.TYPE,
  DatabaseField.ID,
  DatabaseField.CREATED_TIMESTAMP,
  DatabaseField.UPDATED_TIMESTAMP,
  DatabaseField.SETTING,
]

//
// Log Model
//

export interface Log {
  [DatabaseField.TYPE]: DatabaseType
  [DatabaseField.ID]: string
  [DatabaseField.CREATED_TIMESTAMP]: number
  [DatabaseField.SEVERITY]: Severity
  [DatabaseField.APP_NAME]: string
  [DatabaseField.NAME]: string
  [DatabaseField.DETAILS]: Optional<AppObject>
}

export const logFields: readonly DatabaseField[] = [
  DatabaseField.TYPE,
  DatabaseField.ID,
  DatabaseField.CREATED_TIMESTAMP,
  DatabaseField.SEVERITY,
  DatabaseField.APP_NAME,
  DatabaseField.NAME,
  DatabaseField.DETAILS,
]

//
// Example Model
//

export interface Example {
  [DatabaseField.TYPE]: DatabaseType
  [DatabaseField.ID]: string
  [DatabaseField.CREATED_TIMESTAMP]: number
  [DatabaseField.UPDATED_TIMESTAMP]: number
  [DatabaseField.NAME]: string
  [DatabaseField.TEXT]: Optional<string>
  [DatabaseField.IS_FAVORITED]: boolean
  [DatabaseField.IS_ENABLED]: boolean
  [DatabaseField.MESSAGE]: Optional<string>
}

export const exampleFields: readonly DatabaseField[] = [
  DatabaseField.TYPE,
  DatabaseField.ID,
  DatabaseField.CREATED_TIMESTAMP,
  DatabaseField.UPDATED_TIMESTAMP,
  DatabaseField.NAME,
  DatabaseField.TEXT,
  DatabaseField.IS_FAVORITED,
  DatabaseField.IS_ENABLED,
  DatabaseField.MESSAGE,
]

//
// Example Result Model
//

export interface ExampleResult {
  [DatabaseField.TYPE]: DatabaseType
  [DatabaseField.ID]: string
  [DatabaseField.CREATED_TIMESTAMP]: number
  [DatabaseField.UPDATED_TIMESTAMP]: number
  [DatabaseField.PARENT_ID]: string
  [DatabaseField.TEXT]: Optional<string>
  [DatabaseField.IS_ACTIVE]: boolean
  [DatabaseField.NUMBER]: number
}

export const exampleResultFields: readonly DatabaseField[] = [
  DatabaseField.TYPE,
  DatabaseField.ID,
  DatabaseField.CREATED_TIMESTAMP,
  DatabaseField.UPDATED_TIMESTAMP,
  DatabaseField.PARENT_ID,
  DatabaseField.TEXT,
  DatabaseField.IS_ACTIVE,
  DatabaseField.NUMBER,
]

//
// Test Model
//

export interface Test extends Example {}
export const testFields: readonly DatabaseField[] = exampleFields

//
// Test Result Model
//

export interface TestResult extends ExampleResult {}
export const testResultFields: readonly DatabaseField[] = exampleResultFields
