<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionStore from '@/stores/action'

// Props & Emits
defineProps<{
  locked?: boolean
}>()

// Composables & Stores
const actionRecordStore = useActionStore()

// Data
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionRecordStore.record[DatabaseField.DESCRIPTION] =
    actionRecordStore.record[DatabaseField.DESCRIPTION] ?? ''
  actionRecordStore.valid[DatabaseField.DESCRIPTION] = true
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: string) {
  const descriptionRegex = /^.{0,500}$/ // 0-500 characters

  const isDescriptionValid = (val: string) => {
    return descriptionRegex.test(val)
  }

  if (val) {
    return isDescriptionValid(val.trim())
  } else {
    return isDescriptionValid(val)
  }
}

/**
 * Runs the input validation and sets the store valid property to the result. Trims the input.
 */
function validateInput() {
  actionRecordStore.record[DatabaseField.DESCRIPTION] =
    actionRecordStore.record[DatabaseField.DESCRIPTION].trim()
  actionRecordStore.valid[DatabaseField.DESCRIPTION] = !!inputRef?.value?.validate()
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
        v-model="actionRecordStore.record[DatabaseField.DESCRIPTION]"
        ref="inputRef"
        label="Description"
        :rules="[(val: string) => validationRule(val) || 'Description cannot exceed 500 characters']"
        :disable="locked"
        :maxlength="500"
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
