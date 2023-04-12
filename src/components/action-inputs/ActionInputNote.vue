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
  actionRecordStore.actionRecord[DatabaseField.NOTE] =
    actionRecordStore.actionRecord[DatabaseField.NOTE] ?? ''
  actionRecordStore.valid[DatabaseField.NOTE] = true
})

/**
 * Input rule test for the note.
 * @param note
 */
function noteRule(note: string) {
  const noteRegex = /^.{0,500}$/ // 0-500 characters

  const isNoteValid = (note: string) => {
    return noteRegex.test(note)
  }

  if (note) {
    return isNoteValid(note.trim())
  } else {
    return isNoteValid(note)
  }
}

/**
 * Runs the input validation and sets the store valid property to the result. Trims the input.
 */
function validateInput() {
  actionRecordStore.actionRecord[DatabaseField.NOTE] =
    actionRecordStore.actionRecord[DatabaseField.NOTE].trim()
  actionRecordStore.valid[DatabaseField.NOTE] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Note
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Large text area for the child record note. Previous notes can be viewed on the Dashboard.
      </div>

      <QInput
        v-model="actionRecordStore.actionRecord[DatabaseField.NOTE]"
        ref="inputRef"
        label="Note"
        :rules="[(note: string) => noteRule(note) || 'Note cannot exceed 500 characters']"
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
