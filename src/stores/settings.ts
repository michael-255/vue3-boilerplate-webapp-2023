import { defineStore } from 'pinia'
import { type SettingValue, SettingKey } from '@/constants/globals'

const useSettingsStore = defineStore({
  id: 'settings',

  state: () =>
    Object.values(SettingKey).reduce((accumulateObject, key) => {
      // Create initial store object with each SettingKey as a key and null as the value
      return { ...accumulateObject, [key]: null as SettingValue }
    }, {} as { [key in SettingKey]: SettingValue }),
})

export default useSettingsStore
