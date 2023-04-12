import { DatabaseType } from '@/types/database'
import { coreBlueprint } from '@/services/blueprints/core-blueprint'

/*
TODO
- You need to expain what the data utils are for.
- Document every function in this file.
*/

export const allDatabaseTypes: readonly DatabaseType[] = [
  DatabaseType.LOG,
  DatabaseType.SETTING,
  DatabaseType.EXAMPLE,
  DatabaseType.EXAMPLE_RESULT,
  DatabaseType.TEST,
  DatabaseType.TEST_RESULT,
]

export const coreDatabaseTypes: readonly DatabaseType[] = [DatabaseType.LOG, DatabaseType.SETTING]

export const parentDatabaseTypes: readonly DatabaseType[] = [
  DatabaseType.EXAMPLE,
  DatabaseType.TEST,
]

export const childDatabaseTypes: readonly DatabaseType[] = [
  DatabaseType.EXAMPLE_RESULT,
  DatabaseType.TEST_RESULT,
]

export function getSlug(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.typeSlug
}

export function getTypeFromSlug(databaseTypeSlug: string) {
  return coreBlueprint.find((cbp) => cbp.typeSlug === databaseTypeSlug)?.type
}

export function getLabel(type: DatabaseType, style: 'singular' | 'plural') {
  if (style === 'singular') {
    return coreBlueprint.find((cbp) => cbp.type === type)?.singularLabel
  } else {
    return coreBlueprint.find((cbp) => cbp.type === type)?.pluralLabel
  }
}

export function getIcon(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.icon
}

export function getParentType(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.parentType
}

export function getChildType(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.childType
}

export function getSupportedActions(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.supportedActions ?? []
}

export function getChartBlueprints(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.chartBluprints ?? []
}

export function getFieldBlueprints(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.fieldBlueprints ?? []
}

export function getFields(type: DatabaseType) {
  return (
    coreBlueprint.find((cbp) => cbp.type === type)?.fieldBlueprints.map((fbp) => fbp.field) ?? []
  )
}

export function getFieldComponents(type: DatabaseType) {
  return (
    coreBlueprint.find((cbp) => cbp.type === type)?.fieldBlueprints.map((fbp) => fbp.component) ??
    []
  )
}

export function getVisibleColumns(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.visibleColumns ?? []
}

export function getTableColumns(type: DatabaseType) {
  return coreBlueprint.find((cbp) => cbp.type === type)?.tableColumns ?? []
}
