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

const randomNumber = () => {
  return Math.floor(Math.random() * (10 - 1 + 1) + 1)
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

// Chart Options
const options = {
  responsive: true,
  radius: 3,
  plugins: {
    legend: {
      display: true,
    },
  },
}

const chartDataset1 = {
  label: 'Dataset 1',
  backgroundColor: getPaletteColor('negative'),
  borderColor: getPaletteColor('negative'),
  data: [
    randomNumber() + 20,
    randomNumber() + 25,
    randomNumber() + 30,
    randomNumber() + 35,
    randomNumber() + 40,
  ],
}

const chartDataset2 = {
  label: 'Dataset 2',
  backgroundColor: getPaletteColor('positive'),
  borderColor: getPaletteColor('positive'),
  data: [
    randomNumber() + 15,
    randomNumber() + 20,
    randomNumber() + 25,
    randomNumber() + 30,
    randomNumber() + 35,
  ],
}

// Chart Data
const data = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [chartDataset1, chartDataset2],
}
</script>

<template>
  <QCard class="q-mb-md">
    <QCardSection>
      <div class="text-h6">Chart Title</div>
      <Line :options="options" :data="data" />
    </QCardSection>
  </QCard>
</template>
