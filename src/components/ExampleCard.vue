<script setup lang="ts">
import { Field, Icon } from '@/constants/globals'
import type { ParentTable } from '@/constants/types'
import { QCard, QCardSection } from 'quasar'
import { ref, onUpdated } from 'vue'
import ParentCard from './ParentCard.vue'
import useLogger from '@/use/useLogger'
import useDatabaseCommon from '@/use/useDatabaseCommon'

const props = defineProps<{
  parentTable: ParentTable
  id: string
  name: string
  favorite: boolean
  previousTimestamp?: number // Will be undefined if no records have been recorded yet
}>()

const { log, consoleDebug } = useLogger()
const { updateItem } = useDatabaseCommon()

const inputNumber = ref(undefined)

onUpdated(() => {
  consoleDebug('ExampleCard', 'onUpdated', inputNumber.value)
  inputNumber.value = undefined
})

async function onSaveNumber() {
  // this should be add a record not update...
  await updateItem(props.parentTable, props.id, { [Field.EXAMPLE_NUMBER]: inputNumber.value })
  log.info('Number value saved')
  inputNumber.value = undefined
}
</script>

<template>
  <ParentCard
    :parent-table="parentTable"
    :id="id"
    :name="name"
    :favorite="favorite"
    :previous-timestamp="previousTimestamp"
  >
    <div>
      <QIcon :name="Icon.EXAMPLES" />
      <span class="text-caption q-ml-xs"> test </span>
    </div>

    <QInput class="q-mt-md" type="number" v-model="inputNumber" dense outlined placeholder="Number">
      <template v-slot:after>
        <QBtn
          v-show="inputNumber"
          color="positive"
          class="q-ml-sm q-px-sm"
          :icon="Icon.SAVE"
          @click="onSaveNumber()"
        />
        <QBtn
          v-show="!inputNumber"
          disable
          color="grey"
          class="q-ml-sm q-px-sm"
          :icon="Icon.SAVE"
        />
      </template>
    </QInput>
  </ParentCard>
</template>
