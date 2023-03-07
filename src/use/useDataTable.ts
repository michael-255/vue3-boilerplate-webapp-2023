import {
  DatabaseTable,
  Icon,
  DatabaseField,
  type ColumnProps,
  SettingKey,
} from '@/constants/globals'
import { onMounted, ref, type Ref, onUnmounted } from 'vue'
import {
  getTableFromSlug,
  getTableColumnProps,
  getVisibleColumns,
  getFields,
} from '@/services/DatabaseUtils'
import { useRoute } from 'vue-router'
import type { Subscription } from 'dexie'
import useSettingsStore from '@/stores/settings'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useLogger from '@/use/useLogger'
import useDatabase from '@/use/useDatabase'

export default function useDataTable() {
  const route = useRoute()
  const settingsStore = useSettingsStore()
  const { log, consoleDebug } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const { liveQueryDataTable, deleteItem } = useDatabase()

  const routeTable = getTableFromSlug(route?.params?.tableSlug as string)
  const subscriptions: Ref<Subscription[]> = ref([])
  const rows: Ref<any[]> = ref([])
  const columns: Ref<any[]> = ref([])
  const columnOptions: Ref<ColumnProps[]> = ref([])
  const visibleColumns: Ref<string[]> = ref([])
  const searchFilter: Ref<string> = ref('')

  onMounted(async () => {
    try {
      if (Object.values(DatabaseTable).includes(routeTable)) {
        // Setup subscription and load data
        subscriptions.value.push(
          liveQueryDataTable(routeTable).subscribe({
            next: (items: any[]) => {
              rows.value = items
              consoleDebug(`Retrieved ${routeTable}`, items)
            },
            error: (error) => {
              log.error(`Failed to retrieve ${routeTable}`, error)
            },
          })
        )
        // Load column props for table
        columns.value = getTableColumnProps(routeTable)
      } else {
        // Table is invalid
        rows.value = []
        columns.value = []
        log.error('Invalid table', { tableSlug: route?.params?.tableSlug })
      }
    } catch (error) {
      log.error('Failed to retrieve table data', error)
    }

    // Load visible columns
    try {
      consoleDebug('Loading visible columns')
      // This sets up the options for the column selector while removing ID and required columns
      columnOptions.value = columns.value.filter(
        (col: ColumnProps) => !col.required && col.name !== DatabaseField.ID
      )

      // This sets up what is currently visible on the data table
      if (settingsStore[SettingKey.SHOW_ALL_DATA_COLUMNS]) {
        // All columns
        const a = getFields(routeTable)
        consoleDebug('All columns', a)
        visibleColumns.value = a
      } else {
        // Default columns
        const b = getVisibleColumns(routeTable)
        consoleDebug('Default columns', b)
        visibleColumns.value = b
      }
    } catch (error) {
      log.error('Failed to retrieve visible columns', error)
    }
  })

  onUnmounted(() => {
    subscriptions.value?.map((sub) => sub.unsubscribe())
  })

  /**
   * Gets the text for the number of items found for the current table.
   * @returns Items found text
   */
  function getTableItemsCountText() {
    const count = rows?.value?.length || 0

    if (count === 1) {
      return '1 item found'
    } else {
      return `${count} items found`
    }
  }

  async function onDelete(id: string): Promise<void> {
    confirmDialog(
      'Delete Item',
      `Permanently delete "${id}" from ${routeTable}?`,
      Icon.DELETE,
      'negative',
      async () => {
        try {
          await deleteItem(routeTable, id)
          log.info('Item successfully deleted', { id, table: routeTable })
        } catch (error) {
          log.error(`Error deleting item from ${routeTable}`, error)
        }
      }
    )
  }

  return {
    routeTable,
    rows,
    columns,
    columnOptions,
    visibleColumns,
    searchFilter,
    getTableItemsCountText,
    onDelete,
  }
}
