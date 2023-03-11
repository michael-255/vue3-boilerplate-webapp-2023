<script setup lang="ts">
import { QInput } from 'quasar'
import { ref, type Ref } from 'vue'
import { DatabaseField, Icon } from '@/constants/globals'
import useItemsStore from '@/stores/items'

defineProps<{
  locked?: boolean
}>()

const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)

// Default component state must be valid
itemsStore.newItem[DatabaseField.EXAMPLE_NUMBER] = itemsStore?.oldItem?.[
  DatabaseField.EXAMPLE_NUMBER
]
  ? itemsStore.oldItem[DatabaseField.EXAMPLE_NUMBER]
  : 1
itemsStore.validateItem[DatabaseField.EXAMPLE_NUMBER] = true

function exampleNumberRule(num: number): boolean {
  return (
    typeof num === 'number' &&
    isFinite(num) &&
    num < 999_999_999_999_999 &&
    num > -999_999_999_999_999
  )
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.EXAMPLE_NUMBER] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Example Number
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Example Number</div>

      <!-- V-Model.NUMBER -->
      <QInput
        v-model.number="itemsStore.newItem[DatabaseField.EXAMPLE_NUMBER]"
        ref="inputRef"
        label="Example Number"
        :rules="[(num: number) => exampleNumberRule(num) || 'Must be a valid number within 15 digits']"
        :disable="locked"
        type="number"
        dense
        outlined
        color="primary"
        @blur="validateInput()"
      />
    </QCardSection>
  </QCard>
</template>
