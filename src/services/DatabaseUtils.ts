import {
  type ColumnProps,
  type ParentTable,
  type RecordTable,
  type SettingValue,
  type Severity,
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
  type AppObject,
  RecordStatus,
  ParentStatus,
} from '@/constants/globals'
import { slugify, truncateString } from '@/utils/common'
import { defineAsyncComponent } from 'vue'
import { date } from 'quasar'

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
    [DatabaseTable.EXAMPLES]: defineAsyncComponent(() => import('@/components/ExampleCard.vue')),
    [DatabaseTable.TESTS]: defineAsyncComponent(() => import('@/components/TestCard.vue')),
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

export function getTableColumnProps(table: DatabaseTable): ColumnProps[] {
  return {
    [DatabaseTable.SETTINGS]: getSettingColumnProps(),
    [DatabaseTable.LOGS]: getLogColumnProps(),
    [DatabaseTable.EXAMPLES]: getExampleColumnProps(),
    [DatabaseTable.EXAMPLE_RECORDS]: getExampleRecordColumnProps(),
    [DatabaseTable.TESTS]: getTestColumnProps(),
    [DatabaseTable.TEST_RECORDS]: getTestRecordColumnProps(),
  }[table]
}

export function getSettingColumnProps(): ColumnProps[] {
  return [
    {
      name: DatabaseField.KEY,
      label: 'Key',
      align: 'left',
      sortable: true,
      required: true,
      field: (row: any) => row[DatabaseField.KEY],
      format: (val: string) => `${val}`,
    },
    {
      name: DatabaseField.VALUE,
      label: 'Value',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.VALUE],
      format: (val: SettingValue) => `${val}`,
    },
  ]
}

export function getLogColumnProps(): ColumnProps[] {
  return [
    {
      name: DatabaseField.AUTO_ID,
      label: 'Auto Id',
      align: 'left',
      sortable: true,
      required: true,
      field: (row: any) => row[DatabaseField.AUTO_ID],
      format: (val: number) => `${val}`,
    },
    {
      name: DatabaseField.TIMESTAMP,
      label: 'Timestamp',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.TIMESTAMP],
      format: (val: number) => date.formatDate(val, 'ddd, YYYY MMM Do, h:mm A'),
    },
    {
      name: DatabaseField.SEVERITY,
      label: 'Severity',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.SEVERITY],
      format: (val: Severity) => `${val}`,
    },
    {
      name: DatabaseField.APP_NAME,
      label: 'Application Name',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.APP_NAME],
      format: (val: string) => `${val}`,
    },
    {
      name: DatabaseField.LABEL,
      label: 'Label',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.LABEL],
      format: (val: string) => `${val}`,
    },
    {
      name: DatabaseField.DETAILS,
      label: 'Details',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.DETAILS],
      format: (val: AppObject) => truncateString(JSON.stringify(val), 30, '...'),
    },
  ]
}

export function getExampleColumnProps(): ColumnProps[] {
  return [
    ...getParentColumnProps(),
    {
      name: DatabaseField.EXAMPLE_MESSAGE,
      label: 'Example Message',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.EXAMPLE_MESSAGE],
      format: (val: string) => truncateString(val, 30, '...'),
    },
  ]
}

export function getExampleRecordColumnProps(): ColumnProps[] {
  return [
    ...getRecordColumnProps(),
    {
      name: DatabaseField.EXAMPLE_NUMBER,
      label: 'Example Number',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.EXAMPLE_NUMBER],
      format: (val: number) => `${val}`,
    },
  ]
}

export function getTestColumnProps(): ColumnProps[] {
  return [
    ...getExampleColumnProps(), // Using as Test
  ]
}

export function getTestRecordColumnProps(): ColumnProps[] {
  return [
    ...getExampleRecordColumnProps(), // Using as Test Record
  ]
}

export function getEntityColumnProps(): ColumnProps[] {
  return [
    {
      // This is only used for row operations and shouldn't be seen by the user
      // This was done because normal UIDs take up too much screen space
      name: 'hiddenId',
      label: '',
      align: 'left',
      sortable: true,
      required: true,
      field: (row: any) => row[DatabaseField.ID],
      format: (val: string) => `${val}`,
      style: 'display: none',
    },
    {
      name: DatabaseField.ID,
      label: 'Id*',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.ID],
      format: (val: string) => truncateString(val, 8, '*'),
    },
    {
      name: DatabaseField.CREATED_TIMESTAMP,
      label: 'Created Date',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.CREATED_TIMESTAMP],
      format: (val: number) => date.formatDate(val, 'ddd, YYYY MMM Do, h:mm A'),
    },
    {
      name: DatabaseField.UPDATED_TIMESTAMP,
      label: 'Updated Date',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.UPDATED_TIMESTAMP],
      format: (val: number) => date.formatDate(val, 'ddd, YYYY MMM Do, h:mm A'),
    },
  ]
}

function getParentColumnProps(): ColumnProps[] {
  return [
    ...getEntityColumnProps(),
    {
      name: DatabaseField.NAME,
      label: 'Name',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.NAME],
      format: (val: string) => `${val}`,
    },
    {
      name: DatabaseField.DESCRIPTION,
      label: 'Description',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.DESCRIPTION],
      format: (val: string) => truncateString(val, 30, '...'),
    },
    {
      name: DatabaseField.PARENT_STATUS,
      label: 'Parent Status',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.PARENT_STATUS],
      format: (val: ParentStatus) => `${val}`,
    },
    {
      name: DatabaseField.FAVORITE,
      label: 'Favorite',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.FAVORITE],
      format: (val: boolean) => (val ? 'Yes' : 'No'),
    },
  ]
}

function getRecordColumnProps(): ColumnProps[] {
  return [
    ...getEntityColumnProps(),
    {
      name: DatabaseField.PARENT_ID,
      label: 'Parent Id',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.PARENT_ID],
      format: (val: string) => truncateString(val, 8, '*'),
    },
    {
      name: DatabaseField.RECORD_STATUS,
      label: 'Record Status',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.RECORD_STATUS],
      format: (val: RecordStatus) => `${val}`,
    },
    {
      name: DatabaseField.NOTE,
      label: 'Note',
      align: 'left',
      sortable: true,
      required: false,
      field: (row: any) => row[DatabaseField.NOTE],
      format: (val: string) => truncateString(val, 30, '...'),
    },
  ]
}
