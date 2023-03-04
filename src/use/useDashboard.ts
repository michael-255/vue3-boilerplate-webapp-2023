import type { Subscription } from 'dexie'
import { type Ref, ref, computed, onUnmounted } from 'vue'
import {
  type ParentCardItem,
  type ParentTable,
  DatabaseField,
  SettingKey,
  DatabaseTable,
  parentTables,
} from '@/constants/globals'
import useDatabase from '@/use/useDatabase'
import useSettingsStore from '@/stores/settings'
import useLogger from '@/use/useLogger'
import type { Example, Test } from '@/models/models'
import { getParentCardComponents } from '@/services/DatabaseUtils'

export default function useDashboard() {
  const settingsStore = useSettingsStore()
  const { log, consoleDebug } = useLogger()
  const { setSetting, getPreviousRecord, liveQueryDashboard } = useDatabase()

  /**
   * Options for the parent table radio buttons.
   */
  const parentListOptions = parentTables.map((option: ParentTable) => ({
    label: option,
    value: option,
  }))

  /**
   * Item refs for each parent table.
   */
  const itemRefs = {
    [DatabaseTable.EXAMPLES]: ref([]),
    [DatabaseTable.TESTS]: ref([]),
  } as { [key in ParentTable]: Ref<ParentCardItem[]> }

  /**
   * Item card component for each parent table.
   */
  const itemComponents = {
    [DatabaseTable.EXAMPLES]: getParentCardComponents(DatabaseTable.EXAMPLES),
    [DatabaseTable.TESTS]: getParentCardComponents(DatabaseTable.TESTS),
  } as { [key in ParentTable]: any }

  /**
   * Live query subscriptions for each parent table.
   */
  const subscriptions = {
    [DatabaseTable.EXAMPLES]: examplesSubscription(itemRefs[DatabaseTable.EXAMPLES]),
    [DatabaseTable.TESTS]: testsSubscription(itemRefs[DatabaseTable.TESTS]),
  } as { [key in ParentTable]: Subscription }

  /**
   * Settings control for the parent table selection.
   */
  const parentListSelection = computed({
    get() {
      return settingsStore[SettingKey.PARENT_LIST_SELECTION]
    },
    async set(parentTable: ParentTable) {
      await setSetting(SettingKey.PARENT_LIST_SELECTION, parentTable)
    },
  })

  onUnmounted(() => {
    Object.values(subscriptions).forEach((subscription) => subscription?.unsubscribe())
  })

  /**
   * Gets the text for the number of items found for the current parent table.
   * @returns Items found text
   */
  function getDashboardItemsCountText() {
    const count = itemRefs?.[parentListSelection.value]?.value?.length || 0

    if (count === 1) {
      return '1 item found'
    } else {
      return `${count} items found`
    }
  }

  /**
   * Examples table subscription that live updates the sorted data items.
   * @param itemsRef
   * @returns Subscription
   */
  function examplesSubscription(itemsRef: Ref<ParentCardItem[]>) {
    return liveQueryDashboard(DatabaseTable.EXAMPLES).subscribe({
      next: async (items: Example[]) => {
        const parentCardItems: ParentCardItem[] = await Promise.all(
          items.map(async (item) => {
            const previousRecord = await getPreviousRecord(
              DatabaseTable.EXAMPLE_RECORDS,
              item[DatabaseField.ID]
            )
            const previousTimestamp = previousRecord?.[DatabaseField.CREATED_TIMESTAMP]
            const previousNumber = previousRecord?.[DatabaseField.EXAMPLE_NUMBER]

            return {
              table: DatabaseTable.EXAMPLES,
              [DatabaseField.ID]: item[DatabaseField.ID],
              [DatabaseField.NAME]: item[DatabaseField.NAME],
              [DatabaseField.FAVORITE]: item[DatabaseField.FAVORITE],
              previousTimestamp,
              previousNumber,
            } as ParentCardItem
          })
        )

        const favorites = parentCardItems.filter((item) => item.favorite)
        const nonFavorites = parentCardItems.filter((item) => !item.favorite)
        const combined = [...favorites, ...nonFavorites]
        itemsRef.value = combined as ParentCardItem[]

        consoleDebug('Retrieved Examples', combined)
      },
      error: (error) => {
        log.error('Failed to retrieve Examples', error)
      },
    })
  }

  /**
   * Tests table subscription that live updates the sorted data items.
   * @param itemsRef
   * @returns Subscription
   */
  function testsSubscription(itemsRef: Ref<ParentCardItem[]>) {
    return liveQueryDashboard(DatabaseTable.TESTS).subscribe({
      next: async (items: Test[]) => {
        const parentCardItems: ParentCardItem[] = await Promise.all(
          items.map(async (item) => {
            const previousRecord = await getPreviousRecord(
              DatabaseTable.TEST_RECORDS,
              item[DatabaseField.ID]
            )
            const previousTimestamp = previousRecord?.[DatabaseField.CREATED_TIMESTAMP]
            const previousNumber = previousRecord?.[DatabaseField.EXAMPLE_NUMBER]

            return {
              table: DatabaseTable.TESTS,
              [DatabaseField.ID]: item[DatabaseField.ID],
              [DatabaseField.NAME]: item[DatabaseField.NAME],
              [DatabaseField.FAVORITE]: item[DatabaseField.FAVORITE],
              previousTimestamp,
              previousNumber,
            } as ParentCardItem
          })
        )

        const favorites = parentCardItems.filter((item) => item.favorite)
        const nonFavorites = parentCardItems.filter((item) => !item.favorite)
        const combined = [...favorites, ...nonFavorites]
        itemsRef.value = combined as ParentCardItem[]

        consoleDebug('Retrieved Tests', combined)
      },
      error: (error) => {
        log.error('Failed to retrieve Tests', error)
      },
    })
  }

  return {
    itemRefs,
    itemComponents,
    parentListSelection,
    parentListOptions,
    getDashboardItemsCountText,
  }
}
