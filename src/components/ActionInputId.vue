<script setup lang="ts">
import { QInput, uid } from 'quasar'
import { ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'

const props = defineProps<{
  locked?: boolean
  oldId?: string
}>()

const actionRecordStore = useActionRecordStore()
const inputRef: Ref<any> = ref(null)

// Default component state must be valid
actionRecordStore.temp[DatabaseField.ID] = props.oldId ? props.oldId : uid()
actionRecordStore.valid[DatabaseField.ID] = true

function idRule(id: string) {
  return id !== undefined && id !== null && id !== '' && /^.{1,50}$/.test(id)
}

function generateId(): void {
  actionRecordStore.temp[DatabaseField.ID] = uid()
  actionRecordStore.valid[DatabaseField.ID] = true
}

function validateInput(): void {
  actionRecordStore.valid[DatabaseField.ID] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Id
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Provide a unique Id for the item, or generate a random one with the button on the right.
      </div>

      <QInput
        v-model="actionRecordStore.temp[DatabaseField.ID]"
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
