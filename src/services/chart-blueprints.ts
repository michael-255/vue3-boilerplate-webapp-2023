export type ChartBlueprint = {
  readonly label: string
  readonly component: any
}

// TODO
export function numberChart(): ChartBlueprint {
  return {
    label: 'Numbers',
    component: null,
  }
}
