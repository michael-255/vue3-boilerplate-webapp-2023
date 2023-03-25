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
  actionRecordStore.actionRecord[DatabaseField.NAME] =
    actionRecordStore.actionRecord[DatabaseField.NAME] ?? 'Example'
  actionRecordStore.valid[DatabaseField.NAME] = true
})

function nameRule(name: string) {
  return name !== undefined && name !== null && name !== '' && /^.{1,50}$/.test(name)
}

function validateInput(): void {
  actionRecordStore.actionRecord[DatabaseField.NAME] =
    actionRecordStore.actionRecord[DatabaseField.NAME].trim()
  actionRecordStore.valid[DatabaseField.NAME] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Name
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Name</div>

      <QInput
        v-model="actionRecordStore.actionRecord[DatabaseField.NAME]"
        ref="inputRef"
        label="Name"
        :rules="[(name: string) => nameRule(name.trim()) || 'Name must be between 1 and 50 characters']"
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
