<script setup lang="ts">
import { colors } from 'quasar'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

type _GeneratedReport = {
  title: string
  firstRecordDate: string
  lastRecordDate: string
  chartLabels: string[]
  chartDatasets: _ChartDataset[]
}

type _ReportChart = {
  firstRecordDate: string
  lastRecordDate: string
  chartData: _ChartData
}

type _ChartData = {
  labels: string[]
  datasets: _ChartDataset[]
}

type _ChartDataset = {
  label: string
  borderColor: string
  data: (number | null)[]
}

const { getPaletteColor } = colors
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartOptions = {
  responsive: true,
  radius: 100, // for line charts?
  plugins: {
    legend: {
      display: true,
    },
  },
}

const chartDataset1 = {
  label: 'Dataset 1',
  backgroundColor: getPaletteColor('warning'),
  data: [40, 20, 12, null, 1],
}

const chartDataset2 = {
  label: 'Dataset 2',
  backgroundColor: getPaletteColor('positive'),
  data: [40, 20, 12, null, 1],
}

const chartProps = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [chartDataset1, chartDataset2],
}
</script>

<template>
  <QCard class="q-mb-md">
    <QCardSection>
      <div class="text-h6">Chart Title</div>
      <Bar id="my-chart-id" :options="chartOptions" :data="chartProps" />
    </QCardSection>
  </QCard>
</template>
