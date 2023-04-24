import { DatabaseField, SettingId, Severity } from '@/types/database'
import { LogRetention } from '@/types/misc'
import { uid } from 'quasar'

/**
 * Catch-all for any value that can be used as a default value.
 * I don't feel the need to export this since the value can be anything.
 */
type DefaultValue = {
  readonly [x: string]: any
}

/**
 * Object with various app keys corresponding to the default value for that key. Some are functions.
 */
const AppDefault: DefaultValue = {
  // All
  [DatabaseField.TYPE]: null,
  [DatabaseField.ID]: () => uid(),
  // Settings
  [DatabaseField.VALUE]: null,
  // Logs
  [DatabaseField.CREATED_TIMESTAMP]: () => new Date().getTime(),
  [DatabaseField.SEVERITY]: Severity.DEBUG,
  [DatabaseField.LABEL]: 'Error',
  [DatabaseField.DETAILS]: null,
  [DatabaseField.MESSAGE]: null,
  [DatabaseField.STACK]: null,
  // Parent
  [DatabaseField.NAME]: 'Example',
  [DatabaseField.DESCRIPTION]: '',
  [DatabaseField.IS_FAVORITED]: false,
  [DatabaseField.IS_ENABLED]: true,
  // Child
  [DatabaseField.PARENT_ID]: null,
  [DatabaseField.NOTE]: '',
  // Example & Test Results
  [DatabaseField.NUMBER]: 0,
  // App Settings
  [SettingId.DARK_MODE]: true,
  [SettingId.LOG_RETENTION_TIME]: LogRetention.THREE_MONTHS,
  [SettingId.SHOW_INTRODUCTION]: true,
  [SettingId.SHOW_CONSOLE_LOGS]: false,
  [SettingId.SHOW_INFO_MESSAGES]: true,
  // Input Limits
  MAX_ID_LENGTH: 50,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NOTE_LENGTH: 500,
  MAX_FILE_SIZE: 1_000_000,
}

export default AppDefault
