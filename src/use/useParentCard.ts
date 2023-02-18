import { Field, Icon, TableName } from '@/constants/globals'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDatabaseCommon from '@/use/useDatabaseCommon'
import { dexieWrapper } from '@/services/DexieWrapper'
import { onMounted, ref, type Ref } from 'vue'
import TableHelper from '@/services/TableHelper'

export default function useParentCard(tableName: TableName, id: string) {
  const { log, consoleDebug } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const { updateItem, deleteItem } = useDatabaseCommon()

  /**
   * Get most recent previous record created timestamp by parent id.
   * @param tableName
   * @param parentId
   * @returns Number or undefined
   */
  async function getPreviousRecordTimestamp(
    tableName: TableName,
    parentId: string
  ): Promise<number | undefined> {
    return (
      await dexieWrapper
        .table(tableName)
        .where(Field.PARENT_ID)
        .equalsIgnoreCase(parentId)
        .sortBy(Field.CREATED_TIMESTAMP)
    ).reverse()[0]?.[Field.CREATED_TIMESTAMP]
  }

  const previousRecordTimestamp: Ref<number | undefined> = ref(undefined)
  const previousRecordDate: Ref<string> = ref('')

  onMounted(async () => {
    const recordTable = TableHelper.getRecordTable(tableName) as TableName
    const timestamp = (await getPreviousRecordTimestamp(recordTable, id)) as number
    consoleDebug('TEST', {
      recordTable,
      timestamp,
    })
    previousRecordTimestamp.value = timestamp
    previousRecordDate.value = new Date(timestamp).toString()
  })

  /**
   * TODO
   * @param tableName
   * @param id
   * @param favorite
   */
  async function onFavoriteToggle(tableName: TableName, id: string, favorite: boolean) {
    try {
      await updateItem(tableName, id, { favorite: !favorite })
      log.info('Favorites updated')
    } catch (error) {
      log.error('Favorites update failed', error)
    }
  }

  /**
   * TODO
   * @param tableName
   * @param id
   */
  async function onDelete(tableName: TableName, id: string): Promise<void> {
    confirmDialog(
      'Delete',
      `Permanently delete item ${id} from ${tableName}?`,
      Icon.DELETE,
      'negative',
      async () => {
        try {
          await deleteItem(tableName, id)
          log.info(`Successfully deleted item ${id}`)
        } catch (error) {
          log.error('Delete failed', error)
        }
      }
    )
  }

  return {
    previousRecordTimestamp,
    previousRecordDate,
    onFavoriteToggle,
    onDelete,
  }
}
