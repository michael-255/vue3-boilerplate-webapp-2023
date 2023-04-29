import { DatabaseField, SettingId } from '@/types/database'
import { LogRetention } from '@/types/misc'
import { uid } from 'quasar'

/**
 * Default functions for each field.
 */
export const FieldDefault = Object.freeze({
  [DatabaseField.ID]: (): string => uid(),
  [DatabaseField.NAME]: (): string => 'Example',
  [DatabaseField.DESCRIPTION]: (): string => '',
  [DatabaseField.IS_FAVORITED]: (): boolean => false,
  [DatabaseField.IS_ENABLED]: (): boolean => true,
  [DatabaseField.NOTE]: (): string => '',
  // Result Defaults
  [DatabaseField.NUMBER]: (): number => 0,
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
