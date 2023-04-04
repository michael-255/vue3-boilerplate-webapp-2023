<script setup lang="ts">
import { Icon } from '@/types/icons'
import type { DatabaseType } from '@/types/database'
import { getChartBlueprints } from '@/services/data-utils'
import { onMounted } from 'vue'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import ResponsivePage from '@/components/ResponsivePage.vue'
import useLogger from '@/composables/useLogger'
import ChartTimeInput from '@/components/charts/ChartTimeInput.vue'

const { routeDatabaseType, isRouteDatabaseTypeValid, bannerType } = useRoutingHelpers()
const { log } = useLogger()

const chartBlueprints = getChartBlueprints(routeDatabaseType as DatabaseType)

onMounted(() => {
  try {
    if (!isRouteDatabaseTypeValid()) {
      throw new Error(`Invalid route databaseType: ${routeDatabaseType}`)
    }
  } catch (error) {
    log.error('Error loading charts view', error)
  }
})
</script>

<template>
  <ResponsivePage :banner-icon="Icon.CHARTS" :banner-title="`${bannerType()} Charts`">
    <!-- Error Render -->
    <div v-if="chartBlueprints.length === 0">
      <QCard class="q-mb-md">
        <QCardSection>
          <div class="text-h6">No charts available for this record type</div>
        </QCardSection>
      </QCard>
    </div>

    <!-- Normal Page Render -->
    <div v-else>
      <ChartTimeInput class="q-mb-md" />

      <div v-for="(chartBP, i) in chartBlueprints" :key="i" class="q-mb-md">
        <!-- Dynamic Async Components -->
        <component :is="chartBP.component" />
      </div>
    </div>
  </ResponsivePage>
</template>
