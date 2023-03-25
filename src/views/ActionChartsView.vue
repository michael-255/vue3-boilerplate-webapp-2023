<script setup lang="ts">
import { colors } from 'quasar'
import { Icon } from '@/types/icons'
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
import ResponsivePage from '@/components/ResponsivePage.vue'

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
  <ResponsivePage :banner-icon="Icon.CHARTS" banner-title="Charts">
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Testing</div>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
