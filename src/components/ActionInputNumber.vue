<script setup lang="ts">
import { QInput } from 'quasar'
import { ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'
defineProps<{
  locked?: boolean
}>()

const actionRecordStore = useActionRecordStore()
const inputRef: Ref<any> = ref(null)

// Default component state must be valid
if (!actionRecordStore.actionRecord[DatabaseField.NUMBER]) {
  actionRecordStore.actionRecord[DatabaseField.NUMBER] = 1
}
actionRecordStore.valid[DatabaseField.NUMBER] = true

function exampleNumberRule(num: number): boolean {
  return (
    typeof num === 'number' &&
    isFinite(num) &&
    num < 999_999_999_999_999 &&
    num > -999_999_999_999_999
  )
}

function validateInput(): void {
  actionRecordStore.valid[DatabaseField.NUMBER] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Number
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Number</div>

      <!-- Note: v-model.number for number types -->
      <QInput
        v-model.number="actionRecordStore.actionRecord[DatabaseField.NUMBER]"
        ref="inputRef"
        label="Number"
        :rules="[(num: number) => exampleNumberRule(num) || 'Must be a valid number within 15 digits']"
        :disable="locked"
        type="number"
        dense
        outlined
        color="primary"
        @blur="validateInput()"
      />
    </QCardSection>
  </QCard>
</template>
