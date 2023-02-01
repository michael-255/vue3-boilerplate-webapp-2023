import { defineStore } from 'pinia'
import { SettingKey } from '@/constants/globals'
import type { SettingValue } from '@/constants/types'

const useSettingsStore = defineStore({
  id: 'settings',

  state: () =>
    Object.values(SettingKey).reduce((o, key) => {
      return { ...o, [key]: null as SettingValue }
    }, {} as { [key in SettingKey]: SettingValue }),
})

export default useSettingsStore
