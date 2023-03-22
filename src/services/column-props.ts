import type { ColumnProps } from '@/types/frontend'
import { DatabaseField, DatabaseType, Severity } from '@/types/database'
import type { AppObject } from '@/types/misc'
import { truncateString } from '@/utils/common'
import { getDisplayDate } from '@/utils/common'

export function getTypeColumnProp(): ColumnProps {
  // Must be at position 0 (props.cols[0])
  return {
    name: DatabaseField.TYPE,
    label: 'Type',
    align: 'left',
    sortable: true,
    required: true,
    field: (row: any) => row[DatabaseField.TYPE],
    format: (val: DatabaseType) => `${val}`,
  }
}

/**
 * Used for data table row operations and shouldn't be seen by the user.
 * This save horizontal screen space due to the large length of UIDs.
 */
export function getHiddenIdColumnProp(): ColumnProps {
  // Must be at position 1 (props.cols[1])
  return {
    name: 'hiddenId',
    label: '',
    align: 'left',
    sortable: true,
    required: true,
    field: (row: any) => row[DatabaseField.ID],
    format: (val: string) => `${val}`,
    style: 'display: none',
  }
}

export function getTruncatedIdColumnProp(): ColumnProps {
  return {
    name: DatabaseField.ID,
    label: 'Id*',
    align: 'left',
    sortable: true,
    required: true,
    field: (row: any) => row[DatabaseField.ID],
    format: (val: string) => truncateString(val, 8, '*'),
  }
}

export function getFullIdColumnProp(): ColumnProps {
  return {
    name: DatabaseField.ID,
    label: 'Id',
    align: 'left',
    sortable: true,
    required: true,
    field: (row: any) => row[DatabaseField.ID],
    format: (val: string) => `${val}`,
  }
}

export function getCreatedTimestampColumnProp(): ColumnProps {
  return {
    name: DatabaseField.CREATED_TIMESTAMP,
    label: 'Created Date',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.CREATED_TIMESTAMP],
    format: (val: number) => getDisplayDate(val),
  }
}

export function getValueColumnProp(): ColumnProps {
  return {
    name: DatabaseField.VALUE,
    label: 'Setting Value',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.VALUE],
    format: (val: any) => truncateString(JSON.stringify(val), 30, '...'),
  }
}

export function getSeverityColumnProp(): ColumnProps {
  return {
    name: DatabaseField.SEVERITY,
    label: 'Severity',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.SEVERITY],
    format: (val: Severity) => `${val}`,
  }
}

export function getDetailsColumnProp(): ColumnProps {
  return {
    name: DatabaseField.DETAILS,
    label: 'Details',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.DETAILS],
    format: (val: AppObject) => truncateString(JSON.stringify(val), 30, '...'),
  }
}

export function getNameColumnProp(customLabel?: string): ColumnProps {
  return {
    name: DatabaseField.NAME,
    label: customLabel ? customLabel : 'Name',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.NAME],
    format: (val: string) => truncateString(val, 30, '...'),
  }
}

export function getTextColumnProp(customLabel?: string): ColumnProps {
  return {
    name: DatabaseField.TEXT,
    label: customLabel ? customLabel : 'Text',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.TEXT],
    format: (val: string) => truncateString(val, 30, '...'),
  }
}

export function getToggleColumnProp(
  field: DatabaseField.IS_FAVORITED | DatabaseField.IS_ENABLED,
  customLabel?: string
): ColumnProps {
  return {
    name: field,
    label: customLabel ? customLabel : 'Toggle',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[field],
    format: (val: boolean) => (val ? 'Yes' : 'No'),
  }
}

export function getParentIdColumnProp(): ColumnProps {
  return {
    name: DatabaseField.PARENT_ID,
    label: 'Parent Id*',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.PARENT_ID],
    format: (val: string) => truncateString(val, 8, '*'),
  }
}

export function getNumberColumnProp(): ColumnProps {
  return {
    name: DatabaseField.NUMBER,
    label: 'Number',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.NUMBER],
    format: (val: number) => `${val}`,
  }
}
