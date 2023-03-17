import { slugify } from '@/utils/common'
import { defineAsyncComponent } from 'vue'
import {
  DatabaseAction,
  DatabaseField,
  DatabaseType,
  DatabaseParentType,
  DatabaseChildType,
} from '@/types/database'
import { Icon } from '@/types/icons'
import type { ColumnProps } from '@/types/frontend'
import {
  getDetailsColumnProp,
  getEnabledColumnProp,
  getFavoritedColumnProp,
  getIdColumnProp,
  getNameColumnProp,
  getNumberColumnProp,
  getParentIdColumnProp,
  getValueColumnProp,
  getSeverityColumnProp,
  getTextColumnProp,
  getCreatedTimestampColumnProp,
  getTypeColumnProp,
} from './column-props'
import {
  exampleFields,
  exampleResultFields,
  logFields,
  settingFields,
  testFields,
  testResultFields,
} from '@/constants/model-fields'

export function getFields(table: DatabaseType): DatabaseField[] {
  return {
    [DatabaseType.SETTINGS]: settingFields.map((field) => field),
    [DatabaseType.LOGS]: logFields.map((field) => field),
    [DatabaseType.EXAMPLES]: exampleFields.map((field) => field),
    [DatabaseType.EXAMPLE_RESULTS]: exampleResultFields.map((field) => field),
    [DatabaseType.TESTS]: testFields.map((field) => field),
    [DatabaseType.TEST_RESULTS]: testResultFields.map((field) => field),
  }[table]
}

export function getInputComponents(table: DatabaseType): any[] {
  return {
    [DatabaseType.SETTINGS]: [],
    [DatabaseType.LOGS]: [],
    [DatabaseType.EXAMPLES]: [
      // defineAsyncComponent(() => import('@/components/ActionInputId.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputCreatedTimestamp.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputUpdatedTimestamp.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputName.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputDescription.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputParentStatus.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputFavorite.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputExampleMessage.vue')),
    ],
    [DatabaseType.EXAMPLE_RESULTS]: [
      //   defineAsyncComponent(() => import('@/components/ActionInputId.vue')),
      //   defineAsyncComponent(() => import('@/components/ActionInputCreatedTimestamp.vue')),
      //   defineAsyncComponent(() => import('@/components/ActionInputUpdatedTimestamp.vue')),
      //   defineAsyncComponent(() => import('@/components/ActionInputParentId.vue')),
      //   defineAsyncComponent(() => import('@/components/ActionInputNote.vue')),
      //   defineAsyncComponent(() => import('@/components/ActionInputExampleNumber.vue')),
    ],
    [DatabaseType.TESTS]: [
      // defineAsyncComponent(() => import('@/components/ActionInputId.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputCreatedTimestamp.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputUpdatedTimestamp.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputName.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputDescription.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputParentStatus.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputFavorite.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputExampleMessage.vue')),
    ],
    [DatabaseType.TEST_RESULTS]: [
      // defineAsyncComponent(() => import('@/components/ActionInputId.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputCreatedTimestamp.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputUpdatedTimestamp.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputParentId.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputNote.vue')),
      // defineAsyncComponent(() => import('@/components/ActionInputExampleNumber.vue')),
    ],
  }[table]
}

// TODO
// export function getParentCardComponents(table: DatabaseParentType): any {
//   return {
//     [DatabaseType.EXAMPLES]: defineAsyncComponent(() => import('@/components/ExampleCard.vue')),
//     [DatabaseType.TESTS]: defineAsyncComponent(() => import('@/components/TestCard.vue')),
//   }[table]
// }

export function getVisibleColumns(table: DatabaseType): DatabaseField[] {
  return {
    [DatabaseType.SETTINGS]: [],
    [DatabaseType.LOGS]: [],
    [DatabaseType.EXAMPLES]: [
      DatabaseField.ID,
      DatabaseField.CREATED_TIMESTAMP,
      DatabaseField.NAME,
    ],
    [DatabaseType.EXAMPLE_RESULTS]: [
      DatabaseField.ID,
      DatabaseField.CREATED_TIMESTAMP,
      DatabaseField.PARENT_ID,
    ],
    [DatabaseType.TESTS]: [DatabaseField.ID, DatabaseField.CREATED_TIMESTAMP, DatabaseField.NAME],
    [DatabaseType.TEST_RESULTS]: [
      DatabaseField.ID,
      DatabaseField.CREATED_TIMESTAMP,
      DatabaseField.PARENT_ID,
    ],
  }[table]
}

export function getSupportedActions(table: DatabaseType): DatabaseAction[] {
  return {
    [DatabaseType.SETTINGS]: [],
    [DatabaseType.LOGS]: [DatabaseAction.DELETE],
    [DatabaseType.EXAMPLES]: [
      DatabaseAction.CREATE,
      DatabaseAction.EDIT,
      DatabaseAction.DELETE,
      DatabaseAction.CHARTS,
    ],
    [DatabaseType.EXAMPLE_RESULTS]: [
      DatabaseAction.CREATE,
      DatabaseAction.EDIT,
      DatabaseAction.DELETE,
    ],
    [DatabaseType.TESTS]: [
      DatabaseAction.CREATE,
      DatabaseAction.EDIT,
      DatabaseAction.DELETE,
      DatabaseAction.CHARTS,
    ],
    [DatabaseType.TEST_RESULTS]: [
      DatabaseAction.CREATE,
      DatabaseAction.EDIT,
      DatabaseAction.DELETE,
    ],
  }[table]
}

export function getParentTable(recordTable: DatabaseChildType): DatabaseParentType {
  return {
    [DatabaseType.EXAMPLE_RESULTS]: DatabaseType.EXAMPLES,
    [DatabaseType.TEST_RESULTS]: DatabaseType.TESTS,
  }[recordTable] as any
}

export function getRecordTable(parentTable: DatabaseParentType): DatabaseChildType {
  return {
    [DatabaseType.EXAMPLES]: DatabaseType.EXAMPLE_RESULTS,
    [DatabaseType.TESTS]: DatabaseType.TEST_RESULTS,
  }[parentTable] as any
}

export function getLabelSingular(table: DatabaseType): string {
  return {
    [DatabaseType.SETTINGS]: 'Setting',
    [DatabaseType.LOGS]: 'Log',
    [DatabaseType.EXAMPLES]: 'Example',
    [DatabaseType.EXAMPLE_RESULTS]: 'Example Record',
    [DatabaseType.TESTS]: 'Test',
    [DatabaseType.TEST_RESULTS]: 'Test Record',
  }[table]
}

export function getTableIcon(table: DatabaseType): Icon {
  return {
    [DatabaseType.SETTINGS]: Icon.SETTINGS,
    [DatabaseType.LOGS]: Icon.LOGS,
    [DatabaseType.EXAMPLES]: Icon.EXAMPLES,
    [DatabaseType.EXAMPLE_RESULTS]: Icon.RECORDS,
    [DatabaseType.TESTS]: Icon.TESTS,
    [DatabaseType.TEST_RESULTS]: Icon.RECORDS,
  }[table]
}

export function getTableFromSlug(tableSlug: string): DatabaseType {
  return {
    [slugify(DatabaseType.SETTINGS)]: DatabaseType.SETTINGS,
    [slugify(DatabaseType.LOGS)]: DatabaseType.LOGS,
    [slugify(DatabaseType.EXAMPLES)]: DatabaseType.EXAMPLES,
    [slugify(DatabaseType.EXAMPLE_RESULTS)]: DatabaseType.EXAMPLE_RESULTS,
    [slugify(DatabaseType.TESTS)]: DatabaseType.TESTS,
    [slugify(DatabaseType.TEST_RESULTS)]: DatabaseType.TEST_RESULTS,
  }[tableSlug]
}

// export function getActionFromSlug(actionSlug: string): DatabaseAction {
//   return {
//     [slugify(DatabaseAction.CREATE)]: DatabaseAction.CREATE,
//     [slugify(DatabaseAction.INSPECT)]: DatabaseAction.INSPECT,
//     [slugify(DatabaseAction.EDIT)]: DatabaseAction.EDIT,
//     [slugify(DatabaseAction.DELETE)]: DatabaseAction.DELETE,
//     [slugify(DatabaseAction.CHARTS)]: DatabaseAction.CHARTS,
//   }[actionSlug]
// }

// export function getActionIcon(action: DatabaseAction): Icon {
//   return {
//     [DatabaseAction.CREATE]: Icon.CREATE,
//     [DatabaseAction.INSPECT]: Icon.INSPECT,
//     [DatabaseAction.EDIT]: Icon.EDIT,
//     [DatabaseAction.DELETE]: Icon.DELETE,
//     [DatabaseAction.CHARTS]: Icon.CHARTS,
//   }[action]
// }

export function getDatabaseTypeColumnProps(type: DatabaseType): ColumnProps[] {
  return {
    [DatabaseType.SETTINGS]: [getTypeColumnProp(), getIdColumnProp(), getValueColumnProp()],
    [DatabaseType.LOGS]: [
      getTypeColumnProp(),
      getIdColumnProp(),
      getCreatedTimestampColumnProp(),
      getSeverityColumnProp(),
      getNameColumnProp('Error'),
      getDetailsColumnProp(),
    ],
    [DatabaseType.EXAMPLES]: [
      getTypeColumnProp(),
      getIdColumnProp(),
      getNameColumnProp(),
      getTextColumnProp('Description'),
      getFavoritedColumnProp(),
      getEnabledColumnProp(),
    ],
    [DatabaseType.EXAMPLE_RESULTS]: [
      getTypeColumnProp(),
      getIdColumnProp(),
      getCreatedTimestampColumnProp(),
      getParentIdColumnProp(),
      getTextColumnProp('Note'),
      getNumberColumnProp(),
    ],
    [DatabaseType.TESTS]: [
      getTypeColumnProp(),
      getIdColumnProp(),
      getNameColumnProp(),
      getTextColumnProp('Description'),
      getFavoritedColumnProp(),
      getEnabledColumnProp(),
    ],
    [DatabaseType.TEST_RESULTS]: [
      getTypeColumnProp(),
      getIdColumnProp(),
      getCreatedTimestampColumnProp(),
      getParentIdColumnProp(),
      getTextColumnProp('Note'),
      getNumberColumnProp(),
    ],
  }[type]
}
