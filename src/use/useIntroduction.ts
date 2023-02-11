import { SettingKey } from '@/constants/globals'
import useDBSettings from '@/use/useDBSettings'

export default function useIntroduction() {
  const { setSetting } = useDBSettings()

  /**
   * Set the introduction setting value to false in settings to close the introduction card.
   */
  async function onCloseIntroduction(): Promise<void> {
    await setSetting(SettingKey.SHOW_INTRODUCTION, false)
  }

  return { onCloseIntroduction }
}
