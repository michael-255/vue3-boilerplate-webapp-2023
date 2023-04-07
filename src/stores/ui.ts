import { defineStore } from 'pinia'
import { ChartTime } from '@/types/misc'

const useUIStore = defineStore({
  id: 'ui',

  state: () => ({
    drawer: false,
    chartTime: ChartTime.THREE_MONTHS,
  }),

  getters: {
    getChartTimeMilliseconds: (state: any) => {
      return {
        [ChartTime.ONE_MONTH]: 2_629_746_000,
        [ChartTime.THREE_MONTHS]: 7_889_238_000,
        [ChartTime.SIX_MONTHS]: 15_778_476_000,
        [ChartTime.ONE_YEAR]: 31_556_952_000,
        [ChartTime.ALL_TIME]: Number.MAX_SAFE_INTEGER,
      }[state.chartTime as ChartTime]
    },
  },
})

export default useUIStore
