import type { DatabaseField, DatabaseParentType } from '@/types/database'

/**
 * Properties used to display data items in a QTable.
 * Use "hiddenId" for column "0" so a truncated version can be shown to save horizontal space.
 */
export type ColumnProps = {
  name: DatabaseField | 'hiddenId'
  label: string
  align: string
  sortable: boolean
  required: boolean
  field: (val: any) => any
  format: (val: any) => any
  style?: string
}

/**
 * Used to display data from parent types on the dashboard.
 */
export type DashboardParent = {
  [DatabaseField.TYPE]: DatabaseParentType
  [DatabaseField.ID]: string
  [DatabaseField.NAME]: string
  [DatabaseField.IS_FAVORITED]: boolean
  previousText?: string
  previousCreatedTimestamp?: number
  previousNumber?: number
}
