import type { Subscription } from 'dexie'
import { type Ref, ref, computed, onUnmounted } from 'vue'
import {
  type ParentCardItem,
  type ParentTable,
  DatabaseField,
  SettingKey,
  DatabaseTable,
  parentTables,
  type ParentModel,
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

  // TODO -  Not actaully ParentModels, but card items... can't tell which though so may have to be any...
  const itemRefs: Ref<any[]>[] = parentTables.map(() => ref([]))

  // TODO
  const itemCardComponents: any[] = parentTables.map((table) => getParentCardComponents(table))

  // TODO
  const subs = parentTables.map((table, index) => {
    if (table === DatabaseTable.EXAMPLES) {
      liveQueryExamples(itemRefs[index])
    } else if (table === DatabaseTable.TESTS) {
      liveQueryTests(itemRefs[index])
    }
  })

  /**
   * Options for the parent table selection radio buttons.
   */
  const parentItemsOptions = parentTables.map((option: ParentTable) => ({
    label: option,
    value: option,
  }))

  /**
   * Object with item refs for each parent table.
   */
  const parentItemsRefs = {
    [DatabaseTable.EXAMPLES]: ref([]),
    [DatabaseTable.TESTS]: ref([]),
  } as { [key in ParentTable]: Ref<ParentModel[]> }

  /**
   * Object with live query subscriptions for each parent table.
   */
  const subscriptions = {
    [DatabaseTable.EXAMPLES]: liveQueryExamples(parentItemsRefs[DatabaseTable.EXAMPLES]),
    [DatabaseTable.TESTS]: liveQueryTests(parentItemsRefs[DatabaseTable.TESTS]),
  } as { [key in ParentTable]: Subscription }

  // TODO
  /**
   * Object with card component for each parent table.
   */
  const parentCardComponents = {
    [DatabaseTable.EXAMPLES]: getParentCardComponents(DatabaseTable.EXAMPLES),
    [DatabaseTable.TESTS]: getParentCardComponents(DatabaseTable.TESTS),
  } as { [key in ParentTable]: any }

  const parentItemsSelection = computed({
    get() {
      return settingsStore[SettingKey.PARENT_LIST_SELECTION]
    },
    async set(parentTable: ParentTable) {
      await setSetting(SettingKey.PARENT_LIST_SELECTION, parentTable)
    },
  })

  onUnmounted(() => {
    Object.values(subscriptions).forEach((subscription) => subscription.unsubscribe())
  })

  /**
   * Live queries the Example table and updates the provided ref with the sorted data items.
   * @param tableRef
   * @returns Subscription
   */
  function liveQueryExamples(tableRef: Ref<ParentModel[]>) {
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
              testMessage: 'Example Message',
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
        tableRef.value = combined as any[]

        consoleDebug('Retrieved Examples', combined)
      },
      error: (error) => {
        log.error('Failed to retrieve Examples', error)
      },
    })
  }

  /**
   * Live queries the Tests table and updates the provided ref with the sorted data items.
   * @param tableRef
   * @returns Subscription
   */
  function liveQueryTests(tableRef: Ref<ParentModel[]>) {
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
              testMessage: 'Test Message',
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
        tableRef.value = combined as any[]

        consoleDebug('Retrieved Tests', combined)
      },
      error: (error) => {
        log.error('Failed to retrieve Tests', error)
      },
    })
  }

  return {
    itemRefs,
    parentItemsRefs,
    parentItemsSelection,
    parentItemsOptions,
  }
}
