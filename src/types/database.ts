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
  SETTINGS = 'Settings',
  LOGS = 'Logs',
  EXAMPLES = 'Examples',
  EXAMPLE_RESULTS = 'Example Results',
  TESTS = 'Tests',
  TEST_RESULTS = 'Test Results',
}

/**
 * Parent types in the database.
 */
export enum DatabaseParentType {
  EXAMPLES = 'Examples',
  TESTS = 'Tests',
}

/**
 * Child types to parent types in the database.
 */
export enum DatabaseChildType {
  EXAMPLE_RESULTS = 'Example Results',
  TEST_RESULTS = 'Test Results',
}

/**
 * All field names used by database records.
 * Update database models and database constants when adding new fields.
 */
export enum DatabaseField {
  TYPE = 'type',
  ID = 'id',
  CREATED_TIMESTAMP = 'createdTimestamp',
  VALUE = 'value',
  SEVERITY = 'severity',
  DETAILS = 'details',
  NAME = 'name',
  TEXT = 'text',
  IS_FAVORITED = 'isFavorited',
  IS_ENABLED = 'isEnabled',
  PARENT_ID = 'parentId',
  NUMBER = 'number',
}

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
