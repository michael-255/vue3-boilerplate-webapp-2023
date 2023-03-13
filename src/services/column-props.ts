import type { ColumnProps } from '@/constants/app'
import { DatabaseField, DatabaseType, Severity } from '@/constants/database'
import type { AppObject } from '@/constants/misc'
import { truncateString } from '@/utils/common'
import { date } from 'quasar'

export function getTypeColumnProp(): ColumnProps {
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

export function getIdColumnProp(): ColumnProps {
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

export function getTimestampColumnProp(
  field: DatabaseField.CREATED_TIMESTAMP | DatabaseField.UPDATED_TIMESTAMP
): ColumnProps {
  return {
    name: field,
    label: field === DatabaseField.CREATED_TIMESTAMP ? 'Created Date' : 'Updated Date',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[field],
    format: (val: number) => date.formatDate(val, 'ddd, YYYY MMM Do, h:mm A'),
  }
}

export function getSettingColumnProp(): ColumnProps {
  return {
    name: DatabaseField.SETTING,
    label: 'Setting Value',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.SETTING],
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

export function getAppNameColumnProp(): ColumnProps {
  return {
    name: DatabaseField.APP_NAME,
    label: 'Application Name',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.APP_NAME],
    format: (val: string) => `${val}`,
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

export function getFavoritedColumnProp(): ColumnProps {
  return {
    name: DatabaseField.IS_FAVORITED,
    label: 'Favorited',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.IS_FAVORITED],
    format: (val: boolean) => (val ? 'Yes' : 'No'),
  }
}

export function getEnabledColumnProp(): ColumnProps {
  return {
    name: DatabaseField.IS_ENABLED,
    label: 'Enabled',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.IS_ENABLED],
    format: (val: boolean) => (val ? 'Yes' : 'No'),
  }
}

export function getActiveColumnProp(): ColumnProps {
  return {
    name: DatabaseField.IS_ACTIVE,
    label: 'Active',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.IS_ACTIVE],
    format: (val: boolean) => (val ? 'Yes' : 'No'),
  }
}

export function getParentIdColumnProp(): ColumnProps {
  return {
    name: DatabaseField.PARENT_ID,
    label: 'Parent Id',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.PARENT_ID],
    format: (val: string) => truncateString(val, 8, '*'),
  }
}

export function getLinkedIdsColumnProp(customLabel?: string): ColumnProps {
  return {
    name: DatabaseField.LINKED_IDS,
    label: customLabel ? customLabel : 'Linked Ids',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.LINKED_IDS],
    format: (val: string[]) => truncateString(JSON.stringify(val), 30, '...'),
  }
}

export function getMessageColumnProp(): ColumnProps {
  return {
    name: DatabaseField.MESSAGE,
    label: 'Message',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.MESSAGE],
    format: (val: string) => truncateString(val, 30, '...'),
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
