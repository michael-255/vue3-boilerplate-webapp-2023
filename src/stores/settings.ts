import { defineStore } from 'pinia'
import { SettingId } from '@/constants/database'

const useSettingsStore = defineStore({
  id: 'settings',

  state: () =>
    Object.values(SettingId).reduce((accumulateObject, key) => {
      // Create initial store object with each SettingId as a key with null as the initial value
      return { ...accumulateObject, [key]: null as any }
    }, {} as { [key in SettingId]: any }),
})

export default useSettingsStore
