import { SettingKey } from '@/constants/globals'
import useDatabaseCommon from '@/use/useDatabaseCommon'

export default function useIntroduction() {
  const { setSetting } = useDatabaseCommon()

  /**
   * Set the introduction setting value to false in settings to close the introduction card.
   */
  async function onCloseIntroduction(): Promise<void> {
    await setSetting(SettingKey.SHOW_INTRODUCTION, false)
  }

  return { onCloseIntroduction }
}
