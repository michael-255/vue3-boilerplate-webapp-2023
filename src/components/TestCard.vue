<script setup lang="ts">
import { type ParentTable, Icon } from '@/constants/globals'
import { QIcon, QInput, QBtn } from 'quasar'
import { getRecordTable } from '@/services/DatabaseUtils'
import ParentCard from './ParentCard.vue'
import useTestCard from '@/use/useTestCard'

defineProps<{
  parentTable: ParentTable
  id: string
  name: string
  favorite: boolean
  // Will be undefined if no records have been recorded yet
  previousTimestamp?: number
  previousNumber?: number
}>()

const { exampleNumberModel, onSaveTestRecord } = useTestCard()
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
          @click="onSaveTestRecord(getRecordTable(parentTable), id, exampleNumberModel || 0)"
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
