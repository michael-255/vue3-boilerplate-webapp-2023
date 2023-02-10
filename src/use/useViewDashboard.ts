import type { IDBExample, IDBExampleRecord } from '@/models/models'
import { SettingKey, ParentStatus, RecordStatus, TableName } from '@/constants/globals'
import { computed } from 'vue'
import { uid } from 'quasar'
import useDBCommon from '@/use/useDBCommon'
import useDBSettings from '@/use/useDBSettings'
import useSettingsStore from '@/stores/settings'
import useDBExamples from '@/use/useDBExamples'

export default function useViewDashboard() {
  const settingsStore = useSettingsStore()
  const { getTable } = useDBCommon()
  const { setSetting } = useDBSettings()
  const { addExample, addExampleRecord } = useDBExamples()

  const parentListSelection = computed({
    get() {
      return settingsStore[SettingKey.PARENT_LIST_SELECTION]
    },
    async set(str: string) {
      await setSetting(SettingKey.PARENT_LIST_SELECTION, str)
    },
  })

  const parentListOptions = [
    {
      label: TableName.EXAMPLES,
      value: TableName.EXAMPLES,
    },
  ]

  async function getExamples(): Promise<IDBExample[]> {
    return (await getTable(TableName.EXAMPLES)) as IDBExample[]
  }

  /**
   * Set the introduction setting value to false in settings to 'close' the introduction card.
   */
  async function onCloseIntroduction(): Promise<void> {
    await setSetting(SettingKey.SHOW_INTRODUCTION, false)
  }

  /**
   * For testing the database.
   */
  async function generateDemoData(): Promise<void> {
    for (let i = 0; i < 5; i++) {
      const example: IDBExample = {
        id: uid(),
        createdTimestamp: new Date().getTime(),
        parentStatus: ParentStatus.ENABLED,
        name: `Example ${i}`,
        description: `Example ${i} description goes here.`,
        favorite: i % 2 === 0 ? true : false,
        exampleMessage: 'Example Test Message',
      }
      const exampleRecord: IDBExampleRecord = {
        id: uid(),
        createdTimestamp: new Date().getTime(),
        recordStatus: RecordStatus.COMPLETED,
        parentId: example.id,
        note: 'Example Record Note',
        exampleNumber: i,
      }

      await addExample(example)
      await addExampleRecord(exampleRecord)
    }
  }

  return {
    parentListSelection,
    parentListOptions,
    getExamples,
    onCloseIntroduction,
    generateDemoData,
  }
}
