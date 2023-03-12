<script setup lang="ts">
import { QInput, uid } from 'quasar'
import { ref, type Ref } from 'vue'
import { DatabaseField, Icon } from '@/constants/globals'
import useItemsStore from '@/stores/items'

const props = defineProps<{
  locked?: boolean
  oldId?: string
}>()

const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)

// Default component state must be valid
itemsStore.newItem[DatabaseField.ID] = props.oldId ? props.oldId : uid()
itemsStore.validateItem[DatabaseField.ID] = true

function idRule(id: string) {
  return id !== undefined && id !== null && id !== '' && /^.{1,50}$/.test(id)
}

function generateId(): void {
  itemsStore.newItem[DatabaseField.ID] = uid()
  itemsStore.validateItem[DatabaseField.ID] = true
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.ID] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Id
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Provide a unique Id for the item, or generate a random one with the button on the right.
      </div>

      <QInput
        v-model="itemsStore.newItem[DatabaseField.ID]"
        ref="inputRef"
        label="Id"
        :rules="[(id: string) => idRule(id) || 'Id must be between 1 and 50 characters']"
        :disable="locked"
        :maxlength="50"
        counter
        dense
        outlined
        color="primary"
        @blur="validateInput()"
      >
        <template v-slot:after>
          <QBtn
            :disable="locked"
            :icon="Icon.REFRESH"
            color="primary"
            class="q-px-sm"
            @click="generateId()"
          />
        </template>
      </QInput>
    </QCardSection>
  </QCard>
</template>
