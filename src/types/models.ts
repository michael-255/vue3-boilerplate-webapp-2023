import type { AppObject } from '@/types/misc'
import type { DatabaseField, DatabaseType, SettingId, Severity } from '@/types/database'
import type { Optional } from '@/types/misc'

/**
 * All database record types. Cast your result to the one you are currently working with if known.
 * Cast back to this type when saving or updating the database.
 */
export interface DatabaseRecord {
  [DatabaseField.TYPE]: DatabaseType
  [DatabaseField.ID]: string | SettingId
  [DatabaseField.VALUE]?: any
  [DatabaseField.CREATED_TIMESTAMP]?: number
  [DatabaseField.SEVERITY]?: Severity
  [DatabaseField.NAME]?: string
  [DatabaseField.DETAILS]?: Optional<AppObject>
  [DatabaseField.TEXT]?: Optional<string>
  [DatabaseField.IS_FAVORITED]?: boolean
  [DatabaseField.IS_ENABLED]?: boolean
  [DatabaseField.PARENT_ID]?: string
  [DatabaseField.NUMBER]?: number
}

/**
 * Core app setting type.
 */
export type Setting = Pick<
  DatabaseRecord,
  DatabaseField.TYPE | DatabaseField.ID | DatabaseField.VALUE
>

/**
 * Core app log type.
 */
export type Log = Pick<
  DatabaseRecord,
  | DatabaseField.TYPE
  | DatabaseField.ID
  | DatabaseField.CREATED_TIMESTAMP
  | DatabaseField.SEVERITY
  | DatabaseField.NAME
  | DatabaseField.DETAILS
>

/**
 * Example parent type.
 */
export type Example = Pick<
  DatabaseRecord,
  | DatabaseField.TYPE
  | DatabaseField.ID
  | DatabaseField.NAME
  | DatabaseField.TEXT
  | DatabaseField.IS_FAVORITED
  | DatabaseField.IS_ENABLED
>

/**
 * Example child type.
 */
export type ExampleResult = Pick<
  DatabaseRecord,
  | DatabaseField.TYPE
  | DatabaseField.ID
  | DatabaseField.CREATED_TIMESTAMP
  | DatabaseField.PARENT_ID
  | DatabaseField.TEXT
  | DatabaseField.NUMBER
>

/**
 * Test parent type.
 */
export type Test = Example

/**
 * Test child type.
 */
export type TestResult = ExampleResult
