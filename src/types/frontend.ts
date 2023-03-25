import type { DatabaseField, DatabaseParentType } from '@/types/database'

/**
 * Used to display data from parent types on the dashboard.
 */
export type DashboardParent = {
  [DatabaseField.TYPE]: DatabaseParentType
  [DatabaseField.ID]: string
  [DatabaseField.NAME]: string
  [DatabaseField.IS_FAVORITED]: boolean
  previousNote?: string
  previousCreatedTimestamp?: number
  previousNumber?: number
}
