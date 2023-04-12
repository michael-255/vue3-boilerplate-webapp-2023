<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { truncateString } from '@/utils/common'
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { getParentType } from '@/services/Blueprints'
import useLogger from '@/composables/useLogger'
import useActionRecordStore from '@/stores/action-record'
import useRoutables from '@/composables/useRoutables'
import DB from '@/services/LocalDatabase'

// Props & Emits
defineProps<{
  locked?: boolean
}>()

// Composables & Stores
const { routeDatabaseType, routeParentId } = useRoutables()
const { log } = useLogger()
const actionRecordStore = useActionRecordStore()

// Data
const inputRef: Ref<any> = ref(null)
const options: Ref<any[]> = ref([])

/**
 * Sets the select box options with the parent items from the database.
 */
onMounted(async () => {
  try {
    const parentType = getParentType(routeDatabaseType)

    // Parent type must exist to continue
    if (!parentType) {
      throw new Error('Missing parent table')
    }

    // Gets all enabled parent records
    const parentTypeRecords = await DB.getEnabledParentRecords(parentType)

    // Builds parent options with value as the id, and the label as the name and truncated id
    options.value = parentTypeRecords.map((a: any) => ({
      value: a.id, // Item id is used as the value under the hood
      label: `${a.name} (${truncateString(a.id, 4, '*')})`, // Truncate id for readability
    }))

    // Set the current option
    // Must do this first so it can be null if parent was deleted versus being the first option
    if (routeParentId) {
      // An existing parent id means we have to try and match it too our options as a selection
      const matchedParent = options.value?.find(
        (option) => option.value === routeParentId // Comparing the full ids
      )?.value

      if (matchedParent) {
        // Parent match found, so use that id
        actionRecordStore.actionRecord[DatabaseField.PARENT_ID] = matchedParent
        actionRecordStore.valid[DatabaseField.PARENT_ID] = true
      } else {
        // Parent match NOT found, so set to null (parent is missing for some reason)
        actionRecordStore.actionRecord[DatabaseField.PARENT_ID] = null
        actionRecordStore.valid[DatabaseField.PARENT_ID] = false
      }
    } else if (options.value?.length > 0) {
      // We know at least one option exists, so default to the first option
      actionRecordStore.actionRecord[DatabaseField.PARENT_ID] = options.value[0].value
      actionRecordStore.valid[DatabaseField.PARENT_ID] = true
    } else {
      // No options exist, so set to null (this record cannot be completed until a parent is created)
      actionRecordStore.actionRecord[DatabaseField.PARENT_ID] = null
      actionRecordStore.valid[DatabaseField.PARENT_ID] = false
    }
  } catch (error) {
    log.error('Error with Parent Id component', error)
  }
})

/**
 * Input rule test for the parent id.
 * @param id
 */
function parentIdRule(id: string) {
  return id !== undefined && id !== null && id !== ''
}

/**
 * Runs the input validation and sets the store valid property to the result.
 */
function validateInput() {
  actionRecordStore.valid[DatabaseField.PARENT_ID] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Parent
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        The parent record that this child record is linked with. Select one from the list. Part of
        the parent record id is shown to the right of each selection.
      </div>

      <QSelect
        v-model="actionRecordStore.actionRecord[DatabaseField.PARENT_ID]"
        ref="inputRef"
        label="Parent"
        :disable="locked"
        :options="options"
        :rules="[(id: string) => parentIdRule(id) || '* Required']"
        emit-value
        map-options
        options-dense
        dense
        outlined
        color="primary"
        @blur="validateInput()"
      />
    </QCardSection>
  </QCard>
</template>
