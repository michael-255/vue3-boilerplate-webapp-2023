import type { LogRetention } from './misc'

/**
 * All database tables.
 */
export enum DatabaseTable {
  RECORDS = 'Records',
}

/**
 * All database types that separate the different types of records.
 * Used to separate records using tables, but compound indices are better.
 */
export enum DatabaseType {
  SETTING = 'Setting',
  LOG = 'Log',
  EXAMPLE = 'Example',
  EXAMPLE_RESULT = 'Example Result',
  TEST = 'Test',
  TEST_RESULT = 'Test Result',
}

/**
 * Parent types in the database.
 */
export type DatabaseParentType = DatabaseType.EXAMPLE | DatabaseType.TEST

/**
 * Child types to parent types in the database.
 */
export type DatabaseChildType = DatabaseType.EXAMPLE_RESULT | DatabaseType.TEST_RESULT

/**
 * All field names used by database records.
 * Update database models and database constants when adding new fields.
 */
export enum DatabaseField {
  // All
  TYPE = 'type',
  ID = 'id',
  // Settings
  VALUE = 'value',
  // Logs
  CREATED_TIMESTAMP = 'createdTimestamp',
  SEVERITY = 'severity',
  LABEL = 'label',
  DETAILS = 'details',
  // Examples
  NAME = 'name',
  DESCRIPTION = 'description',
  IS_FAVORITED = 'isFavorited',
  IS_ENABLED = 'isEnabled',
  // Example Results
  PARENT_ID = 'parentId',
  NOTE = 'note',
  NUMBER = 'number',
}

/**
 * Setting values are restricted to a few primitive types.
 */
export type SettingValue = string | number | boolean | DatabaseType | LogRetention

/**
 * The only valid setting ids.
 */
export enum SettingId {
  SHOW_INTRODUCTION = 'show-introduction',
  DARK_MODE = 'dark-mode',
  SHOW_ALL_DATA_COLUMNS = 'show-all-data-columns',
  SHOW_CONSOLE_LOGS = 'show-console-logs',
  SHOW_DEBUG_MESSAGES = 'show-debug-messages',
  SHOW_INFO_MESSAGES = 'show-info-messages',
  DASHBOARD_LIST_SELECTION = 'dashboard-list-selection',
  LOG_RETENTION_TIME = 'log-retention-time',
}

/**
 * Log severity levels.
 */
export enum Severity {
  DEBUG = 'Debug',
  INFO = 'Info',
  WARN = 'Warning',
  ERROR = 'Error',
}

/**
 * Actions that a database type can support.
 */
export enum DatabaseAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  CHARTS = 'Charts',
}
