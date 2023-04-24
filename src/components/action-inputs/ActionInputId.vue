<script setup lang="ts">
import { uid } from 'quasar'
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { slugify } from '@/utils/common'
import { Limit } from '@/types/misc'
import { FieldDefault } from '@/services/Defaults'
import useActionStore from '@/stores/action'

// Props & Emits
defineProps<{
  locked?: boolean
}>()

// Composables & Stores
const actionStore = useActionStore()

// Data
const inputRef: Ref<any> = ref(null)

onMounted(() => {
  actionStore.record[DatabaseField.ID] =
    actionStore.record[DatabaseField.ID] ?? FieldDefault[DatabaseField.ID]() // function call
  actionStore.valid[DatabaseField.ID] = true
})

/**
 * Input validation rule test for the template component.
 * @param val
 */
function validationRule(val: string) {
  return (
    typeof val === 'string' && slugify(val).length <= Limit.MAX_ID_LENGTH && slugify(val).length > 0 // Must have at least 1 character
  )
}

/**
 * Generates a random id for the store and sets it as valid.
 */
function generateId() {
  actionStore.record[DatabaseField.ID] = uid()
  actionStore.valid[DatabaseField.ID] = true
}

/**
 * Runs the input validation and sets the store valid property to the result. Slugifies the input.
 */
function validateInput() {
  actionStore.record[DatabaseField.ID] = slugify(actionStore.record[DatabaseField.ID])
  actionStore.valid[DatabaseField.ID] = !!inputRef?.value?.validate()
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
        v-model="actionStore.record[DatabaseField.ID]"
        ref="inputRef"
        label="Id"
        :rules="[(val: string) => validationRule(val) || `Id must be between 1 and ${Limit.MAX_ID_LENGTH} characters`]"
        :disable="locked"
        :maxlength="Limit.MAX_ID_LENGTH"
        type="text"
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
