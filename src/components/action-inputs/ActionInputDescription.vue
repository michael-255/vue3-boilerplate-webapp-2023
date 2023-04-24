<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import AppDefault from '@/services/AppDefaults'
import useActionStore from '@/stores/action'

// Props & Emits
defineProps<{
  locked?: boolean
}>()

// Composables & Stores
const actionStore = useActionStore()

// Data
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionStore.record[DatabaseField.DESCRIPTION] =
    actionStore.record[DatabaseField.DESCRIPTION] ?? AppDefault[DatabaseField.DESCRIPTION]
  actionStore.valid[DatabaseField.DESCRIPTION] = true
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: string) {
  return typeof val === 'string' && val.trim().length <= AppDefault.MAX_DESCRIPTION_LENGTH
}

/**
 * Runs the input validation and sets the store valid property to the result. Trims the input.
 */
function validateInput() {
  actionStore.record[DatabaseField.DESCRIPTION] =
    actionStore.record[DatabaseField.DESCRIPTION].trim()
  actionStore.valid[DatabaseField.DESCRIPTION] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard v-show="!locked">
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Description
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">Large text area for the parent record description.</div>

      <QInput
        v-model="actionStore.record[DatabaseField.DESCRIPTION]"
        ref="inputRef"
        label="Description"
        :rules="[(val: string) => validationRule(val) || `Description cannot exceed ${AppDefault.MAX_DESCRIPTION_LENGTH} characters`]"
        :disable="locked"
        :maxlength="AppDefault.MAX_DESCRIPTION_LENGTH"
        type="textarea"
        autogrow
        counter
        dense
        outlined
        clearable
        color="primary"
        @blur="validateInput()"
      />
    </QCardSection>
  </QCard>
</template>
