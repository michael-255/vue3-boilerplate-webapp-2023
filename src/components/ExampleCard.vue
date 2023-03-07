<script setup lang="ts">
import { type ParentTable, Icon } from '@/constants/globals'
import { QIcon, QInput, QBtn } from 'quasar'
import { getRecordTable } from '@/services/DatabaseUtils'
import ParentCard from './ParentCard.vue'
import useExampleCard from '@/use/useExampleCard'

defineProps<{
  parentTable: ParentTable
  id: string
  name: string
  favorite: boolean
  // Will be undefined if no records have been recorded yet
  previousNote?: string
  previousTimestamp?: number
  previousNumber?: number
}>()

const { recordNoteModel, exampleNumberModel, onSaveExampleRecord } = useExampleCard()
</script>

<template>
  <ParentCard
    :parent-table="parentTable"
    :id="id"
    :name="name"
    :favorite="favorite"
    :previous-note="previousNote"
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
        <!-- SAVE -->
        <QBtn
          v-show="exampleNumberModel"
          color="positive"
          class="q-ml-sm q-px-sm"
          :icon="Icon.SAVE"
          @click="
            onSaveExampleRecord(
              getRecordTable(parentTable),
              id,
              recordNoteModel,
              exampleNumberModel || 0
            )
          "
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

    <QInput
      v-model="recordNoteModel"
      :hint="`Record Note (${recordNoteModel?.length || 0}/500)`"
      class="q-mt-md"
      type="textarea"
      autogrow
      dense
      outlined
      clearable
    >
      <template v-slot:prepend>
        <QIcon :name="Icon.ADD_NOTE" />
      </template>
    </QInput>
  </ParentCard>
</template>
