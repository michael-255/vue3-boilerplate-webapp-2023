import { defineStore } from 'pinia'

const useUIStore = defineStore({
  id: 'ui',

  state: () => ({
    drawer: false,
  }),
})

export default useUIStore
