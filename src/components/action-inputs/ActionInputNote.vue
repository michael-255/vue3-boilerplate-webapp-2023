<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { Limit } from '@/types/misc'
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
  actionStore.record[DatabaseField.NOTE] =
    actionStore.record[DatabaseField.NOTE] ?? FieldDefault[DatabaseField.NOTE]() // function call
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: string) {
  return typeof val === 'string' && val.trim().length <= Limit.MAX_NOTE_LENGTH
}
</script>

<template>
  <QCard v-show="!locked">
    <QCardSection>
      <div class="text-h6 q-mb-md">
        {{ label }}
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Large text area for the child record note. Previous notes can be viewed on the Dashboard.
      </div>

      <QInput
        v-model="actionStore.record[DatabaseField.NOTE]"
        ref="inputRef"
        :label="label"
        :rules="[(val: string) => validationRule(val) || `Note cannot exceed ${Limit.MAX_NOTE_LENGTH} characters`]"
        :disable="locked"
        :maxlength="Limit.MAX_NOTE_LENGTH"
        type="textarea"
        autogrow
        counter
        dense
        outlined
        clearable
        color="primary"
        @blur="
          actionStore.record[DatabaseField.NOTE] = actionStore.record[DatabaseField.NOTE].trim()
        "
      />
    </QCardSection>
  </QCard>
</template>
