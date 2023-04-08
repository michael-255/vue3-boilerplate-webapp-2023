<script setup lang="ts">
import { Icon } from '@/types/icons'
import { getChartBlueprints, getLabel } from '@/services/data-utils'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import ResponsivePage from '@/components/ResponsivePage.vue'
import ChartTimeInput from '@/components/charts/ChartTimeInput.vue'

const { routeDatabaseType } = useRoutingHelpers()
const chartBlueprints = getChartBlueprints(routeDatabaseType)
</script>

<template>
  <ResponsivePage
    :banner-icon="Icon.CHARTS"
    :banner-title="`${getLabel(routeDatabaseType, 'singular')} Charts`"
  >
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
        <component
          :is="chartBP.component"
          :label="chartBP.label"
          :chartOptions="chartBP.chartOptions"
        />
      </div>
    </div>
  </ResponsivePage>
</template>
