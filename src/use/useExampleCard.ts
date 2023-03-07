import { type RecordTable, Icon } from '@/constants/globals'
import { ref, type Ref, onUpdated } from 'vue'
import { getLabelSingular, getParentTable } from '@/services/DatabaseUtils'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDatabase from '@/use/useDatabase'

export default function useExampleCard() {
  const { log } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const { forceLiveQueryUpdate, addExampleRecord } = useDatabase()

  const recordNoteModel: Ref<string> = ref('')
  const exampleNumberModel: Ref<number | undefined> = ref(undefined)

  onUpdated(() => {
    exampleNumberModel.value = undefined
  })

  /**
   * TODO
   * @param recordTable
   * @param parentId
   * @param exampleNumber
   */
  async function onSaveExampleRecord(
    recordTable: RecordTable,
    parentId: string,
    recordNote?: string,
    exampleNumber?: number
  ) {
    confirmDialog(
      'Save New Record',
      `Save ${getLabelSingular(recordTable)} with example number of ${exampleNumber}?`,
      Icon.SAVE,
      'positive',
      async () => {
        try {
          const id = await addExampleRecord(parentId, recordNote, exampleNumber)
          await forceLiveQueryUpdate(getParentTable(recordTable), parentId)
          recordNoteModel.value = ''
          exampleNumberModel.value = undefined
          log.info('Successfully saved record', { table: recordTable, newItemId: id })
        } catch (error) {
          log.error('Save failed', error)
        }
      }
    )
  }

  return { recordNoteModel, exampleNumberModel, onSaveExampleRecord }
}
