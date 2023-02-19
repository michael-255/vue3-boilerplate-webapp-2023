import { Field, Icon, RecordStatus } from '@/constants/globals'
import type { RecordTable } from '@/constants/types'
import { dexieWrapper } from '@/services/DexieWrapper'
import { ref } from 'vue'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import { uid } from 'quasar'

export default function useExampleCard() {
  const { log } = useLogger()
  const { confirmDialog } = useSimpleDialogs()

  const exampleNumberModel = ref(undefined)

  /**
   * TODO
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
            [Field.PARENT_ID]: parentId,
            [Field.RECORD_STATUS]: RecordStatus.COMPLETED,
            [Field.NOTE]: '',
            [Field.EXAMPLE_NUMBER]: exampleNumber || 0,
          })
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
