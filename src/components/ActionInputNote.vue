<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { QInput } from 'quasar'
import { DatabaseField, Icon } from '@/constants/globals'
import useItemsStore from '@/stores/items'

defineProps<{
  locked?: boolean
}>()

const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)

// Default component state must be valid
itemsStore.newItem[DatabaseField.NOTE] = itemsStore?.oldItem?.[DatabaseField.NOTE]
  ? itemsStore.oldItem[DatabaseField.NOTE]
  : ''
itemsStore.validateItem[DatabaseField.NOTE] = true

function noteRule(note: string) {
  return note !== undefined && note !== null && /^.{0,500}$/.test(note)
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.NOTE] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Note
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Note</div>

      <QInput
        v-model="itemsStore.newItem[DatabaseField.NOTE]"
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
