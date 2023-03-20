<script setup lang="ts">
import { Icon } from '@/types/icons'
import { type Ref, ref, onUnmounted } from 'vue'
import { DatabaseType, DatabaseField, SettingId, type DatabaseParentType } from '@/types/database'
import ResponsivePage from '@/components/ResponsivePage.vue'
import DashboardIntroduction from '@/components/DashboardIntroduction.vue'
import useDatabase from '@/composables/useDatabase'
import useLogger from '@/composables/useLogger'
import type { Optional } from '@/types/misc'
import { parentTypes } from '@/constants/database-types'

const { log, consoleLog } = useLogger()
const { setSetting, liveDashboard, getPreviousChildRecord } = useDatabase()

const dashboardListOptions = parentTypes.map((type) => ({
  label: type,
  value: type,
}))

const showIntroduction: Ref<Optional<boolean>> = ref(null)
const dashboardListSelection: Ref<Optional<DatabaseType>> = ref(null)
const examples: Ref<any[]> = ref([])
const tests: Ref<any[]> = ref([])

const subscription = liveDashboard().subscribe({
  next: async (records) => {
    consoleLog('records =', records)

    // Settings
    showIntroduction.value = records.find((s) => s.id === SettingId.SHOW_INTRODUCTION)?.value
    dashboardListSelection.value = records.find(
      (s) => s.id === SettingId.DASHBOARD_LIST_SELECTION
    )?.value

    // Examples
    // Include only enabled examples
    // Sort them by name
    const dashboardExamples = await Promise.all(
      records
        .filter((r) => r.type === DatabaseType.EXAMPLES && r[DatabaseField.IS_ENABLED] === true)
        .sort((a, b) => {
          const aName = a[DatabaseField.NAME] ?? ''
          const bName = b[DatabaseField.NAME] ?? ''
          return aName.localeCompare(bName)
        })
        .map(async (r) => {
          const previousChild = await getPreviousChildRecord(
            r[DatabaseField.TYPE] as DatabaseParentType,
            r[DatabaseField.ID]
          )

          return {
            [DatabaseField.TYPE]: r[DatabaseField.TYPE],
            [DatabaseField.ID]: r[DatabaseField.ID],
            [DatabaseField.NAME]: r[DatabaseField.NAME],
            [DatabaseField.IS_FAVORITED]: r[DatabaseField.IS_FAVORITED],
            previousText: previousChild?.[DatabaseField.TEXT],
            previousTimestamp: previousChild?.[DatabaseField.CREATED_TIMESTAMP],
            previousNumber: previousChild?.[DatabaseField.NUMBER],
          }
        })
    )
    // Group favorites at the top
    const exampleFavorites = dashboardExamples.filter((r) => r[DatabaseField.IS_FAVORITED] === true)
    const exampleNonFavorites = dashboardExamples.filter(
      (r) => r[DatabaseField.IS_FAVORITED] === false
    )
    examples.value = [...exampleFavorites, ...exampleNonFavorites]

    /*
        const parentCardItems: ParentCardItem[] = await Promise.all(
          items.map(async (item) => {
            const previousRecord = await getPreviousRecord(
              DatabaseTable.EXAMPLE_RECORDS,
              item[DatabaseField.ID]
            )
            const previousNote = previousRecord?.[DatabaseField.NOTE]
            const previousTimestamp = previousRecord?.[DatabaseField.CREATED_TIMESTAMP]
            const previousNumber = previousRecord?.[DatabaseField.EXAMPLE_NUMBER]

            return {
              table: DatabaseTable.EXAMPLES,
              [DatabaseField.ID]: item[DatabaseField.ID],
              [DatabaseField.NAME]: item[DatabaseField.NAME],
              [DatabaseField.FAVORITE]: item[DatabaseField.FAVORITE],
              previousNote,
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
    */

    // Tests
    // Include only enabled tests
    // Sort them by name
    const dashboardTests = await Promise.all(
      records
        .filter((r) => r.type === DatabaseType.EXAMPLES && r[DatabaseField.IS_ENABLED] === true)
        .sort((a, b) => {
          const aName = a[DatabaseField.NAME] ?? ''
          const bName = b[DatabaseField.NAME] ?? ''
          return aName.localeCompare(bName)
        })
        .map(async (r) => {
          const previousChild = await getPreviousChildRecord(
            r[DatabaseField.TYPE] as DatabaseParentType,
            r[DatabaseField.ID]
          )

          return {
            [DatabaseField.TYPE]: r[DatabaseField.TYPE],
            [DatabaseField.ID]: r[DatabaseField.ID],
            [DatabaseField.NAME]: r[DatabaseField.NAME],
            [DatabaseField.IS_FAVORITED]: r[DatabaseField.IS_FAVORITED],
            previousText: previousChild?.[DatabaseField.TEXT],
            previousTimestamp: previousChild?.[DatabaseField.CREATED_TIMESTAMP],
            previousNumber: previousChild?.[DatabaseField.NUMBER],
          }
        })
    )
    // Group favorites at the top
    const testFavorites = dashboardTests.filter((r) => r[DatabaseField.IS_FAVORITED] === true)
    const testNonFavorites = dashboardTests.filter((r) => r[DatabaseField.IS_FAVORITED] === false)
    tests.value = [...testFavorites, ...testNonFavorites]
  },
  error: (error) => {
    log.error('Error loading live dashboard records', error)
  },
})

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DASHBOARD" banner-title="Dashboard">
    <DashboardIntroduction v-if="showIntroduction" class="q-mb-md" />

    <!-- Dashboard List Selection -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-xs">What would you like to work on?</div>

        <QOptionGroup
          color="primary"
          :options="dashboardListOptions"
          :model-value="dashboardListSelection"
          @update:model-value="setSetting(SettingId.DASHBOARD_LIST_SELECTION, $event)"
        />
      </QCardSection>
    </QCard>

    <QCard class="q-mb-md">
      <QCardSection>
        {{ examples }}
      </QCardSection>

      <QCardSection>
        {{ tests }}
      </QCardSection>
    </QCard>

    <!-- TODO -->
  </ResponsivePage>
</template>
