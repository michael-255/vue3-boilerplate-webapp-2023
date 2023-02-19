import type { ParentTable } from '@/constants/types'
import { Icon, TableName } from '@/constants/globals'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDatabaseCommon from '@/use/useDatabaseCommon'

export default function useParentCard() {
  const { log } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const { updateItem, deleteItem } = useDatabaseCommon()

  /**
   * TODO
   * @param tableName
   * @param id
   * @param favorite
   */
  async function onFavoriteToggle(parentTable: ParentTable, id: string, favorite: boolean) {
    try {
      await updateItem(parentTable, id, { favorite: !favorite })
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
          log.info('Successfully deleted item')
        } catch (error) {
          log.error('Delete failed', error)
        }
      }
    )
  }

  return {
    onFavoriteToggle,
    onDelete,
  }
}
