import { defineStore } from 'pinia'
import { DatabaseField } from '@/types/database'
import type { Optional } from '@/types/misc'

const useActionStore = defineStore({
  id: 'action',

  state: () => ({
    /**
     * Used as the WIP record for creates and updates.
     */
    record: Object.values(DatabaseField).reduce((acc, field) => {
      acc[field] = null as any
      return acc
    }, {} as { [key in DatabaseField]: any }),
    /**
     * Used to track the validity of the action record fields.
     */
    valid: Object.values(DatabaseField).reduce((acc, field) => {
      acc[field] = null as Optional<boolean>
      return acc
    }, {} as { [key in DatabaseField]: Optional<boolean> }),
  }),

  getters: {
    /**
     * Checks if all passed in fields are valid.
     * @param fields
     */
    areRecordFieldsValid:
      (state: any) =>
      (fields: DatabaseField[]): boolean => {
        return fields.every((field: DatabaseField) => state.valid[field] === true)
      },
  },
})

export default useActionStore
