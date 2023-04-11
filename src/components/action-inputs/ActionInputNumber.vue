<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'

defineProps<{
  locked?: boolean
}>()

const actionRecordStore = useActionRecordStore()
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionRecordStore.actionRecord[DatabaseField.NUMBER] =
    actionRecordStore.actionRecord[DatabaseField.NUMBER] ?? 0
  actionRecordStore.valid[DatabaseField.NUMBER] = true
})

/**
 * Input rule test for the number.
 * @param num
 */
function exampleNumberRule(num: number): boolean {
  return (
    typeof num === 'number' &&
    isFinite(num) &&
    num < 999_999_999_999_999 &&
    num > -999_999_999_999_999
  )
}

/**
 * Runs the input validation and sets the store valid property to the result.
 */
function validateInput() {
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

      <div class="q-mb-md">Number stored on this child record is viewable in charts.</div>

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
