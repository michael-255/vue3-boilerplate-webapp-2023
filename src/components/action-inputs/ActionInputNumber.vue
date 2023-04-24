<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { FieldDefault } from '@/services/Defaults'
import useActionStore from '@/stores/action'

// Props & Emits
defineProps<{
  locked?: boolean
  label: string
}>()

// Composables & Stores
const actionStore = useActionStore()

// Data
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionStore.record[DatabaseField.NUMBER] =
    actionStore.record[DatabaseField.NUMBER] ?? FieldDefault[DatabaseField.NUMBER]() // function call
  actionStore.valid[DatabaseField.NUMBER] = true
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: number): boolean {
  // Didn't bother putting these values in Limits because this is just an example component
  return typeof val === 'number' && val < 999_999_999_999_999 && val > -999_999_999_999_999
}

/**
 * Runs the input validation and sets the store valid property to the result.
 */
function validateInput() {
  actionStore.valid[DatabaseField.NUMBER] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard v-show="!locked">
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Number
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">Number stored on this child record is viewable in charts.</div>

      <!-- Note: v-model.number for number types -->
      <QInput
        v-model.number="actionStore.record[DatabaseField.NUMBER]"
        ref="inputRef"
        :label="label"
        :rules="[(val: number) => validationRule(val) || 'Must be a valid number within 15 digits']"
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
