import { DatabaseField, DatabaseType, Severity, type SettingValue } from '@/types/database'
import type { AppObject, Optional } from '@/types/misc'
import { getDisplayDate } from '@/utils/common'
import { defineAsyncComponent } from 'vue'

export type FieldBlueprint = {
  readonly field: DatabaseField
  readonly label: string
  readonly inspectFormat: (val: any) => string
  readonly component: Optional<any>
}

export function typeField(): FieldBlueprint {
  return {
    field: DatabaseField.TYPE,
    label: 'Type',
    inspectFormat: (val: DatabaseType) => `${val}`,
    component: null,
  }
}

export function idField(): FieldBlueprint {
  return {
    field: DatabaseField.ID,
    label: 'Id',
    inspectFormat: (val: string) => `${val}`,
    component: defineAsyncComponent(() => import('@/components/ActionInputId.vue')),
  }
}

export function valueField(): FieldBlueprint {
  return {
    field: DatabaseField.VALUE,
    label: 'Setting Value',
    inspectFormat: (val: SettingValue) => `${val}`,
    component: null,
  }
}

export function createdTimestampField(): FieldBlueprint {
  return {
    field: DatabaseField.CREATED_TIMESTAMP,
    label: 'Created Date',
    inspectFormat: (val: number) => getDisplayDate(val),
    component: defineAsyncComponent(() => import('@/components/ActionInputCreatedTimestamp.vue')),
  }
}

export function severityField(): FieldBlueprint {
  return {
    field: DatabaseField.SEVERITY,
    label: 'Severity',
    inspectFormat: (val: Severity) => `${val}`,
    component: null,
  }
}

export function labelField(): FieldBlueprint {
  return {
    field: DatabaseField.LABEL,
    label: 'Label',
    inspectFormat: (val: string) => `${val}`,
    component: null,
  }
}

export function detailsField(): FieldBlueprint {
  return {
    field: DatabaseField.DETAILS,
    label: 'Details',
    inspectFormat: (val: AppObject) => JSON.stringify(val),
    component: null,
  }
}

export function nameField(): FieldBlueprint {
  return {
    field: DatabaseField.NAME,
    label: 'Name',
    inspectFormat: (val: string) => `${val}`,
    component: defineAsyncComponent(() => import('@/components/ActionInputName.vue')),
  }
}

export function descriptionField(): FieldBlueprint {
  return {
    field: DatabaseField.DESCRIPTION,
    label: 'Description',
    inspectFormat: (val: string) => `${val}`,
    component: defineAsyncComponent(() => import('@/components/ActionInputDescription.vue')),
  }
}

export function favoritedField(): FieldBlueprint {
  return {
    field: DatabaseField.IS_FAVORITED,
    label: 'Favorited',
    inspectFormat: (val: boolean) => (val ? 'Yes' : 'No'),
    component: defineAsyncComponent(() => import('@/components/ActionInputFavorited.vue')),
  }
}

export function enabledField(): FieldBlueprint {
  return {
    field: DatabaseField.IS_ENABLED,
    label: 'Enabled',
    inspectFormat: (val: boolean) => (val ? 'Yes' : 'No'),
    component: defineAsyncComponent(() => import('@/components/ActionInputEnabled.vue')),
  }
}

export function parentIdField(): FieldBlueprint {
  return {
    field: DatabaseField.PARENT_ID,
    label: 'Parent Id',
    inspectFormat: (val: string) => `${val}`,
    component: defineAsyncComponent(() => import('@/components/ActionInputParentId.vue')),
  }
}

export function noteField(): FieldBlueprint {
  return {
    field: DatabaseField.NOTE,
    label: 'Note',
    inspectFormat: (val: string) => `${val}`,
    component: defineAsyncComponent(() => import('@/components/ActionInputNote.vue')),
  }
}

export function numberField(): FieldBlueprint {
  return {
    field: DatabaseField.NUMBER,
    label: 'Number',
    inspectFormat: (val: number) => `${val}`,
    component: defineAsyncComponent(() => import('@/components/ActionInputNumber.vue')),
  }
}
