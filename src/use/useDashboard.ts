import { liveQuery } from 'dexie'
import type {
  ParentCardItem,
  ParentModel,
  ParentTable,
  RecordModel,
  RecordTable,
} from '@/constants/types'
import { type Ref, ref, computed, onUnmounted } from 'vue'
import { Field, SettingKey, TableName } from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import useDatabaseCommon from '@/use/useDatabaseCommon'
import useSettingsStore from '@/stores/settings'
import useLogger from '@/use/useLogger'
import TableUtils from '@/services/TableUtils'

export default function useDashboard() {
  const settingsStore = useSettingsStore()
  const { log, consoleDebug } = useLogger()
  const { setSetting } = useDatabaseCommon()

  /**
   * Get most recent previous record item by parent id.
   * @param tableName
   * @param parentId
   * @returns Record item or undefined
   */
  async function getPreviousRecord(
    recordTable: RecordTable,
    parentId: string
  ): Promise<RecordModel | undefined> {
    return (
      await dexieWrapper
        .table(recordTable)
        .where(Field.PARENT_ID)
        .equalsIgnoreCase(parentId)
        .sortBy(Field.CREATED_TIMESTAMP)
    ).reverse()[0]
  }

  /**
   * TODO
   * @param items
   * @param recordTable
   * @returns
   */
  async function getParentCardItems(items: ParentModel[], recordTable: RecordTable) {
    return Promise.all(
      items.map(async (item) => {
        const previousRecord = await getPreviousRecord(recordTable, item.id)
        const previousTimestamp = previousRecord?.[Field.CREATED_TIMESTAMP]
        const previousNumber = previousRecord?.[Field.EXAMPLE_NUMBER]

        return {
          id: item.id,
          name: item.name,
          favorite: item.favorite,
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
    return liveQuery(() => dexieWrapper.table(parentTable).orderBy(Field.NAME).toArray()).subscribe(
      {
        next: async (data: ParentModel[]) => {
          const parentCardItems: ParentCardItem[] = await getParentCardItems(
            data,
            TableUtils.getRecordTable(parentTable)
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
      }
    )
  }

  const examples: Ref<ParentCardItem[]> = ref([])
  const tests: Ref<ParentCardItem[]> = ref([])

  const examplesSubscription = liveQueryFavoritesSubscription(TableName.EXAMPLES, examples)
  const testsSubscription = liveQueryFavoritesSubscription(TableName.TESTS, tests)

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

  const parentItemsOptions = [
    {
      label: TableName.EXAMPLES,
      value: TableName.EXAMPLES,
    },
    {
      label: TableName.TESTS,
      value: TableName.TESTS,
    },
  ]

  return {
    examples,
    tests,
    parentItemsSelection,
    parentItemsOptions,
  }
}
