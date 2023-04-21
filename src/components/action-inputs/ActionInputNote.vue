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
  actionRecordStore.record[DatabaseField.NOTE] = actionRecordStore.record[DatabaseField.NOTE] ?? ''
  actionRecordStore.valid[DatabaseField.NOTE] = true
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: string) {
  const noteRegex = /^.{0,500}$/ // 0-500 characters

  const isNoteValid = (val: string) => {
    return noteRegex.test(val)
  }

  if (val) {
    return isNoteValid(val.trim())
  } else {
    return isNoteValid(val)
  }
}

/**
 * Runs the input validation and sets the store valid property to the result. Trims the input.
 */
function validateInput() {
  actionRecordStore.record[DatabaseField.NOTE] = actionRecordStore.record[DatabaseField.NOTE].trim()
  actionRecordStore.valid[DatabaseField.NOTE] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard v-show="!locked">
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Note
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Large text area for the child record note. Previous notes can be viewed on the Dashboard.
      </div>

      <QInput
        v-model="actionRecordStore.record[DatabaseField.NOTE]"
        ref="inputRef"
        label="Note"
        :rules="[(val: string) => validationRule(val) || 'Note cannot exceed 500 characters']"
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
