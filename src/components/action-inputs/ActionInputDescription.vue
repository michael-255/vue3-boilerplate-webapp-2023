<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { QInput } from 'quasar'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'

defineProps<{
  locked?: boolean
}>()

const actionRecordStore = useActionRecordStore()
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionRecordStore.actionRecord[DatabaseField.DESCRIPTION] =
    actionRecordStore.actionRecord[DatabaseField.DESCRIPTION] ?? ''
  actionRecordStore.valid[DatabaseField.DESCRIPTION] = true
})

function descriptionRule(description: string) {
  return /^.{0,500}$/.test(description)
}

function validateInput(): void {
  actionRecordStore.actionRecord[DatabaseField.DESCRIPTION] =
    actionRecordStore.actionRecord[DatabaseField.DESCRIPTION].trim()
  actionRecordStore.valid[DatabaseField.DESCRIPTION] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Description
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Description</div>

      <QInput
        v-model="actionRecordStore.actionRecord[DatabaseField.DESCRIPTION]"
        ref="inputRef"
        label="Description"
        :rules="[(description: string) => descriptionRule(description.trim()) || 'Description cannot exceed 500 characters']"
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
