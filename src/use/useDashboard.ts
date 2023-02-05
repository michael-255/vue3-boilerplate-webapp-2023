import { SettingKey } from '@/constants/globals'
import { computed } from 'vue'
import useDatabaseSettings from '@/use/useDatabaseSettings'
import useSettingsStore from '@/stores/settings'

export default function useDashboard() {
  const settingsStore = useSettingsStore()
  const { setSetting } = useDatabaseSettings()

  const primaryListSelection = computed({
    get() {
      return settingsStore[SettingKey.PRIMARY_LIST_SELECTION]
    },
    async set(str: string) {
      await setSetting(SettingKey.PRIMARY_LIST_SELECTION, str)
    },
  })

  /**
   * Set the introduction setting value to false in settings to 'close' the introduction card.
   */
  async function onCloseIntroduction(): Promise<void> {
    await setSetting(SettingKey.SHOW_INTRODUCTION, false)
  }

  return { primaryListSelection, onCloseIntroduction }
}
