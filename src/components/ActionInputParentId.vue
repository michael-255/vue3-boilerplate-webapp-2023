<script setup lang="ts">
import { QSelect } from 'quasar'
import { onMounted, ref, type Ref } from 'vue'
import { truncateString } from '@/utils/common'
import { getParentTable } from '@/services/DatabaseUtils'
import { DatabaseField, DatabaseTable, Icon, type RecordTable } from '@/constants/globals'
import useDatabase from '@/use/useDatabase'
import useLogger from '@/use/useLogger'
import useItemsStore from '@/stores/items'

const props = defineProps<{
  locked?: boolean
  table: DatabaseTable
  oldParentId?: string
}>()

const { log } = useLogger()
const { getSelectableParentTable } = useDatabase()
const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)
const options: Ref<any[]> = ref([])

/**
 * Sets the select box options with the parent items from the database.
 */
onMounted(async () => {
  try {
    const parentTable = getParentTable(props.table as RecordTable)

    // Parent table must exist to continue
    if (!parentTable) {
      throw new Error('Missing parent table')
    }

    const parentTableData = await getSelectableParentTable(parentTable)

    // Builds options with value and label
    options.value = parentTableData.map((a: any) => ({
      value: a.id, // Item id is used as the value under the hood
      label: `${a.name} (${truncateString(a.id, 4, '*')})`, // Truncate id for readability
    }))

    // Set the current option
    // Must do this first so it can be null if parent was deleted versus being the first option
    if (props.oldParentId) {
      const parent = options.value?.find((opt) => opt.value === props.oldParentId)?.value

      if (parent) {
        itemsStore.newItem[DatabaseField.PARENT_ID] = parent
        itemsStore.validateItem[DatabaseField.PARENT_ID] = true
      } else {
        itemsStore.newItem[DatabaseField.PARENT_ID] = null
        itemsStore.validateItem[DatabaseField.PARENT_ID] = false
      }
    } else if (options.value?.length > 0) {
      itemsStore.newItem[DatabaseField.PARENT_ID] = options.value[0].value
      itemsStore.validateItem[DatabaseField.PARENT_ID] = true
    } else {
      itemsStore.newItem[DatabaseField.PARENT_ID] = null
      itemsStore.validateItem[DatabaseField.PARENT_ID] = false
    }
  } catch (error) {
    log.error('Error with Parent Id component', error)
  }
})

function parentIdRule(id: string) {
  return id !== undefined && id !== null && id !== ''
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.PARENT_ID] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Parent
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Parent</div>

      <QSelect
        v-model="itemsStore.newItem[DatabaseField.PARENT_ID]"
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
