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
//     Table Constants                                                       //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * Database table names used throughout the app.
 */
export enum TableName {
  SETTINGS = 'Settings',
  LOGS = 'Logs',
  EXAMPLES = 'Examples',
  EXAMPLE_RECORDS = 'Example Records',
  TESTS = 'Tests',
  TEST_RECORDS = 'Tests Records',
}

/**
 * Table actions that can be performed. Each table may support a subset of these actions.
 */
export enum ActionName {
  NONE = 'None',
  CREATE = 'Create',
  INSPECT = 'Inspect',
  EDIT = 'Edit',
  DELETE = 'Delete',
  CLEAR = 'Clear',
  CHARTS = 'Charts',
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
