import { defineStore } from 'pinia'
import { DatabaseField } from '@/types/database'
import type { Optional } from '@/types/misc'

const useActionRecordStore = defineStore({
  id: 'action-record',

  state: () => ({
    actionRecord: Object.values(DatabaseField).reduce(
      (acc, field) => ({ ...acc, [field]: null as any }),
      {} as { [key in DatabaseField]: any }
    ),
    valid: Object.values(DatabaseField).reduce(
      (acc, field) => ({ ...acc, [field]: null as Optional<boolean> }),
      {} as { [key in DatabaseField]: Optional<boolean> }
    ),
  }),

  getters: {
    areRecordFieldsValid:
      (state: any) =>
      (fields: DatabaseField[]): boolean => {
        return fields.every((field: DatabaseField) => state.valid[field] === true)
      },
  },
})

export default useActionRecordStore
