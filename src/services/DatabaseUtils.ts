import { slugify } from '@/utils/common'
import { defineAsyncComponent } from 'vue'
import {
  DatabaseAction,
  DatabaseField,
  DatabaseType,
  type DatabaseParentType,
  type DatabaseChildType,
} from '@/types/database'
import { Icon } from '@/types/icons'
import type { ColumnProps } from '@/types/frontend'
import {
  getDetailsColumnProp,
  getToggleColumnProp,
  getTruncatedIdColumnProp,
  getFullIdColumnProp,
  getNameColumnProp,
  getNumberColumnProp,
  getParentIdColumnProp,
  getValueColumnProp,
  getSeverityColumnProp,
  getTextColumnProp,
  getCreatedTimestampColumnProp,
  getTypeColumnProp,
  getHiddenIdColumnProp,
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

export function getVisibleColumns(table: DatabaseType): DatabaseField[] {
  return {
    [DatabaseType.SETTINGS]: [DatabaseField.VALUE],
    [DatabaseType.LOGS]: [
      DatabaseField.CREATED_TIMESTAMP,
      DatabaseField.SEVERITY,
      DatabaseField.NAME,
    ],
    [DatabaseType.EXAMPLES]: [DatabaseField.CREATED_TIMESTAMP, DatabaseField.NAME],
    [DatabaseType.EXAMPLE_RESULTS]: [DatabaseField.CREATED_TIMESTAMP, DatabaseField.PARENT_ID],
    [DatabaseType.TESTS]: [DatabaseField.CREATED_TIMESTAMP, DatabaseField.NAME],
    [DatabaseType.TEST_RESULTS]: [DatabaseField.CREATED_TIMESTAMP, DatabaseField.PARENT_ID],
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

export function getParentType(childType: DatabaseChildType): DatabaseParentType {
  return {
    [DatabaseType.EXAMPLE_RESULTS]: DatabaseType.EXAMPLES,
    [DatabaseType.TEST_RESULTS]: DatabaseType.TESTS,
  }[childType] as any
}

export function getChildType(parentType: DatabaseParentType): DatabaseChildType {
  return {
    [DatabaseType.EXAMPLES]: DatabaseType.EXAMPLE_RESULTS,
    [DatabaseType.TESTS]: DatabaseType.TEST_RESULTS,
  }[parentType] as any
}

export function getLabelSingular(table: DatabaseType): string {
  return {
    [DatabaseType.SETTINGS]: 'Setting',
    [DatabaseType.LOGS]: 'Log',
    [DatabaseType.EXAMPLES]: 'Example',
    [DatabaseType.EXAMPLE_RESULTS]: 'Example Result',
    [DatabaseType.TESTS]: 'Test',
    [DatabaseType.TEST_RESULTS]: 'Test Result',
  }[table]
}

export function getTypeFromSlug(databaseTypeSlug: string) {
  return {
    [slugify(DatabaseType.SETTINGS)]: DatabaseType.SETTINGS,
    [slugify(DatabaseType.LOGS)]: DatabaseType.LOGS,
    [slugify(DatabaseType.EXAMPLES)]: DatabaseType.EXAMPLES,
    [slugify(DatabaseType.EXAMPLE_RESULTS)]: DatabaseType.EXAMPLE_RESULTS,
    [slugify(DatabaseType.TESTS)]: DatabaseType.TESTS,
    [slugify(DatabaseType.TEST_RESULTS)]: DatabaseType.TEST_RESULTS,
  }[databaseTypeSlug]
}

export function getDatabaseTypeColumnProps(type: DatabaseType): ColumnProps[] {
  return {
    [DatabaseType.SETTINGS]: [
      getTypeColumnProp(), // required
      getHiddenIdColumnProp(), // required
      getFullIdColumnProp(), // Full or Truncated should be used (not both)
      getValueColumnProp(),
    ],
    [DatabaseType.LOGS]: [
      getTypeColumnProp(), // required
      getHiddenIdColumnProp(), // required
      getTruncatedIdColumnProp(), // Full or Truncated should be used (not both)
      getCreatedTimestampColumnProp(),
      getSeverityColumnProp(),
      getNameColumnProp('Error'),
      getDetailsColumnProp(),
    ],
    [DatabaseType.EXAMPLES]: [
      getTypeColumnProp(), // required
      getHiddenIdColumnProp(), // required
      getTruncatedIdColumnProp(), // Full or Truncated should be used (not both)
      getNameColumnProp('Name'),
      getTextColumnProp('Description'),
      getToggleColumnProp(DatabaseField.IS_FAVORITED, 'Favorite'),
      getToggleColumnProp(DatabaseField.IS_ENABLED, 'Enabled'),
    ],
    [DatabaseType.EXAMPLE_RESULTS]: [
      getTypeColumnProp(), // required
      getHiddenIdColumnProp(), // required
      getTruncatedIdColumnProp(), // Full or Truncated should be used (not both)
      getCreatedTimestampColumnProp(),
      getParentIdColumnProp(),
      getTextColumnProp('Note'),
      getNumberColumnProp(),
    ],
    [DatabaseType.TESTS]: [
      getTypeColumnProp(), // required
      getHiddenIdColumnProp(), // required
      getTruncatedIdColumnProp(), // Full or Truncated should be used (not both)
      getNameColumnProp('Name'),
      getTextColumnProp('Description'),
      getToggleColumnProp(DatabaseField.IS_FAVORITED, 'Favorite'),
      getToggleColumnProp(DatabaseField.IS_ENABLED, 'Enabled'),
    ],
    [DatabaseType.TEST_RESULTS]: [
      getTypeColumnProp(), // required
      getHiddenIdColumnProp(), // required
      getTruncatedIdColumnProp(), // Full or Truncated should be used (not both)
      getCreatedTimestampColumnProp(),
      getParentIdColumnProp(),
      getTextColumnProp('Note'),
      getNumberColumnProp(),
    ],
  }[type]
}
