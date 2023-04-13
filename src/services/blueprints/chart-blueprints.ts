import type { AppObject } from '@/types/misc'
import { defineAsyncComponent } from 'vue'

/*
This file contains chart objects used to help render chart data.
Do NOT mutate these objects as they are used by multiple components.
*/

/**
 * Chart properties required for chart components.
 */
export type ChartBlueprint = {
  readonly label: string
  readonly chartOptions: AppObject
  readonly component: any // Vue component used when rendering
}

/**
 * Numbers chart.
 */
export const numberChart: ChartBlueprint = {
  label: 'Numbers',
  chartOptions: {
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
  },
  component: defineAsyncComponent(() => import('@/components/charts/ChartNumbers.vue')),
}
