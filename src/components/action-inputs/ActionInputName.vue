<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'

// Props & Emits
defineProps<{
  locked?: boolean
}>()

// Composables & Stores
const actionRecordStore = useActionRecordStore()

// Data
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionRecordStore.actionRecord[DatabaseField.NAME] =
    actionRecordStore.actionRecord[DatabaseField.NAME] ?? 'Example'
  actionRecordStore.valid[DatabaseField.NAME] = true
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: string) {
  const nameRegex = /^.{1,50}$/ // 1-50 characters

  const isNameValid = (val: string) => {
    return val !== undefined && val !== null && val !== '' && nameRegex.test(val)
  }

  if (val) {
    return isNameValid(val.trim())
  } else {
    return isNameValid(val)
  }
}

/**
 * Runs the input validation and sets the store valid property to the result. Trims the input.
 */
function validateInput() {
  actionRecordStore.actionRecord[DatabaseField.NAME] =
    actionRecordStore.actionRecord[DatabaseField.NAME].trim()
  actionRecordStore.valid[DatabaseField.NAME] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard v-show="!locked">
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Name
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">The record name. Dashboard records are partial sorted by name.</div>

      <QInput
        v-model="actionRecordStore.actionRecord[DatabaseField.NAME]"
        ref="inputRef"
        label="Name"
        :rules="[(val: string) => validationRule(val) || 'Name must be between 1 and 50 characters']"
        :disable="locked"
        :maxlength="50"
        counter
        dense
        outlined
        color="primary"
        @blur="validateInput()"
      />
    </QCardSection>
  </QCard>
</template>
