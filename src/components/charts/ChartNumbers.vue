<script setup lang="ts">
import { colors, date } from 'quasar'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import { onMounted, ref, watch, type Ref } from 'vue'
import { DatabaseField, type DatabaseChildType, type DatabaseParentType } from '@/types/database'
import { getChildType } from '@/services/data-utils'
import type { AppObject, ChartTime } from '@/types/misc'
import useLogger from '@/composables/useLogger'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import useDatabase from '@/composables/useDatabase'
import useUIStore from '@/stores/ui'

defineProps<{
  label: string
  chartOptions: AppObject
}>()

const uiStore = useUIStore()

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

const { getPaletteColor } = colors
const { log } = useLogger()
const { routeDatabaseType, routeId } = useRoutingHelpers()
const { getChildRecordsByParentId } = useDatabase()

const hasData: Ref<boolean> = ref(false)
const recordCount: Ref<number> = ref(0)

const chartData: any = ref({
  labels: [],
  datasets: [],
})

onMounted(async () => {
  await recalculateChart()
})

/**
 * Returns the color for the chart line if the trend is downward.
 * @param ctx
 * @param value
 */
function downwardTrend(ctx: any, color: any) {
  return ctx.p0.parsed.y > ctx.p1.parsed.y ? color : undefined
}

async function recalculateChart() {
  try {
    const chartingRecords = await getChildRecordsByParentId(
      getChildType(routeDatabaseType as DatabaseParentType) as DatabaseChildType,
      routeId
    )

    if (chartingRecords.length > 0) {
      hasData.value = true

      const chartMilliseconds = uiStore.getChartTimeMilliseconds

      const timeRestrictedRecords = chartingRecords.filter((record: any) => {
        const timeDifference = new Date().getTime() - record[DatabaseField.CREATED_TIMESTAMP]
        return timeDifference <= chartMilliseconds
      })

      recordCount.value = timeRestrictedRecords.length

      const chartLabels = timeRestrictedRecords.map((record: any) =>
        date.formatDate(record[DatabaseField.CREATED_TIMESTAMP], 'ddd YYYY MMM D h:mm a')
      )

      const chartDataItems = timeRestrictedRecords.map(
        (record: any) => record[DatabaseField.NUMBER]
      )

      chartData.value = {
        labels: chartLabels,
        datasets: [
          {
            label: '', // Legend label
            backgroundColor: getPaletteColor('primary'),
            borderColor: getPaletteColor('primary'),
            segment: {
              borderColor: (ctx: any) =>
                downwardTrend(ctx, getPaletteColor('accent')) || getPaletteColor('primary'),
            },
            data: chartDataItems,
          },
        ],
      }
    }
  } catch (error) {
    log.error('Error loading numbers chart', error)
  }
}

/**
 * Watching uiStore chart time for the property to change.
 */
watch(
  () => uiStore.chartTime as ChartTime,
  async () => {
    try {
      await recalculateChart()
    } catch (error) {
      log.error('Error with chart time watcher', error)
    }
  },
  { immediate: true }
)
</script>

<template>
  <QCard class="q-mb-md">
    <QCardSection>
      <div class="text-h6">{{ label }}</div>
      <div>Charted Records Count: {{ recordCount }}</div>
      <Line v-if="hasData" :options="chartOptions" :data="chartData" />
      <div v-else>No data found</div>
    </QCardSection>
  </QCard>
</template>
