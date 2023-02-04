///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     App Constants                                                         //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

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
  SAVE = 'save',
  CLOSE = 'close',
  ADD = 'add',
  REMOVE = 'remove',
  EDIT = 'edit',
  INSPECT = 'summarize',
  DELETE = 'delete',
  CREATE_PARENT = 'add_circle',
  CREATE_RECORD = 'add_box',
  // Pages
  HOME = 'home',
  SETTINGS = 'settings',
  LOGS = 'plagiarism',
  REPORTS = 'timeline',
  EXAMPLES = 'smart_toy',
  // Misc
  LIST = 'view_list',
  TABLE = 'table_chart',
  RECORDS = 'dataset_linked',
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
  CODE = 'code',
  WEB = 'language',
  MENU = 'menu',
  MENU_VERT = 'more_vert',
}

/**
 * Limits for various rules and inputs.
 */
export enum Limit {
  FILESIZE = 100000000, // ~100 megabytes
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Model Constants                                                       //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Field names used by the tables for the database objects.
 */
export enum Field {
  // Setting
  KEY = 'key',
  VALUE = 'value',
  // Log
  SEVERITY = 'severity',
  LABEL = 'label',
  DETAILS = 'details',
  // Image
  IMAGE = 'image',
  // Entity
  ID = 'id',
  CREATED_TIMESTAMP = 'createdTimestamp',
  // Parent
  PARENT_STATUS = 'parentStatus',
  NAME = 'name',
  DESCRIPTION = 'description',
  FAVORITE = 'favorite',
  // Record
  RECORD_STATUS = 'recordStatus',
  PARENT_ID = 'parentId',
  NOTE = 'note',
  // Example Parent
  EXAMPLE_MESSAGE = 'exampleMessage',
  // Example Record
  EXAMPLE_NUMBER = 'exampleNumber',
}

export enum ParentStatus {
  ENABLED = 'Enabled',
  DISABLED = 'Disabled',
  ARCHIVED = 'Archived',
}

export enum RecordStatus {
  NONE = 'None',
  SKIPPED = 'Skipped',
  COMPLETED = 'Completed',
}

export enum Severity {
  DEBUG = 'Debug',
  INFO = 'Info',
  WARN = 'Warning',
  ERROR = 'Error',
}

export enum SettingKey {
  INTRODUCTION = 'introduction',
  DARK_MODE = 'dark-mode',
  SHOW_CONSOLE_LOGS = 'show-console-logs',
  SHOW_DEBUG_MESSAGES = 'show-debug-messages',
  SAVE_INFO_MESSAGES = 'save-info-messages',
  // ACTIVE_RECORD_IDS = 'active-record-ids',
  // PARENTS_TABLE_VISIBLE_COLUMNS = 'parents-table-visible-columns',
  // RECORDS_TABLE_VISIBLE_COLUMNS = 'records-table-visible-columns',
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Report Constants                                                      //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 *
 */

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Router Constants                                                      //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Route names used by Vue router.
 */
export enum RouteName {
  HOME = 'Home',
  SETTINGS = 'Settings',
  ABOUT = 'About',
  NOT_FOUND = 'NotFound',
  PAGE = 'Page',
  TABLE = 'Table',
  ACTION = 'Action',
  REPORT = 'Report',
  EXAMPLES = 'Examples',
}

/**
 * Web URLs you might use throughout the app.
 */
export enum WebURL {
  GITHUB = 'https://github.com/michael-255',
  MYAPPS = 'https://www.example.com',
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Table Constants                                                       //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Database table names used throughout the app.
 */
export enum TableName {
  SETTINGS = 'Settings',
  LOGS = 'Logs',
  IMAGES = 'Images',
  EXAMPLES = 'Examples',
  EXAMPLE_RECORDS = 'Example Records',
}

/**
 * Table actions that can be performed. Each table may support a subset of these actions.
 */
export enum ActionName {
  NONE = 'None',
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete',
  CLEAR = 'Clear',
  INSPECT = 'Inspect',
  REPORT = 'Report',
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Utility Constants                                                     //
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
