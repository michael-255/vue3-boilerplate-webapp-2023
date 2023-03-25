import { dataBlueprints } from '@/services/data-blueprints'
import { DatabaseType } from '@/types/database'
import { Icon } from '@/types/icons'

export const parentTypes: readonly DatabaseType[] = [DatabaseType.EXAMPLE, DatabaseType.TEST]

export const childTypes: readonly DatabaseType[] = [
  DatabaseType.EXAMPLE_RESULT,
  DatabaseType.TEST_RESULT,
]

export function getSlug(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.typeSlug ?? ''
}

export function getTypeFromSlug(databaseTypeSlug: string) {
  return dataBlueprints.find((dbp) => dbp.typeSlug === databaseTypeSlug)?.type ?? null
}

export function getLabel(type: DatabaseType, style: 'singular' | 'plural') {
  if (style === 'singular') {
    return dataBlueprints.find((dbp) => dbp.type === type)?.singularLabel ?? ''
  } else {
    return dataBlueprints.find((dbp) => dbp.type === type)?.pluralLabel ?? ''
  }
}

export function getIcon(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.icon ?? Icon.ERROR
}

export function getParentType(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.parentType ?? null
}

export function getChildType(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.childType ?? null
}

export function getSupportedActions(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.supportedActions ?? []
}

export function getChartBlueprints(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.chartBluprints ?? []
}

export function getFieldBlueprints(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.fieldBlueprints ?? []
}

export function getFields(type: DatabaseType) {
  return (
    dataBlueprints.find((dbp) => dbp.type === type)?.fieldBlueprints.map((fbp) => fbp.field) ?? []
  )
}

export function getFieldComponents(type: DatabaseType) {
  return (
    dataBlueprints.find((dbp) => dbp.type === type)?.fieldBlueprints.map((fbp) => fbp.component) ??
    []
  )
}

export function getVisibleColumns(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.visibleColumns ?? []
}

export function getTableColumns(type: DatabaseType) {
  return dataBlueprints.find((dbp) => dbp.type === type)?.tableColumns ?? []
}
