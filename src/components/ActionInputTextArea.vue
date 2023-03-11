<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { QInput } from 'quasar'
import useItemsStore from '@/stores/items'
import { DatabaseField, Icon } from '@/constants/globals'

const props = defineProps<{
  type: 'Description' | 'Note'
  locked?: boolean
}>()

const itemsStore = useItemsStore()
const inputLabel: Ref<string> = ref('')
const inputRef: Ref<any> = ref(null)

// Default component state must be valid
if (props.type === 'Description') {
  inputLabel.value = 'Description'
  itemsStore.newItem[DatabaseField.DESCRIPTION] = itemsStore?.oldItem?.[DatabaseField.DESCRIPTION]
    ? itemsStore.oldItem[DatabaseField.DESCRIPTION]
    : ''
  itemsStore.validateItem[DatabaseField.DESCRIPTION] = true
} else if (props.type === 'Note') {
  inputLabel.value = 'Note'
  itemsStore.newItem[DatabaseField.NOTE] = itemsStore?.oldItem?.[DatabaseField.NOTE]
    ? itemsStore.oldItem[DatabaseField.NOTE]
    : ''
  itemsStore.validateItem[DatabaseField.NOTE] = true
}

function textareaRule(text: string) {
  return text !== undefined && text !== null && /^.{0,500}$/.test(text)
}

function validateInput(): void {
  if (props.type === 'Description') {
    itemsStore.validateItem[DatabaseField.DESCRIPTION] = !!inputRef?.value?.validate()
  } else if (props.type === 'Note') {
    itemsStore.validateItem[DatabaseField.NOTE] = !!inputRef?.value?.validate()
  }
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        {{ inputLabel }}
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Description or Note</div>

      <!-- DESCRIPTION -->
      <QInput
        v-if="type === 'Description'"
        v-model="itemsStore.newItem[DatabaseField.DESCRIPTION]"
        ref="Description"
        :label="inputLabel"
        :rules="[(text: string) => textareaRule(text) || 'Description cannot exceed 500 characters']"
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

      <!-- NOTE -->
      <QInput
        v-if="type === 'Note'"
        v-model="itemsStore.newItem[DatabaseField.NOTE]"
        ref="inputRef"
        label="Note"
        :rules="[(description: string) => textareaRule(description) || 'Note cannot exceed 500 characters']"
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
