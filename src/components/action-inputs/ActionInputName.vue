<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
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
  const nameRegex = /^.{1,50}$/ // 1-50 characters

  const isNameValid = (name: string) => {
    return name !== undefined && name !== null && name !== '' && nameRegex.test(name)
  }

  if (name) {
    return isNameValid(name.trim())
  } else {
    return isNameValid(name)
  }
}

/**
 * Runs the input validation and sets the store valid property to the result. Trims the input.
 */
function validateInput() {
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
