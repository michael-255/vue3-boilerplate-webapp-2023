import { DatabaseType } from '@/types/database'

export const allTypes: readonly DatabaseType[] = Object.values(DatabaseType)

export const internalTypes: readonly DatabaseType[] = [DatabaseType.SETTINGS, DatabaseType.LOGS]

export const parentTypes: readonly DatabaseType[] = [DatabaseType.EXAMPLES, DatabaseType.TESTS]

export const childTypes: readonly DatabaseType[] = [
  DatabaseType.EXAMPLE_RESULTS,
  DatabaseType.TEST_RESULTS,
]
