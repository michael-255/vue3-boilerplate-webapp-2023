<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { QInput } from 'quasar'
import useItemsStore from '@/stores/items'
import { DatabaseField, Icon } from '@/constants/globals'

const props = defineProps<{
  locked?: boolean
  oldName?: string
}>()

const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)

itemsStore.newItem[DatabaseField.NAME] = props.oldName ? props.oldName : 'Example'
itemsStore.validateItem[DatabaseField.NAME] = true

function nameRule(name: string) {
  return name !== undefined && name !== null && name !== '' && /^.{1,50}$/.test(name)
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.NAME] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Name
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Name</div>

      <QInput
        v-model="itemsStore.newItem[DatabaseField.NAME]"
        ref="inputRef"
        label="Name"
        :rules="[(name: string) => nameRule(name) || 'Name must be between 1 and 50 characters']"
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
