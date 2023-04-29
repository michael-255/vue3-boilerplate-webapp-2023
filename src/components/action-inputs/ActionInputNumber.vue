<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { FieldDefault } from '@/services/Defaults'
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
 * Input validation rule for the template component.
 * Didn't bother putting the limit values in Limits because this is just an example component for the template app.
 */
function validationRule() {
  return (val: number) =>
    (typeof val === 'number' && val < 999_999_999_999_999 && val > -999_999_999_999_999) ||
    'Must be a valid number within 15 digits'
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
        :label="`${previousRecord?.number ?? 'No previous value'}`"
        :rules="[validationRule()]"
        :disable="locked"
        type="number"
        dense
        outlined
        color="primary"
      />
    </QCardSection>
  </QCard>
</template>
