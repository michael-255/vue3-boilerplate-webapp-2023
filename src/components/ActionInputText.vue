<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { QInput } from 'quasar'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'

const props = defineProps<{
  locked?: boolean
  oldText?: string
  label: 'Description' | 'Note'
}>()

const actionRecordStore = useActionRecordStore()
const inputRef: Ref<any> = ref(null)

// Default component state must be valid
actionRecordStore.temp[DatabaseField.TEXT] = props.oldText ? props.oldText : ''
actionRecordStore.valid[DatabaseField.TEXT] = true

function textRule(text: string) {
  return text !== undefined && text !== null && /^.{0,500}$/.test(text)
}

function validateInput(): void {
  actionRecordStore.valid[DatabaseField.TEXT] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        {{ label }}
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div v-if="label === 'Description'" class="q-mb-md">TODO Description</div>
      <div v-if="label === 'Note'" class="q-mb-md">TODO Note</div>

      <QInput
        v-model="actionRecordStore.temp[DatabaseField.TEXT]"
        ref="inputRef"
        :label="label"
        :rules="[(description: string) => textRule(description) || `${label} cannot exceed 500 characters`]"
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
