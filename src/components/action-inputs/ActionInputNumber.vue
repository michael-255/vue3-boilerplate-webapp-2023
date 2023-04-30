<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { FieldDefault } from '@/services/Defaults'
import type { Optional } from '@/types/misc'
import useParentIdWatcher from '@/composables/useParentIdWatcher'
import useActionStore from '@/stores/action'

// Props & Emits
defineProps<{
  locked?: boolean
  label: string
}>()

// Composables & Stores
const actionStore = useActionStore()
const { previousRecord } = useParentIdWatcher()

// Data
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionStore.record[DatabaseField.NUMBER] =
    actionStore.record[DatabaseField.NUMBER] ?? FieldDefault[DatabaseField.NUMBER]() // function call
})

/**
 * Formats the label for the input field based on the previous record value.
 * @param actionRecordValue
 */
function previousLabel(actionRecordValue: Optional<number>) {
  if (actionRecordValue !== null && actionRecordValue !== undefined) {
    return `Previously ${actionRecordValue}`
  } else {
    return 'No previous data'
  }
}

/**
 * Input validation rule for the template component.
 * Didn't bother putting the limit values in Limits because this is just an example component for the template app.
 */
function validationRule() {
  return (val: Optional<number>) =>
    val === null ||
    val === undefined ||
    (typeof val === 'number' && val < 999_999_999_999_999 && val > -999_999_999_999_999) ||
    'If provided, number must be 15 digits (+/-)'
}

/**
 * Ensures the values are set to null if the input is empty.
 * @param val
 */
function blurValueUpdate(val: Optional<number> | '') {
  if (val === null || val === undefined || val === '') {
    actionStore.record[DatabaseField.NUMBER] = null
  }
}
</script>

<template>
  <QCard v-show="!locked">
    <QCardSection>
      <div class="text-h6 q-mb-md">
        {{ label }}
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">Number stored on this child record is viewable in charts.</div>

      <!-- Note: v-model.number for number types -->
      <QInput
        v-model.number="actionStore.record[DatabaseField.NUMBER]"
        ref="inputRef"
        :label="previousLabel(previousRecord?.number)"
        :rules="[validationRule()]"
        :disable="locked"
        type="number"
        dense
        outlined
        color="primary"
        @blur="blurValueUpdate(actionStore.record[DatabaseField.NUMBER])"
      />
    </QCardSection>
  </QCard>
</template>
