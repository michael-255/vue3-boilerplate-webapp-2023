import { liveQuery } from 'dexie'
import { type Ref, ref, computed, onUnmounted } from 'vue'
import {
  type ParentCardItem,
  type ParentModel,
  type ParentTable,
  type RecordTable,
  DatabaseField,
  SettingKey,
  DatabaseTable,
  ParentStatus,
  parentTables,
} from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import { getRecordTable } from '@/services/DatabaseUtils'
import useDatabase from '@/use/useDatabase'
import useSettingsStore from '@/stores/settings'
import useLogger from '@/use/useLogger'

export default function useDashboard() {
  const settingsStore = useSettingsStore()
  const { log, consoleDebug } = useLogger()
  const { setSetting, getPreviousRecord } = useDatabase()

  const examples: Ref<ParentCardItem[]> = ref([])
  const tests: Ref<ParentCardItem[]> = ref([])

  const examplesSubscription = liveQueryFavoritesSubscription(DatabaseTable.EXAMPLES, examples)
  const testsSubscription = liveQueryFavoritesSubscription(DatabaseTable.TESTS, tests)

  const parentItemsOptions = parentTables.map((option) => ({
    label: option,
    value: option,
  }))

  onUnmounted(() => {
    examplesSubscription.unsubscribe()
    testsSubscription.unsubscribe()
  })

  const parentItemsSelection = computed({
    get() {
      return settingsStore[SettingKey.PARENT_LIST_SELECTION]
    },
    async set(str: string) {
      await setSetting(SettingKey.PARENT_LIST_SELECTION, str)
    },
  })

  /**
   * Builds the Parent cards for the Dashboard using the parent and previous record data.
   * @param items
   * @param recordTable
   * @returns Parent card items
   */
  async function getParentCardItems(items: ParentModel[], recordTable: RecordTable) {
    return Promise.all(
      items.map(async (item) => {
        const previousRecord = await getPreviousRecord(recordTable, item[DatabaseField.ID])
        const previousTimestamp = previousRecord?.[DatabaseField.CREATED_TIMESTAMP]
        const previousNumber = previousRecord?.[DatabaseField.EXAMPLE_NUMBER]

        return {
          [DatabaseField.ID]: item[DatabaseField.ID],
          [DatabaseField.NAME]: item[DatabaseField.NAME],
          [DatabaseField.FAVORITE]: item[DatabaseField.FAVORITE],
          previousTimestamp,
          previousNumber,
        } as ParentCardItem
      })
    )
  }

  /**
   * Live queries the table and updates the provided ref with the data as sorted parent card items.
   * @param parentTable
   * @param resultsRef
   * @returns Subscription
   */
  function liveQueryFavoritesSubscription(
    parentTable: ParentTable,
    resultsRef: Ref<ParentCardItem[]>
  ) {
    // Do NOT extract this Dexie function into useDatabase. It will break the live query.
    return liveQuery(() =>
      dexieWrapper
        .table(parentTable)
        .orderBy(DatabaseField.NAME)
        .filter((item) => item[DatabaseField.PARENT_STATUS] === ParentStatus.ENABLED)
        .toArray()
    ).subscribe({
      next: async (data: ParentModel[]) => {
        const parentCardItems: ParentCardItem[] = await getParentCardItems(
          data,
          getRecordTable(parentTable)
        )

        const favorites = parentCardItems.filter((item) => item.favorite)
        const nonFavorites = parentCardItems.filter((item) => !item.favorite)
        const combined = [...favorites, ...nonFavorites]
        resultsRef.value = combined as ParentCardItem[]

        consoleDebug(`Retrieved ${parentTable}`, combined)
      },
      error: (error) => {
        log.error(`Failed to retrieve ${parentTable}`, error)
      },
    })
  }

  return {
    examples,
    tests,
    parentItemsSelection,
    parentItemsOptions,
  }
}
