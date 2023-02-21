import { SettingKey } from '@/constants/globals'
import useDatabase from '@/use/useDatabase'

export default function useIntroductionCard() {
  const { setSetting } = useDatabase()

  /**
   * Set the introduction setting value to false in settings to close the introduction card.
   */
  async function onCloseIntroduction(): Promise<void> {
    await setSetting(SettingKey.SHOW_INTRODUCTION, false)
  }

  return { onCloseIntroduction }
}
