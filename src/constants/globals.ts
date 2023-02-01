///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     App Constants                                                         //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Generic strings that are reused throughout the app.
 */
export enum AppString {
  APP_NAME = 'Vue 3 Web App Template',
}

/**
 * Defined app colors.
 * @see https://quasar.dev/style/color-palette
 * @see https://quasar.dev/quasar-utils/color-utils#helper-getpalettecolor
 */
export enum AppColor {
  LOG = 'blue-grey',
  DEBUG = 'deep-purple',
  INFO = 'primary',
  WARN = 'orange-9',
  ERROR = 'negative',
  CRITICAL = 'red-13',
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
  CRITICAL = 'report',
  // Operations
  UNDO = 'undo',
  SAVE = 'save',
  CLOSE = 'close',
  EDIT = 'edit',
  DELETE = 'delete',
  ADD = 'add',
  REMOVE = 'remove',
  // Pages
  EXAMPLE = 'smart_toy',
  ACTIVE = 'play_arrow',
  ACTIVITIES = 'directions_run',
  RECORDS = 'web_stories',
  MEASUREMENTS = 'straighten',
  EXERCISES = 'fitness_center',
  WORKOUTS = 'assignment',
  LOGS = 'plagiarism',
  // Misc
  ACTIVE_NOTIFY = 'notifications_active',
  TIMER = 'timer',
  CALENDAR_DATE = 'event',
  CALENDAR_CHECK = 'event_available',
  CALENDAR_CLEAR = 'event_busy',
  RETURN_TO_DASHBOARD = 'exit_to_app',
  TIME = 'access_time',
  RENEW = 'autorenew',
  DASHBOARD = 'dashboard',
  REPORT = 'timeline',
  MANAGEMENT = 'tune',
  SETTINGS = 'settings',
  DETAILS = 'summarize',
  CODE = 'code',
  WEB = 'language',
  MENU = 'menu',
  HOME = 'home',
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
  // Record
  RECORD_STATUS = 'recordStatus',
  PARENT_ID = 'parentId',
  NOTE = 'note',
  // Example Parent
  EXAMPLE_DATA = 'exampleData', // TODO
  // Example Record
  EXAMPLE_TEST = 'exampleTest', // TODO
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
  CRITICAL = 'Critical',
}

export enum SettingKey {
  DARK_MODE = 'dark-mode',
  SHOW_CONSOLE_LOGS = 'show-console-logs',
  SHOW_DEBUG_MESSAGES = 'show-debug-messages',
  SAVE_INFO_MESSAGES = 'save-info-messages',
  FAVORITE_PARENT_IDS = 'favorite-parent-ids', // TODO - should be stored on the item itself?
  ORPHANED_RECORD_IDS = 'orphaned-record-ids',
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
  TEST = 'Test',
}

/**
 * Links you might use throughout the app.
 */
export enum Links {
  GITHUB = 'https://github.com/michael-255',
  MYAPPS = 'https://www.example.com',
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//     Table Constants                                                       //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Dexie table names used by DexieWrapper service.
 */
export enum TableName {
  SETTINGS = 'Settings',
  LOGS = 'Logs',
  IMAGES = 'Images',
  EXAMPLES = 'Examples',
  EXAMPLE_RECORDS = 'Example Records',
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

/**
 * Limits for various fields and properties.
 */
export enum AppLimits {
  FILESIZE = 100000000, // ~100 megabytes
}
