<script setup lang="ts">
import { uid } from 'quasar'
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { slugify } from '@/utils/common'
import useActionRecordStore from '@/stores/action-record'

defineProps<{
  locked?: boolean
}>()

const actionRecordStore = useActionRecordStore()
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionRecordStore.actionRecord[DatabaseField.ID] =
    actionRecordStore.actionRecord[DatabaseField.ID] ?? uid()
  actionRecordStore.valid[DatabaseField.ID] = true
})

function idRule(id: string) {
  const idRegex = /^.{1,50}$/ // 1-50 characters

  const isIdValid = (id: string) => {
    return id !== undefined && id !== null && id !== '' && idRegex.test(id)
  }

  if (id) {
    return isIdValid(slugify(id))
  } else {
    return isIdValid(id)
  }
}

function generateId(): void {
  actionRecordStore.actionRecord[DatabaseField.ID] = uid()
  actionRecordStore.valid[DatabaseField.ID] = true
}

function validateInput(): void {
  actionRecordStore.actionRecord[DatabaseField.ID] = slugify(
    actionRecordStore.actionRecord[DatabaseField.ID]
  )
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
        v-model="actionRecordStore.actionRecord[DatabaseField.ID]"
        ref="inputRef"
        label="Id"
        :rules="[(id: string) => idRule(id) || 'Id must be between 1 and 50 characters']"
        :disable="locked"
        :maxlength="50"
        counter
        dense
        outlined
        color="primary"
        hint="Auto formatted"
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
