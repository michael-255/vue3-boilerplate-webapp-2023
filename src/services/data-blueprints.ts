import { Icon } from '@/types/icons'
import type { Optional } from '@/types/misc'
import { slugify } from '@/utils/common'
import type { QTableColumn } from 'quasar'
import { numberChart, type ChartBlueprint } from '@/services/chart-blueprints'
import {
  DatabaseAction,
  DatabaseField,
  DatabaseType,
  type DatabaseParentType,
  type DatabaseChildType,
} from '@/types/database'
import {
  typeField,
  idField,
  valueField,
  createdTimestampField,
  severityField,
  labelField,
  detailsField,
  enabledField,
  favoritedField,
  descriptionField,
  nameField,
  parentIdField,
  noteField,
  numberField,
  type FieldBlueprint,
} from '@/services/field-bluprints'
import {
  createdTimestampColumn,
  descriptionColumn,
  detailsColumn,
  enabledColumn,
  favoritedColumn,
  idColumn,
  labelColumn,
  nameColumn,
  noteColumn,
  numberColumn,
  parentIdColumn,
  partialIdColumn,
  requiredHiddenColumns,
  severityColumn,
  valueColumn,
} from '@/services/table-columns'

export type DataBlueprint = {
  readonly type: DatabaseType
  readonly typeSlug: string
  readonly singularLabel: string
  readonly pluralLabel: string
  readonly icon: Icon
  readonly parentType: Optional<DatabaseParentType>
  readonly childType: Optional<DatabaseChildType>
  readonly supportedActions: DatabaseAction[]
  readonly chartBluprints: ChartBlueprint[]
  readonly fieldBlueprints: FieldBlueprint[]
  readonly visibleColumns: DatabaseField[]
  readonly tableColumns: QTableColumn[]
}

export const dataBlueprints: readonly DataBlueprint[] = [
  /////////////////////////////////////////////////////////////////////////////
  {
    type: DatabaseType.SETTING,
    typeSlug: slugify(DatabaseType.SETTING),
    singularLabel: 'Setting',
    pluralLabel: 'Settings',
    icon: Icon.SETTINGS,
    parentType: null,
    childType: null,
    supportedActions: [],
    chartBluprints: [],
    fieldBlueprints: [typeField(), idField(), valueField()],
    visibleColumns: [DatabaseField.ID, DatabaseField.VALUE],
    tableColumns: [...requiredHiddenColumns(), idColumn(), valueColumn()],
  },
  /////////////////////////////////////////////////////////////////////////////
  {
    type: DatabaseType.LOG,
    typeSlug: slugify(DatabaseType.LOG),
    singularLabel: 'Log',
    pluralLabel: 'Logs',
    icon: Icon.LOGS,
    parentType: null,
    childType: null,
    supportedActions: [DatabaseAction.DELETE],
    chartBluprints: [],
    fieldBlueprints: [
      typeField(),
      idField(),
      createdTimestampField(),
      severityField(),
      labelField(),
      detailsField(),
    ],
    visibleColumns: [
      DatabaseField.ID,
      DatabaseField.CREATED_TIMESTAMP,
      DatabaseField.SEVERITY,
      DatabaseField.LABEL,
    ],
    tableColumns: [
      ...requiredHiddenColumns(),
      partialIdColumn(),
      createdTimestampColumn(),
      severityColumn(),
      labelColumn(),
      detailsColumn(),
    ],
  },
  /////////////////////////////////////////////////////////////////////////////
  {
    type: DatabaseType.EXAMPLE,
    typeSlug: slugify(DatabaseType.EXAMPLE),
    singularLabel: 'Example',
    pluralLabel: 'Examples',
    icon: Icon.EXAMPLES,
    parentType: null,
    childType: DatabaseType.EXAMPLE_RESULT,
    supportedActions: [
      DatabaseAction.CREATE,
      DatabaseAction.EDIT,
      DatabaseAction.DELETE,
      DatabaseAction.CHARTS,
    ],
    chartBluprints: [numberChart()],
    fieldBlueprints: [
      typeField(),
      idField(),
      nameField(),
      descriptionField(),
      favoritedField(),
      enabledField(),
    ],
    visibleColumns: [DatabaseField.ID, DatabaseField.NAME],
    tableColumns: [
      ...requiredHiddenColumns(),
      partialIdColumn(),
      nameColumn(),
      descriptionColumn(),
      favoritedColumn(),
      enabledColumn(),
    ],
  },
  /////////////////////////////////////////////////////////////////////////////
  {
    type: DatabaseType.EXAMPLE_RESULT,
    typeSlug: slugify(DatabaseType.EXAMPLE_RESULT),
    singularLabel: 'Example Result',
    pluralLabel: 'Example Results',
    icon: Icon.RECORDS,
    parentType: DatabaseType.EXAMPLE,
    childType: null,
    supportedActions: [DatabaseAction.CREATE, DatabaseAction.EDIT, DatabaseAction.DELETE],
    chartBluprints: [],
    fieldBlueprints: [
      typeField(),
      idField(),
      createdTimestampField(),
      parentIdField(),
      noteField(),
      numberField(),
    ],
    visibleColumns: [DatabaseField.ID, DatabaseField.CREATED_TIMESTAMP, DatabaseField.PARENT_ID],
    tableColumns: [
      ...requiredHiddenColumns(),
      partialIdColumn(),
      createdTimestampColumn(),
      parentIdColumn(),
      noteColumn(),
      numberColumn(),
    ],
  },
  /////////////////////////////////////////////////////////////////////////////
  {
    type: DatabaseType.TEST,
    typeSlug: slugify(DatabaseType.TEST),
    singularLabel: 'Test',
    pluralLabel: 'Tests',
    icon: Icon.TESTS,
    parentType: null,
    childType: DatabaseType.TEST_RESULT,
    supportedActions: [
      DatabaseAction.CREATE,
      DatabaseAction.EDIT,
      DatabaseAction.DELETE,
      DatabaseAction.CHARTS,
    ],
    chartBluprints: [numberChart()],
    fieldBlueprints: [
      typeField(),
      idField(),
      nameField(),
      descriptionField(),
      favoritedField(),
      enabledField(),
    ],
    visibleColumns: [DatabaseField.ID, DatabaseField.NAME],
    tableColumns: [
      ...requiredHiddenColumns(),
      partialIdColumn(),
      nameColumn(),
      descriptionColumn(),
      favoritedColumn(),
      enabledColumn(),
    ],
  },
  /////////////////////////////////////////////////////////////////////////////
  {
    type: DatabaseType.TEST_RESULT,
    typeSlug: slugify(DatabaseType.TEST_RESULT),
    singularLabel: 'Test Result',
    pluralLabel: 'Test Results',
    icon: Icon.RECORDS,
    parentType: DatabaseType.TEST,
    childType: null,
    supportedActions: [DatabaseAction.CREATE, DatabaseAction.EDIT, DatabaseAction.DELETE],
    chartBluprints: [],
    fieldBlueprints: [
      typeField(),
      idField(),
      createdTimestampField(),
      parentIdField(),
      noteField(),
      numberField(),
    ],
    visibleColumns: [DatabaseField.ID, DatabaseField.CREATED_TIMESTAMP, DatabaseField.PARENT_ID],
    tableColumns: [
      ...requiredHiddenColumns(),
      partialIdColumn(),
      createdTimestampColumn(),
      parentIdColumn(),
      noteColumn(),
      numberColumn(),
    ],
  },
  /////////////////////////////////////////////////////////////////////////////
]
