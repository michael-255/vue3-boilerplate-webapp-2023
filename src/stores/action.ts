import { defineStore } from 'pinia'
import { DatabaseField } from '@/types/database'
import { FieldDefault } from '@/services/Defaults'

const useActionStore = defineStore({
  id: 'action',

  state: () => ({
    /**
     * Used as the WIP record for creates and updates.
     */
    record: Object.values(DatabaseField).reduce((acc, field) => {
      acc[field] = FieldDefault[field]() as any // function call for default value
      return acc
    }, {} as { [key in DatabaseField]: any }),
  }),
})

export default useActionStore
