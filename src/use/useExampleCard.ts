import { Icon } from '@/constants/globals'
import type { RecordTable } from '@/constants/types'
import { ref, type Ref } from 'vue'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import TableUtils from '@/services/TableUtils'
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
          await addExampleRecord(parentId, exampleNumber)
          await forceLiveQueryUpdate(TableUtils.getParentTable(recordTable), parentId)
          exampleNumberModel.value = undefined
          log.info('Successfully saved record')
        } catch (error) {
          log.error('Save failed', error)
        }
      }
    )
  }

  return { exampleNumberModel, onSaveRecord }
}
