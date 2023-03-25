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
  actionRecordStore.actionRecord[DatabaseField.NOTE] =
    actionRecordStore.actionRecord[DatabaseField.NOTE] ?? ''
  actionRecordStore.valid[DatabaseField.NOTE] = true
})

function noteRule(note: string) {
  return /^.{0,500}$/.test(note)
}

function validateInput(): void {
  actionRecordStore.actionRecord[DatabaseField.NOTE] =
    actionRecordStore.actionRecord[DatabaseField.NOTE].trim()
  actionRecordStore.valid[DatabaseField.NOTE] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Note
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Note</div>

      <QInput
        v-model="actionRecordStore.actionRecord[DatabaseField.NOTE]"
        ref="inputRef"
        label="Note"
        :rules="[(note: string) => noteRule(note.trim()) || 'Note cannot exceed 500 characters']"
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
