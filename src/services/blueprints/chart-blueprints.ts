import type { AppObject } from '@/types/misc'
import { defineAsyncComponent } from 'vue'

/*
TODO
- You need to expain what the chart blueprints are for.
- Document every function in this file.
*/

export type ChartBlueprint = {
  readonly label: string
  readonly chartOptions: AppObject
  readonly component: any
}

export function numberChart(): ChartBlueprint {
  return {
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
}
