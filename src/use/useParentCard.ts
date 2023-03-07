import { type ParentTable, Icon, DatabaseTable } from '@/constants/globals'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDatabase from '@/use/useDatabase'

export default function useParentCard() {
  const { log } = useLogger()
  const { confirmDialog, dismissDialog } = useSimpleDialogs()
  const { updateItem, deleteItem } = useDatabase()

  /**
   * TODO
   * @param note
   */
  async function viewPreviousNote(note: string) {
    dismissDialog('Previous Note', note, Icon.NOTE, 'info')
  }

  /**
   * TODO
   * @param parentTable
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
   * @param parentTable
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
   * @param table
   * @param id
   */
  async function onDelete(table: DatabaseTable, id: string): Promise<void> {
    confirmDialog(
      'Delete',
      `Permanently delete item ${id} from ${table}?`,
      Icon.DELETE,
      'negative',
      async () => {
        try {
          await deleteItem(table, id)
          log.info('Successfully deleted item', { deletedItemTable: table, deletedItemid: id })
        } catch (error) {
          log.error('Delete failed', error)
        }
      }
    )
  }

  return {
    viewPreviousNote,
    onFavorite,
    onUnfavorite,
    onDelete,
  }
}
