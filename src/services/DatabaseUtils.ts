import {
  type ColumnProps,
  type ParentTable,
  type RecordTable,
  DatabaseAction,
  DatabaseTable,
  Icon,
  DatabaseField,
  settingFields,
  logFields,
  exampleFields,
  exampleRecordFields,
  testFields,
  testRecordFields,
} from '@/constants/globals'
import { slugify } from '@/utils/common'

export function getFields(table: DatabaseTable): DatabaseField[] {
  return {
    [DatabaseTable.SETTINGS]: settingFields.map((field) => field),
    [DatabaseTable.LOGS]: logFields.map((field) => field),
    [DatabaseTable.EXAMPLES]: exampleFields.map((field) => field),
    [DatabaseTable.EXAMPLE_RECORDS]: exampleRecordFields.map((field) => field),
    [DatabaseTable.TESTS]: testFields.map((field) => field),
    [DatabaseTable.TEST_RECORDS]: testRecordFields.map((field) => field),
  }[table]
}

export function getInputComponents(table: DatabaseTable): any[] {
  return {
    [DatabaseTable.SETTINGS]: [],
    [DatabaseTable.LOGS]: [],
    [DatabaseTable.EXAMPLES]: [],
    [DatabaseTable.EXAMPLE_RECORDS]: [],
    [DatabaseTable.TESTS]: [],
    [DatabaseTable.TEST_RECORDS]: [],
  }[table]
}

// TODO
export function getParentCardComponents(table: ParentTable): any {
  return {
    [DatabaseTable.EXAMPLES]: 'ExampleCard',
    [DatabaseTable.TESTS]: 'TestCard',
  }[table]
}

export function getColumns(table: DatabaseTable): ColumnProps[] {
  return {
    [DatabaseTable.SETTINGS]: [],
    [DatabaseTable.LOGS]: [],
    [DatabaseTable.EXAMPLES]: [],
    [DatabaseTable.EXAMPLE_RECORDS]: [],
    [DatabaseTable.TESTS]: [],
    [DatabaseTable.TEST_RECORDS]: [],
  }[table]
}

export function getVisibleColumns(table: DatabaseTable): DatabaseField[] {
  return {
    [DatabaseTable.SETTINGS]: [],
    [DatabaseTable.LOGS]: [],
    [DatabaseTable.EXAMPLES]: [],
    [DatabaseTable.EXAMPLE_RECORDS]: [],
    [DatabaseTable.TESTS]: [],
    [DatabaseTable.TEST_RECORDS]: [],
  }[table]
}

export function getSupportedActions(table: DatabaseTable): DatabaseAction[] {
  return {
    [DatabaseTable.SETTINGS]: [],
    [DatabaseTable.LOGS]: [],
    [DatabaseTable.EXAMPLES]: [],
    [DatabaseTable.EXAMPLE_RECORDS]: [],
    [DatabaseTable.TESTS]: [],
    [DatabaseTable.TEST_RECORDS]: [],
  }[table]
}

export function getParentTable(recordTable: RecordTable): ParentTable {
  return {
    [DatabaseTable.EXAMPLE_RECORDS]: DatabaseTable.EXAMPLES,
    [DatabaseTable.TEST_RECORDS]: DatabaseTable.TESTS,
  }[recordTable] as ParentTable
}

export function getRecordTable(parentTable: ParentTable): RecordTable {
  return {
    [DatabaseTable.EXAMPLES]: DatabaseTable.EXAMPLE_RECORDS,
    [DatabaseTable.TESTS]: DatabaseTable.TEST_RECORDS,
  }[parentTable] as RecordTable
}

export function getLabelSingular(table: DatabaseTable): string {
  return {
    [DatabaseTable.SETTINGS]: 'Setting',
    [DatabaseTable.LOGS]: 'Log',
    [DatabaseTable.EXAMPLES]: 'Example',
    [DatabaseTable.EXAMPLE_RECORDS]: 'Example Record',
    [DatabaseTable.TESTS]: 'Test',
    [DatabaseTable.TEST_RECORDS]: 'Test Record',
  }[table]
}

export function getTableIcon(table: DatabaseTable): Icon {
  return {
    [DatabaseTable.SETTINGS]: Icon.SETTINGS,
    [DatabaseTable.LOGS]: Icon.LOGS,
    [DatabaseTable.EXAMPLES]: Icon.EXAMPLES,
    [DatabaseTable.EXAMPLE_RECORDS]: Icon.RECORDS,
    [DatabaseTable.TESTS]: Icon.TESTS,
    [DatabaseTable.TEST_RECORDS]: Icon.RECORDS,
  }[table]
}

export function getTableFromSlug(tableSlug: string): DatabaseTable {
  return {
    [slugify(DatabaseTable.SETTINGS)]: DatabaseTable.SETTINGS,
    [slugify(DatabaseTable.LOGS)]: DatabaseTable.LOGS,
    [slugify(DatabaseTable.EXAMPLES)]: DatabaseTable.EXAMPLES,
    [slugify(DatabaseTable.EXAMPLE_RECORDS)]: DatabaseTable.EXAMPLE_RECORDS,
    [slugify(DatabaseTable.TESTS)]: DatabaseTable.TESTS,
    [slugify(DatabaseTable.TEST_RECORDS)]: DatabaseTable.TEST_RECORDS,
  }[tableSlug]
}

export function getActionFromSlug(actionSlug: string): DatabaseAction {
  return {
    [slugify(DatabaseAction.NONE)]: DatabaseAction.NONE,
    [slugify(DatabaseAction.CREATE)]: DatabaseAction.CREATE,
    [slugify(DatabaseAction.INSPECT)]: DatabaseAction.INSPECT,
    [slugify(DatabaseAction.EDIT)]: DatabaseAction.EDIT,
    [slugify(DatabaseAction.DELETE)]: DatabaseAction.DELETE,
    [slugify(DatabaseAction.CLEAR)]: DatabaseAction.CLEAR,
    [slugify(DatabaseAction.CHARTS)]: DatabaseAction.CHARTS,
  }[actionSlug]
}

export function getActionIcon(action: DatabaseAction): Icon {
  return {
    [DatabaseAction.NONE]: Icon.NONE,
    [DatabaseAction.CREATE]: Icon.CREATE,
    [DatabaseAction.INSPECT]: Icon.INSPECT,
    [DatabaseAction.EDIT]: Icon.EDIT,
    [DatabaseAction.DELETE]: Icon.DELETE,
    [DatabaseAction.CLEAR]: Icon.CLEAR,
    [DatabaseAction.CHARTS]: Icon.CHARTS,
  }[action]
}
