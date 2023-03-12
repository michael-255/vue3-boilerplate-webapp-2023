<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { QInput } from 'quasar'
import { DatabaseField, Icon } from '@/constants/globals'
import useItemsStore from '@/stores/items'

const props = defineProps<{
  locked?: boolean
  oldDescription?: string
}>()

const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)

// Default component state must be valid
itemsStore.newItem[DatabaseField.DESCRIPTION] = props.oldDescription ? props.oldDescription : ''
itemsStore.validateItem[DatabaseField.DESCRIPTION] = true

function descriptionRule(description: string) {
  return description !== undefined && description !== null && /^.{0,500}$/.test(description)
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.DESCRIPTION] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Description
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Description</div>

      <QInput
        v-model="itemsStore.newItem[DatabaseField.DESCRIPTION]"
        ref="inputRef"
        label="Description"
        :rules="[(description: string) => descriptionRule(description) || 'Description cannot exceed 500 characters']"
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
