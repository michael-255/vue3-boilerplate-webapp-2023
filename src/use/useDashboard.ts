import { SettingKey, ParentStatus, RecordStatus } from '@/constants/globals'
import { computed } from 'vue'
import type { IDBExample, IDBExampleRecord, IDBTest, IDBTestRecord } from '@/models/app'
import { uid } from 'quasar'
import useDatabaseSettings from '@/use/useDatabaseSettings'
import useSettingsStore from '@/stores/settings'
import useDatabaseExamplesAndTests from './useDatabaseExamplesAndTests'

export default function useDashboard() {
  const settingsStore = useSettingsStore()
  const { setSetting } = useDatabaseSettings()
  const { addExample, addExampleRecord, addTest, addTestRecord } = useDatabaseExamplesAndTests()

  const parentListSelection = computed({
    get() {
      return settingsStore[SettingKey.PARENT_LIST_SELECTION]
    },
    async set(str: string) {
      await setSetting(SettingKey.PARENT_LIST_SELECTION, str)
    },
  })

  /**
   * Set the introduction setting value to false in settings to 'close' the introduction card.
   */
  async function onCloseIntroduction(): Promise<void> {
    await setSetting(SettingKey.SHOW_INTRODUCTION, false)
  }

  /**
   * For testing the database.
   */
  async function generateData(): Promise<void> {
    for (let i = 0; i < 5; i++) {
      const example: IDBExample = {
        id: uid(),
        createdTimestamp: new Date().getTime(),
        parentStatus: ParentStatus.ENABLED,
        name: `Example ${i}`,
        description: `Example ${i} description goes here.`,
        favorite: i % 2 === 0 ? true : false,
        testMessage: 'Example Test Message',
      }
      const exampleRecord: IDBExampleRecord = {
        id: uid(),
        createdTimestamp: new Date().getTime(),
        recordStatus: RecordStatus.COMPLETED,
        parentId: example.id,
        note: 'Example Record Note',
        testNumber: i,
      }
      const test: IDBTest = {
        id: uid(),
        createdTimestamp: new Date().getTime(),
        parentStatus: ParentStatus.ENABLED,
        name: `Example ${i}`,
        description: `Example ${i} description goes here.`,
        favorite: i % 2 === 0 ? true : false,
        testMessage: 'Example Test Message',
      }
      const testRecord: IDBTestRecord = {
        id: uid(),
        createdTimestamp: new Date().getTime(),
        recordStatus: RecordStatus.COMPLETED,
        parentId: test.id,
        note: 'Example Record Note',
        testNumber: i,
      }
      await addExample(example)
      await addExampleRecord(exampleRecord)
      await addTest(test)
      await addTestRecord(testRecord)
    }
  }

  return { parentListSelection, onCloseIntroduction, generateData }
}
