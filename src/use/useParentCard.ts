import type { ParentTable } from '@/constants/types'
import { Icon, TableName } from '@/constants/globals'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDatabase from '@/use/useDatabase'

export default function useParentCard() {
  const { log } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const { updateItem, deleteItem } = useDatabase()

  /**
   * TODO
   * @param tableName
   * @param id
   * @param name
   */
  async function onFavorite(parentTable: ParentTable, id: string, name: string) {
    confirmDialog(
      'Favorite',
      `Do you want to favorite ${name}?`,
      Icon.FAVORITE_ON,
      'info',
      async () => {
        try {
          await updateItem(parentTable, id, { favorite: true })
          log.info(`${name} favorited`, { favoritedItemTable: parentTable, favoritedItemid: id })
        } catch (error) {
          log.error('Favorite update failed', error)
        }
      }
    )
  }

  /**
   * TODO
   * @param tableName
   * @param id
   * @param name
   */
  async function onUnfavorite(parentTable: ParentTable, id: string, name: string) {
    confirmDialog(
      'Unfavorite',
      `Do you want to unfavorite ${name}?`,
      Icon.FAVORITE_OFF,
      'info',
      async () => {
        try {
          await updateItem(parentTable, id, { favorite: false })
          log.info(`${name} unfavorited`, {
            unfavoritedItemTable: parentTable,
            unfavoritedItemid: id,
          })
        } catch (error) {
          log.error('Unfavorite update failed', error)
        }
      }
    )
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
          log.info('Successfully deleted item', { deletedItemTable: tableName, deletedItemid: id })
        } catch (error) {
          log.error('Delete failed', error)
        }
      }
    )
  }

  return {
    onFavorite,
    onUnfavorite,
    onDelete,
  }
}
