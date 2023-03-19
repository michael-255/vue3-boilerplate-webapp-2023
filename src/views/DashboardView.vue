<script setup lang="ts">
import { Icon } from '@/types/icons'
import { type Ref, ref, onUnmounted } from 'vue'
import { DatabaseType, SettingId } from '@/types/database'
import ResponsivePage from '@/components/ResponsivePage.vue'
import DashboardIntroduction from '@/components/DashboardIntroduction.vue'
import useDatabase from '@/composables/useDatabase'
import useLogger from '@/composables/useLogger'
import type { Optional } from '@/types/misc'
import { parentTypes } from '@/constants/database-types'

const { log } = useLogger()
const { liveSettings } = useDatabase()

const dashboardListOptions = parentTypes.map((type) => ({
  label: type,
  value: type,
}))

const showIntroduction: Ref<Optional<boolean>> = ref(null)
const dashboardListSelection: Ref<Optional<DatabaseType>> = ref(null)

// Settings Live Query
const settingsSubscription = liveSettings().subscribe({
  next: (records) => {
    showIntroduction.value = records.find((s) => s.id === SettingId.SHOW_INTRODUCTION)?.value
    dashboardListSelection.value = records.find(
      (s) => s.id === SettingId.DASHBOARD_LIST_SELECTION
    )?.value
  },
  error: (error) => {
    log.error('Error loading live settings', error)
  },
})

// Examples Live Query
// const examplesSubscription = liveExamples().subscribe({
//   next: (records) => {
//     // TODO
//   },
//   error: (error) => {
//     log.error('Error loading live examples', error)
//   },
// })

// Tests Live Query
// const testsSubscription = liveTests().subscribe({
//   next: (records) => {
//     // TODO
//   },
//   error: (error) => {
//     log.error('Error loading live tests', error)
//   },
// })

onUnmounted(() => {
  settingsSubscription.unsubscribe()
  // examplesSubscription.unsubscribe()
  // testsSubscription.unsubscribe()
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
          v-model="dashboardListSelection"
          :options="dashboardListOptions"
          color="primary"
        />
      </QCardSection>
    </QCard>

    <!-- TODO -->
  </ResponsivePage>
</template>
