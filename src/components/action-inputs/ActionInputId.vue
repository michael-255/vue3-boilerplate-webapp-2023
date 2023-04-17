<script setup lang="ts">
import { uid } from 'quasar'
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { slugify } from '@/utils/common'
import useActionRecordStore from '@/stores/action-record'

// Props & Emits
defineProps<{
  locked?: boolean
}>()

// Composables & Stores
const actionRecordStore = useActionRecordStore()

// Data
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionRecordStore.actionRecord[DatabaseField.ID] =
    actionRecordStore.actionRecord[DatabaseField.ID] ?? uid()
  actionRecordStore.valid[DatabaseField.ID] = true
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: string) {
  const idRegex = /^.{1,50}$/ // 1-50 characters

  const isIdValid = (val: string) => {
    return val !== undefined && val !== null && val !== '' && idRegex.test(val)
  }

  if (val) {
    return isIdValid(slugify(val))
  } else {
    return isIdValid(val)
  }
}

/**
 * Generates a random id for the store and sets it as valid.
 */
function generateId() {
  actionRecordStore.actionRecord[DatabaseField.ID] = uid()
  actionRecordStore.valid[DatabaseField.ID] = true
}

/**
 * Runs the input validation and sets the store valid property to the result. Slugifies the input.
 */
function validateInput() {
  actionRecordStore.actionRecord[DatabaseField.ID] = slugify(
    actionRecordStore.actionRecord[DatabaseField.ID]
  )
  actionRecordStore.valid[DatabaseField.ID] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard v-show="!locked">
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Id
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Unique id for the record. Generate a random id with the button on the right.
      </div>

      <QInput
        v-model="actionRecordStore.actionRecord[DatabaseField.ID]"
        ref="inputRef"
        label="Id"
        :rules="[(val: string) => validationRule(val) || 'Id must be between 1 and 50 characters']"
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
