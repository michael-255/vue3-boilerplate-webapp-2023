import { defineAsyncComponent } from 'vue'

export type ChartBlueprint = {
  readonly label: string
  readonly component: any
}

// TODO
export function numberChart(): ChartBlueprint {
  return {
    label: 'Numbers',
    component: defineAsyncComponent(() => import('@/components/charts/ChartNumbers.vue')),
  }
}
