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
  actionStore.record[DatabaseField.NOTE] =
    actionStore.record[DatabaseField.NOTE] ?? AppDefault[DatabaseField.NOTE]
  actionStore.valid[DatabaseField.NOTE] = true
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: string) {
  return typeof val === 'string' && val.trim().length <= AppDefault.MAX_NOTE_LENGTH
}

/**
 * Runs the input validation and sets the store valid property to the result. Trims the input.
 */
function validateInput() {
  actionStore.record[DatabaseField.NOTE] = actionStore.record[DatabaseField.NOTE].trim()
  actionStore.valid[DatabaseField.NOTE] = !!inputRef?.value?.validate()
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
        v-model="actionStore.record[DatabaseField.NOTE]"
        ref="inputRef"
        label="Note"
        :rules="[(val: string) => validationRule(val) || `Note cannot exceed ${AppDefault.MAX_NOTE_LENGTH} characters`]"
        :disable="locked"
        :maxlength="AppDefault.MAX_NOTE_LENGTH"
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
