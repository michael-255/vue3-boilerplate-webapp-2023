import { DatabaseField, SettingId } from '@/types/database'
import { LogRetention } from '@/types/misc'
import { uid } from 'quasar'

/**
 * Default functions for each field.
 */
export const FieldDefault = Object.freeze({
  // All
  [DatabaseField.TYPE]: () => null,
  [DatabaseField.ID]: () => uid(),
  // Settings
  [DatabaseField.VALUE]: () => null,
  // Logs - These fields are handled by the components that use them
  [DatabaseField.CREATED_TIMESTAMP]: () => null,
  [DatabaseField.SEVERITY]: () => null,
  [DatabaseField.LABEL]: () => null,
  [DatabaseField.DETAILS]: () => null,
  [DatabaseField.MESSAGE]: () => null,
  [DatabaseField.STACK]: () => null,
  // Parent
  [DatabaseField.NAME]: () => 'Example',
  [DatabaseField.DESCRIPTION]: () => '',
  [DatabaseField.IS_FAVORITED]: () => false,
  [DatabaseField.IS_ENABLED]: () => true,
  // Child
  [DatabaseField.PARENT_ID]: () => null,
  [DatabaseField.NOTE]: () => '',
  // Example & Test Results
  [DatabaseField.NUMBER]: () => 0,
})

/**
 * Default values for each setting.
 */
export const SettingDefault = Object.freeze({
  [SettingId.DARK_MODE]: true,
  [SettingId.LOG_RETENTION_TIME]: LogRetention.THREE_MONTHS,
  [SettingId.SHOW_ALL_DATA_COLUMNS]: false,
  [SettingId.SHOW_INTRODUCTION]: true,
  [SettingId.SHOW_CONSOLE_LOGS]: false,
  [SettingId.SHOW_INFO_MESSAGES]: true,
})
