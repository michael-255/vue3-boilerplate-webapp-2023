import { DatabaseField, type DatabaseType } from '@/constants/database'
import type { Optional } from '@/constants/misc'
import { defineStore, type StoreDefinition } from 'pinia'

const useItemsStore: StoreDefinition = defineStore({
  id: 'items',

  state: () => ({
    currentTable: null as Optional<DatabaseType>,
    oldItem: Object.values(DatabaseField).reduce(
      (accumulateObject, field) => ({ ...accumulateObject, [field]: null as any }),
      {} as { [key in DatabaseField]: any }
    ),
    newItem: Object.values(DatabaseField).reduce(
      (accumulateObject, field) => ({ ...accumulateObject, [field]: null as any }),
      {} as { [key in DatabaseField]: any }
    ),
    validateItem: Object.values(DatabaseField).reduce(
      (accumulateObject, field) => ({ ...accumulateObject, [field]: null as Optional<boolean> }),
      {} as { [key in DatabaseField]: Optional<boolean> }
    ),
  }),

  getters: {
    areItemFieldsValid:
      (state: any) =>
      (fields: DatabaseField[]): boolean => {
        return fields.every((field: DatabaseField) => state.validateItem[field] === true)
      },
  },
})

export default useItemsStore
