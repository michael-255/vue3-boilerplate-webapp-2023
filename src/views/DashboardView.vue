<script setup lang="ts">
import { Icon } from '@/types/icons'
import { type Ref, ref, onUnmounted } from 'vue'
import {
  DatabaseType,
  DatabaseField,
  SettingId,
  type DatabaseParentType,
  type DatabaseChildType,
  type SettingValue,
} from '@/types/database'
import type { Optional } from '@/types/misc'
import { parentDatabaseTypes, getChildType, getLabel } from '@/services/Blueprints'
import ResponsivePage from '@/components/ResponsivePage.vue'
import DashboardIntroduction from '@/components/DashboardIntroduction.vue'
import useLogger from '@/composables/useLogger'
import useRoutables from '@/composables/useRoutables'
import DashboardParentCard from '@/components/DashboardParentCard.vue'
import useUIStore from '@/stores/ui'
import DB from '@/services/LocalDatabase'

/**
 * Used to display data from parent types on the dashboard.
 */
export type DashboardParent = {
  [DatabaseField.TYPE]: DatabaseParentType
  [DatabaseField.ID]: string
  [DatabaseField.NAME]: string
  [DatabaseField.IS_FAVORITED]: boolean
  previousNote?: string
  previousCreatedTimestamp?: number
  previousNumber?: number
}

// Composables & Stores
const uiStore = useUIStore()
const { log } = useLogger()
const { goToCreate } = useRoutables()

// Data
const dashboardListOptions = parentDatabaseTypes.map((type) => ({
  label: type,
  value: type,
}))
const showIntroduction: Ref<Optional<SettingValue>> = ref(null)
const dashboardRecordRefs = {
  [DatabaseType.EXAMPLE]: ref([]),
  [DatabaseType.TEST]: ref([]),
} as { [key in DatabaseParentType]: Ref<DashboardParent[]> }

const subscription = DB.liveDashboard().subscribe({
  next: async (records) => {
    // Settings
    showIntroduction.value = records.find((s) => s.id === SettingId.SHOW_INTRODUCTION)?.value

    // Examples
    // Include only enabled examples
    // Sort them by name
    const dashboardExamples = await Promise.all(
      records
        .filter((r) => r.type === DatabaseType.EXAMPLE && r[DatabaseField.IS_ENABLED] === true)
        .map(async (r) => {
          const previousChild = await DB.getPreviousChildRecord(
            getChildType(r[DatabaseField.TYPE]) as DatabaseChildType,
            r[DatabaseField.ID]
          )

          return {
            [DatabaseField.TYPE]: r[DatabaseField.TYPE],
            [DatabaseField.ID]: r[DatabaseField.ID],
            [DatabaseField.NAME]: r[DatabaseField.NAME],
            [DatabaseField.IS_FAVORITED]: r[DatabaseField.IS_FAVORITED],
            previousNote: previousChild?.[DatabaseField.NOTE],
            previousCreatedTimestamp: previousChild?.[DatabaseField.CREATED_TIMESTAMP],
            previousNumber: previousChild?.[DatabaseField.NUMBER],
          } as DashboardParent
        })
    )
    // Group favorites at the top
    const exampleFavorites = dashboardExamples.filter((r) => r[DatabaseField.IS_FAVORITED] === true)
    const exampleNonFavorites = dashboardExamples.filter(
      (r) => r[DatabaseField.IS_FAVORITED] === false
    )
    dashboardRecordRefs[DatabaseType.EXAMPLE].value = [...exampleFavorites, ...exampleNonFavorites]

    // Tests
    // Include only enabled tests
    // Sort them by name
    const dashboardTests = await Promise.all(
      records
        .filter((r) => r.type === DatabaseType.TEST && r[DatabaseField.IS_ENABLED] === true)
        .map(async (r) => {
          const previousChild = await DB.getPreviousChildRecord(
            getChildType(r[DatabaseField.TYPE]) as DatabaseChildType,
            r[DatabaseField.ID]
          )

          return {
            [DatabaseField.TYPE]: r[DatabaseField.TYPE],
            [DatabaseField.ID]: r[DatabaseField.ID],
            [DatabaseField.NAME]: r[DatabaseField.NAME],
            [DatabaseField.IS_FAVORITED]: r[DatabaseField.IS_FAVORITED],
            previousNote: previousChild?.[DatabaseField.NOTE],
            previousCreatedTimestamp: previousChild?.[DatabaseField.CREATED_TIMESTAMP],
            previousNumber: previousChild?.[DatabaseField.NUMBER],
          } as DashboardParent
        })
    )
    // Group favorites at the top
    const testFavorites = dashboardTests.filter((r) => r[DatabaseField.IS_FAVORITED] === true)
    const testNonFavorites = dashboardTests.filter((r) => r[DatabaseField.IS_FAVORITED] === false)
    dashboardRecordRefs[DatabaseType.TEST].value = [...testFavorites, ...testNonFavorites]
  },
  error: (error) => {
    log.error('Error loading live dashboard records', error)
  },
})

onUnmounted(() => {
  subscription.unsubscribe()
})

/**
 * Returns display text with the number of enabled records for the current Dashboard selection.
 */
function getDashboardRecordsCountText() {
  const count = dashboardRecordRefs?.[uiStore.dashboardListSelection]?.value?.length ?? 0

  if (count === 1) {
    return '1 enabled record found'
  } else {
    return `${count} enabled records found`
  }
}
</script>

<template>
  <ResponsivePage :bannerIcon="Icon.DASHBOARD" bannerTitle="Dashboard">
    <DashboardIntroduction v-if="showIntroduction" class="q-mb-md" />

    <!-- Dashboard List Selection -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-xs">What would you like to work on?</div>

        <QOptionGroup
          color="primary"
          :options="dashboardListOptions"
          :model-value="uiStore.dashboardListSelection"
          @update:model-value="uiStore.dashboardListSelection = $event"
        />
      </QCardSection>
    </QCard>

    <!-- Examples - Using v-show so the DOM doesn't get updated when switching selections -->
    <div v-show="uiStore.dashboardListSelection === DatabaseType.EXAMPLE">
      <div v-for="(record, i) in dashboardRecordRefs[DatabaseType.EXAMPLE].value" :key="i">
        <DashboardParentCard
          :type="record[DatabaseField.TYPE]"
          :id="record[DatabaseField.ID]"
          :name="record[DatabaseField.NAME]"
          :isFavorite="record[DatabaseField.IS_FAVORITED]"
          :previousNote="record.previousNote"
          :previousCreatedTimestamp="record.previousCreatedTimestamp"
          :previousNumber="record.previousNumber"
          class="q-mb-md"
        >
          <QBtn
            outline
            color="positive"
            label="Add Record"
            :icon="Icon.NEW"
            @click="goToCreate(DatabaseType.EXAMPLE_RESULT, record[DatabaseField.ID])"
          />
        </DashboardParentCard>
      </div>
    </div>

    <!-- Tests - Using v-show so the DOM doesn't get updated when switching selections -->
    <div v-show="uiStore.dashboardListSelection === DatabaseType.TEST">
      <div v-for="(record, j) in dashboardRecordRefs[DatabaseType.TEST].value" :key="j">
        <DashboardParentCard
          :type="record[DatabaseField.TYPE]"
          :id="record[DatabaseField.ID]"
          :name="record[DatabaseField.NAME]"
          :isFavorite="record[DatabaseField.IS_FAVORITED]"
          :previousNote="record.previousNote"
          :previousCreatedTimestamp="record.previousCreatedTimestamp"
          :previousNumber="record.previousNumber"
          class="q-mb-md"
        >
          <QBtn
            outline
            color="positive"
            label="Add Record"
            :icon="Icon.NEW"
            @click="goToCreate(DatabaseType.TEST_RESULT, record[DatabaseField.ID])"
          />
        </DashboardParentCard>
      </div>
    </div>

    <!-- Bottom of Dashboard message and create button -->
    <div class="row justify-center q-my-md">
      <div class="col-12 text-center">
        <QIcon name="menu_open" size="80px" color="grey" />
      </div>

      <div class="col-12 text-grey text-center q-mb-md">{{ getDashboardRecordsCountText() }}</div>

      <QBtn
        color="positive"
        :icon="Icon.CREATE"
        :label="`Create ${getLabel(uiStore.dashboardListSelection, 'singular')}`"
        @click="goToCreate(uiStore.dashboardListSelection)"
      />
    </div>
  </ResponsivePage>
</template>
