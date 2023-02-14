import type { Example, Test } from '@/models/models'
import { SettingKey, TableName } from '@/constants/globals'
import { computed } from 'vue'
import useDBCommon from '@/use/useDBCommon'
import useDBSettings from '@/use/useDBSettings'
import useSettingsStore from '@/stores/settings'

export default function useViewDashboard() {
  const settingsStore = useSettingsStore()
  const { getTable } = useDBCommon()
  const { setSetting } = useDBSettings()

  const parentItemsSelection = computed({
    get() {
      return settingsStore[SettingKey.PARENT_LIST_SELECTION]
    },
    async set(str: string) {
      await setSetting(SettingKey.PARENT_LIST_SELECTION, str)
    },
  })

  const parentItemsOptions = [
    {
      label: TableName.EXAMPLES,
      value: TableName.EXAMPLES,
    },
    {
      label: TableName.TESTS,
      value: TableName.TESTS,
    },
  ]

  async function getExamples(): Promise<Example[]> {
    return (await getTable(TableName.EXAMPLES)) as Example[]
  }

  async function getTests(): Promise<Test[]> {
    return (await getTable(TableName.TESTS)) as Test[]
  }

  return {
    parentItemsSelection,
    parentItemsOptions,
    getExamples,
    getTests,
  }
}
