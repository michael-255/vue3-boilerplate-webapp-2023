<script setup lang="ts">
import { colors } from 'quasar'
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

// Old way I did things:
//
// type _GeneratedReport = {
//   title: string
//   firstRecordDate: string
//   lastRecordDate: string
//   chartLabels: string[]
//   chartDatasets: _ChartDataset[]
// }

const randomNumber = (plus: number = 0) => {
  return Math.floor(Math.random() * 10) - 2 + plus
}

const { getPaletteColor } = colors
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

const getDates = (startDate: Date, stopDate: Date) => {
  const dateArray = []
  let currentDate = startDate
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate))
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
  }
  return dateArray
}

const getRandomNumbers = (length: number) => {
  const arr = []
  for (let i = 0; i < length; i++) {
    arr.push(randomNumber(i))
  }
  return arr
}

const down = (ctx: any, value: any) => (ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined)

// Chart Options
const options = {
  responsive: true,
  radius: 3,
  plugins: {
    legend: {
      display: true,
    },
  },
  interaction: {
    intersect: false,
  },
}

const chartDataset1 = {
  label: 'Total',
  backgroundColor: getPaletteColor('primary'),
  borderColor: getPaletteColor('primary'),
  spanGaps: true,
  segment: {
    borderColor: (ctx: any) => down(ctx, getPaletteColor('negative')) || getPaletteColor('primary'),
  },
  data: getRandomNumbers(365),
}

// Chart Data
const data = {
  labels: getDates(new Date('2023/1/1'), new Date('2023/12/31')).map((d) => d.toDateString()),
  datasets: [chartDataset1],
}
</script>

<template>
  <QCard class="q-mb-md">
    <QCardSection>
      <div class="text-h6">Reps</div>
      <Line :options="options" :data="data" />
    </QCardSection>
  </QCard>
</template>
