<script setup lang="ts">
import { Icon } from '@/types/icons'
import { type Ref, ref, onUnmounted } from 'vue'
import {
  DatabaseType,
  DatabaseField,
  SettingId,
  type DatabaseParentType,
  type DatabaseChildType,
} from '@/types/database'
import type { DashboardParent } from '@/types/frontend'
import type { Optional } from '@/types/misc'
import { parentTypes, getChildType, getLabel } from '@/services/data-utils'
import ResponsivePage from '@/components/ResponsivePage.vue'
import DashboardIntroduction from '@/components/DashboardIntroduction.vue'
import useDatabase from '@/composables/useDatabase'
import useLogger from '@/composables/useLogger'
import useActions from '@/composables/useActions'
import DashboardParentCard from '@/components/DashboardParentCard.vue'

const { log, consoleLog } = useLogger()
const { goToCreate } = useActions()
const { setSetting, liveDashboard, getPreviousChildRecord } = useDatabase()

const dashboardListOptions = parentTypes.map((type) => ({
  label: type,
  value: type,
}))

const showIntroduction: Ref<Optional<boolean>> = ref(null)
const dashboardListSelection: Ref<Optional<DatabaseType>> = ref(null)
const dashboardRecordRefs = {
  [DatabaseType.EXAMPLES]: ref([]),
  [DatabaseType.TESTS]: ref([]),
} as { [key in DatabaseParentType]: Ref<DashboardParent[]> }

const subscription = liveDashboard().subscribe({
  next: async (records) => {
    consoleLog('records =', records)

    // Settings
    showIntroduction.value = records.find((s) => s.id === SettingId.SHOW_INTRODUCTION)?.value
    dashboardListSelection.value = records.find(
      (s) => s.id === SettingId.DASHBOARD_LIST_SELECTION
    )?.value

    consoleLog('dashboardListSelection =', dashboardListSelection.value)

    // Examples
    // Include only enabled examples
    // Sort them by name
    const dashboardExamples = await Promise.all(
      records
        .filter((r) => r.type === DatabaseType.EXAMPLES && r[DatabaseField.IS_ENABLED] === true)
        .map(async (r) => {
          const previousChild = await getPreviousChildRecord(
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
    dashboardRecordRefs[DatabaseType.EXAMPLES].value = [...exampleFavorites, ...exampleNonFavorites]

    // Tests
    // Include only enabled tests
    // Sort them by name
    const dashboardTests = await Promise.all(
      records
        .filter((r) => r.type === DatabaseType.TESTS && r[DatabaseField.IS_ENABLED] === true)
        .map(async (r) => {
          const previousChild = await getPreviousChildRecord(
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
    dashboardRecordRefs[DatabaseType.TESTS].value = [...testFavorites, ...testNonFavorites]
  },
  error: (error) => {
    log.error('Error loading live dashboard records', error)
  },
})

onUnmounted(() => {
  subscription.unsubscribe()
})

// TODO
function getDashboardRecordsCountText() {
  const count =
    dashboardRecordRefs?.[dashboardListSelection.value as DatabaseParentType]?.value?.length ?? 0

  if (count === 1) {
    return '1 enabled record found'
  } else {
    return `${count} enabled records found`
  }
}
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

    <!-- Examples - Using v-show so the DOM doesn't get updated when switching selections -->
    <div v-show="dashboardListSelection === DatabaseType.EXAMPLES">
      <div v-for="(record, i) in dashboardRecordRefs[DatabaseType.EXAMPLES].value" :key="i">
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
            label="Add Entry"
            :icon="Icon.NEW"
            @click="goToCreate(DatabaseType.EXAMPLE_RESULTS, record[DatabaseField.ID])"
          />
        </DashboardParentCard>
      </div>
    </div>

    <!-- Tests - Using v-show so the DOM doesn't get updated when switching selections -->
    <div v-show="dashboardListSelection === DatabaseType.TESTS">
      <div v-for="(record, j) in dashboardRecordRefs[DatabaseType.TESTS].value" :key="j">
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
            label="Add Entry"
            :icon="Icon.NEW"
            @click="goToCreate(DatabaseType.TEST_RESULTS, record[DatabaseField.ID])"
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
        :label="`Create ${getLabel(dashboardListSelection as DatabaseType, 'singular')}`"
        @click="goToCreate(dashboardListSelection as DatabaseType)"
      />
    </div>
  </ResponsivePage>
</template>
