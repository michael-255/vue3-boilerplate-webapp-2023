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
import { onMounted, ref } from 'vue'
import { DatabaseField, type DatabaseChildType, type DatabaseParentType } from '@/types/database'
import { getChildType } from '@/services/data-utils'
import useLogger from '@/composables/useLogger'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import useDatabase from '@/composables/useDatabase'

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

const chartOptions = {
  reactive: true,
  responsive: true,
  radius: 2,
  plugins: {
    legend: {
      display: false,
    },
  },
  interaction: {
    intersect: false,
  },
}

const chartData: any = ref({
  labels: [],
  datasets: [],
})

onMounted(async () => {
  try {
    const chartingRecords = await getChildRecordsByParentId(
      getChildType(routeDatabaseType as DatabaseParentType) as DatabaseChildType,
      routeId
    )

    const chartLabels = chartingRecords.map((record: any) =>
      date.formatDate(record[DatabaseField.CREATED_TIMESTAMP], 'ddd YYYY MMM D h:mm a')
    )

    const chartDataItems = chartingRecords.map((record: any) => record[DatabaseField.NUMBER])

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
  } catch (error) {
    log.error('Error loading numbers chart', error)
  }
})

const downwardTrend = (ctx: any, value: any) =>
  ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined
</script>

<template>
  <QCard class="q-mb-md">
    <QCardSection>
      <div class="text-h6">Numbers</div>
      <Line :options="chartOptions" :data="chartData" />
    </QCardSection>
  </QCard>
</template>
