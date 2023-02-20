import { Field, Icon, RecordStatus } from '@/constants/globals'
import type { RecordTable, ParentTable } from '@/constants/types'
import { dexieWrapper } from '@/services/DexieWrapper'
import { ref } from 'vue'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import { uid } from 'quasar'
import TableUtils from '@/services/TableUtils'

export default function useExampleCard() {
  const { log } = useLogger()
  const { confirmDialog } = useSimpleDialogs()

  const exampleNumberModel = ref(undefined)

  /**
   * TODO
   * @param parentTable
   * @param id
   */
  async function forceLiveQueryUpdate(parentTable: ParentTable, id: string) {
    try {
      const now = new Date().getTime()
      await dexieWrapper.table(parentTable).update(id, { [Field.UPDATED_TIMESTAMP]: now })
    } catch (error) {
      log.error('Failed to force live query update', error)
    }
  }

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
          await dexieWrapper.table(recordTable).add({
            [Field.ID]: uid(),
            [Field.CREATED_TIMESTAMP]: new Date().getTime(),
            [Field.UPDATED_TIMESTAMP]: new Date().getTime(),
            [Field.PARENT_ID]: parentId,
            [Field.RECORD_STATUS]: RecordStatus.COMPLETED,
            [Field.NOTE]: '',
            [Field.EXAMPLE_NUMBER]: exampleNumber || 0,
          })
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
