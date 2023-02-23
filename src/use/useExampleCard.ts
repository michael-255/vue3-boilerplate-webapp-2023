import { type RecordTable, Icon } from '@/constants/globals'
import { ref, type Ref } from 'vue'
import { getParentTable } from '@/services/DatabaseUtils'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDatabase from '@/use/useDatabase'

export default function useExampleCard() {
  const { log } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const { forceLiveQueryUpdate, addExampleRecord } = useDatabase()

  const exampleNumberModel: Ref<number | undefined> = ref(undefined)

  /**
   * TODO
   * @param recordTable
   * @param parentId
   * @param exampleNumber
   */
  async function onSaveRecord(recordTable: RecordTable, parentId: string, exampleNumber?: number) {
    confirmDialog(
      'Save New Record',
      `Save record with example number of ${exampleNumber}?`,
      Icon.SAVE,
      'positive',
      async () => {
        try {
          const id = await addExampleRecord(parentId, exampleNumber)
          await forceLiveQueryUpdate(getParentTable(recordTable), parentId)
          exampleNumberModel.value = undefined
          log.info('Successfully saved record', { table: recordTable, newItemId: id })
        } catch (error) {
          log.error('Save failed', error)
        }
      }
    )
  }

  return { exampleNumberModel, onSaveRecord }
}
