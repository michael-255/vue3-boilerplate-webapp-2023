<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { QSelect } from 'quasar'
import { DatabaseField, Icon, ParentStatus } from '@/constants/globals'
import useItemsStore from '@/stores/items'

defineProps<{
  locked?: boolean
}>()

const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)
const options: Ref<ParentStatus[]> = ref(Object.values(ParentStatus) || [])

// Default component state must be valid
itemsStore.newItem[DatabaseField.PARENT_STATUS] = itemsStore?.oldItem?.[DatabaseField.PARENT_STATUS]
  ? itemsStore.oldItem[DatabaseField.PARENT_STATUS]
  : options.value[0]
itemsStore.validateItem[DatabaseField.PARENT_STATUS] = true

function parentStatusRule(status: ParentStatus) {
  return status !== undefined && status !== null
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.PARENT_STATUS] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Parent Status
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Parent Status</div>

      <QSelect
        :disable="locked"
        v-model="itemsStore.newItem[DatabaseField.PARENT_STATUS]"
        ref="inputRef"
        label="Parent Status"
        :options="options"
        :rules="[(status: ParentStatus) => parentStatusRule(status) || '* Required']"
        emit-value
        map-options
        options-dense
        dense
        outlined
        color="primary"
        @blur="validateInput()"
      />
    </QCardSection>
  </QCard>
</template>
