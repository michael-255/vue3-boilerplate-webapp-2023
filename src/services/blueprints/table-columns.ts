import { DatabaseField, DatabaseType, Severity } from '@/types/database'
import type { AppObject } from '@/types/misc'
import { truncateString } from '@/utils/common'
import { getDisplayDate } from '@/utils/common'
import type { QTableColumn } from 'quasar'

/*
TODO
- You need to expain what the table columns are for.
- Document every function in this file.
*/

/**
 * Used for data table row operations and don't need to be seen by the user.
 * This allows the user to hide columns and save horizontal screen space.
 */
export function requiredHiddenColumns(): QTableColumn[] {
  return [
    // Must be at position 0 for Data Table props.cols[0]
    {
      name: 'hiddenType',
      label: '',
      align: 'left',
      sortable: false,
      required: true,
      field: (row: any) => row[DatabaseField.TYPE],
      format: (val: DatabaseType) => `${val}`,
      style: 'display: none',
    },
    // Must be at position 1 for Data Table props.cols[1]
    {
      name: 'hiddenId',
      label: '',
      align: 'left',
      sortable: false,
      required: true,
      field: (row: any) => row[DatabaseField.ID],
      format: (val: string) => `${val}`,
      style: 'display: none',
    },
  ]
}

export function typeColumn(): QTableColumn {
  return {
    name: DatabaseField.TYPE,
    label: 'Type',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.TYPE],
    format: (val: DatabaseType) => `${val}`,
  }
}

export function partialIdColumn(): QTableColumn {
  return {
    name: DatabaseField.ID,
    label: 'Id*',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.ID],
    format: (val: string) => truncateString(val, 8, '*'),
  }
}

export function idColumn(): QTableColumn {
  return {
    name: DatabaseField.ID,
    label: 'Id',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.ID],
    format: (val: string) => `${val}`,
  }
}

export function createdTimestampColumn(): QTableColumn {
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

export function valueColumn(): QTableColumn {
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

export function severityColumn(): QTableColumn {
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

export function detailsColumn(): QTableColumn {
  return {
    name: DatabaseField.DETAILS,
    label: 'Details',
    align: 'left',
    sortable: false,
    required: false,
    field: (row: any) => row[DatabaseField.DETAILS],
    format: (val: AppObject) => truncateString(JSON.stringify(val), 30, '...'),
  }
}

export function labelColumn(): QTableColumn {
  return {
    name: DatabaseField.LABEL,
    label: 'Label',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.LABEL],
    format: (val: string) => truncateString(val, 30, '...'),
  }
}

export function nameColumn(): QTableColumn {
  return {
    name: DatabaseField.NAME,
    label: 'Name',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.NAME],
    format: (val: string) => truncateString(val, 30, '...'),
  }
}

export function descriptionColumn(): QTableColumn {
  return {
    name: DatabaseField.DESCRIPTION,
    label: 'Description',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.DESCRIPTION],
    format: (val: string) => truncateString(val, 30, '...'),
  }
}

export function favoritedColumn(): QTableColumn {
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

export function enabledColumn(): QTableColumn {
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

export function parentIdColumn(): QTableColumn {
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

export function noteColumn(): QTableColumn {
  return {
    name: DatabaseField.NOTE,
    label: 'Note',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row[DatabaseField.NOTE],
    format: (val: string) => truncateString(val, 30, '...'),
  }
}

export function numberColumn(): QTableColumn {
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
