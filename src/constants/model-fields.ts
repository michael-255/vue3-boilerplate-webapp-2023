import { DatabaseField } from '@/types/database'

export const allFields: readonly DatabaseField[] = Object.values(DatabaseField)

export const settingFields: readonly DatabaseField[] = [
  DatabaseField.TYPE,
  DatabaseField.ID,
  DatabaseField.VALUE,
]

export const logFields: readonly DatabaseField[] = [
  DatabaseField.TYPE,
  DatabaseField.ID,
  DatabaseField.CREATED_TIMESTAMP,
  DatabaseField.SEVERITY,
  DatabaseField.NAME,
  DatabaseField.DETAILS,
]

export const exampleFields: readonly DatabaseField[] = [
  DatabaseField.TYPE,
  DatabaseField.ID,
  DatabaseField.NAME,
  DatabaseField.TEXT,
  DatabaseField.IS_FAVORITED,
  DatabaseField.IS_ENABLED,
]

export const exampleResultFields: readonly DatabaseField[] = [
  DatabaseField.TYPE,
  DatabaseField.ID,
  DatabaseField.CREATED_TIMESTAMP,
  DatabaseField.PARENT_ID,
  DatabaseField.NUMBER,
]

export const testFields: readonly DatabaseField[] = exampleFields
export const testResultFields: readonly DatabaseField[] = exampleResultFields
