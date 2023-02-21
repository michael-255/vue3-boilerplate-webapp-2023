<script setup lang="ts">
import { Icon } from '@/constants/globals'
import type { ParentTable } from '@/constants/types'
import { QIcon, QInput, QBtn } from 'quasar'
import { onUpdated } from 'vue'
import ParentCard from './ParentCard.vue'
import useExampleCard from '@/use/useExampleCard'
import TableUtils from '@/services/TableUtils'

defineProps<{
  parentTable: ParentTable
  id: string
  name: string
  favorite: boolean
  // Will be undefined if no records have been recorded yet
  previousTimestamp?: number
  previousNumber?: number
}>()

const { exampleNumberModel, onSaveRecord } = useExampleCard()

onUpdated(() => {
  exampleNumberModel.value = undefined
})
</script>

<template>
  <ParentCard
    :parent-table="parentTable"
    :id="id"
    :name="name"
    :favorite="favorite"
    :previous-timestamp="previousTimestamp"
  >
    <div v-show="previousNumber">
      <QIcon :name="Icon.EXAMPLES" />
      <span class="text-caption q-ml-xs">{{ previousNumber }}</span>
    </div>

    <QInput
      class="q-mt-md"
      type="number"
      v-model="exampleNumberModel"
      dense
      outlined
      placeholder="Number"
    >
      <template v-slot:after>
        <QBtn
          v-show="exampleNumberModel"
          color="positive"
          class="q-ml-sm q-px-sm"
          :icon="Icon.SAVE"
          @click="onSaveRecord(TableUtils.getRecordTable(parentTable), id, exampleNumberModel || 0)"
        />
        <QBtn
          v-show="!exampleNumberModel"
          disable
          color="grey"
          class="q-ml-sm q-px-sm"
          :icon="Icon.SAVE"
        />
      </template>
    </QInput>
  </ParentCard>
</template>
