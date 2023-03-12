<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { QInput } from 'quasar'
import useItemsStore from '@/stores/items'
import { DatabaseField, Icon } from '@/constants/globals'

const props = defineProps<{
  locked?: boolean
  oldExampleMessage?: string
}>()

const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)

itemsStore.newItem[DatabaseField.EXAMPLE_MESSAGE] = props.oldExampleMessage
  ? props.oldExampleMessage
  : 'Example Message'
itemsStore.validateItem[DatabaseField.EXAMPLE_MESSAGE] = true

function exampleMessageRule(message: string) {
  return message !== undefined && message !== null && message !== '' && /^.{1,50}$/.test(message)
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.EXAMPLE_MESSAGE] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Example Message
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Example Message</div>

      <QInput
        v-model="itemsStore.newItem[DatabaseField.EXAMPLE_MESSAGE]"
        ref="inputRef"
        label="Example Message"
        :rules="[(message: string) => exampleMessageRule(message) || 'Example message must be between 1 and 50 characters']"
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
