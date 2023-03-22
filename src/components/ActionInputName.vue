<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { QInput } from 'quasar'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'

const props = defineProps<{
  locked?: boolean
  oldName?: string
  label: 'Name' | 'Error'
}>()

const actionRecordStore = useActionRecordStore()
const inputRef: Ref<any> = ref(null)

actionRecordStore.temp[DatabaseField.NAME] = props.oldName ? props.oldName : 'Example'
actionRecordStore.valid[DatabaseField.NAME] = true

function nameRule(name: string) {
  return name !== undefined && name !== null && name !== '' && /^.{1,50}$/.test(name)
}

function validateInput(): void {
  actionRecordStore.valid[DatabaseField.NAME] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        {{ label }}
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div v-if="label === 'Name'" class="q-mb-md">TODO Name</div>
      <div v-if="label === 'Error'" class="q-mb-md">TODO Error</div>

      <QInput
        v-model="actionRecordStore.temp[DatabaseField.NAME]"
        ref="inputRef"
        :label="label"
        :rules="[(name: string) => nameRule(name) || `${label} must be between 1 and 50 characters`]"
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
