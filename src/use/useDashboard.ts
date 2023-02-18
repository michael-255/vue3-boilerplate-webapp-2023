import { liveQuery } from 'dexie'
import type { Example, Test } from '@/models/models'
import type { AnyModel } from '@/constants/types'
import { type Ref, ref, computed, onUnmounted } from 'vue'
import { Field, SettingKey, TableName } from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import useDatabaseCommon from '@/use/useDatabaseCommon'
import useSettingsStore from '@/stores/settings'
import useLogger from '@/use/useLogger'

export default function useDashboard() {
  const settingsStore = useSettingsStore()
  const { log, consoleDebug } = useLogger()
  const { setSetting } = useDatabaseCommon()

  /**
   * Live queries the table and updates the provided ref with the data sorted by name and favorite status.
   * @param tableName
   * @param resultsRef
   * @returns Subscription
   */
  function liveQueryFavoritesSubscription(tableName: TableName, resultsRef: Ref<AnyModel[]>) {
    return liveQuery(() => dexieWrapper.table(tableName).orderBy(Field.NAME).toArray()).subscribe({
      next: (data) => {
        const favorites = data.filter((item) => item.favorite)
        const nonFavorites = data.filter((item) => !item.favorite)
        const combined = [...favorites, ...nonFavorites]
        resultsRef.value = combined as AnyModel[]
        consoleDebug(`Retrieved ${tableName}`, combined)
      },
      error: (error) => {
        log.error(`Failed to retrieve ${tableName}`, error)
      },
    })
  }

  const examples: Ref<Example[]> = ref([])
  const tests: Ref<Test[]> = ref([])

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
