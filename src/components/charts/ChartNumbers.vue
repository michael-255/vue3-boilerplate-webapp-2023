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

const { getPaletteColor } = colors
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['January', 'February', 'March'],
  datasets: [{ backgroundColor: getPaletteColor('warning'), data: [40, 20, 12] }],
}
const chartOptions = {
  responsive: true,
}
</script>

<template>
  <QCard class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Testing</div>
      <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
    </QCardSection>
  </QCard>
</template>
