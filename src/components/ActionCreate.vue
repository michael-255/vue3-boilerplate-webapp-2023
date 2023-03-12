<script setup lang="ts">
import { DatabaseField, type DatabaseTable } from '@/constants/globals'
import { onMounted, ref, type Ref } from 'vue'
import { getFields } from '@/services/DatabaseUtils'
import useDatabase from '@/use/useDatabase'
import ActionInputId from '@/components/ActionInputId.vue'
import ActionInputCreatedTimestamp from '@/components/ActionInputCreatedTimestamp.vue'
import ActionInputUpdatedTimestamp from '@/components/ActionInputUpdatedTimestamp.vue'
import ActionInputName from '@/components/ActionInputName.vue'
import ActionInputDescription from '@/components/ActionInputDescription.vue'
import ActionInputParentStatus from '@/components/ActionInputParentStatus.vue'
import ActionInputFavorite from '@/components/ActionInputFavorite.vue'
import ActionInputExampleMessage from '@/components/ActionInputExampleMessage.vue'
import ActionInputParentId from '@/components/ActionInputParentId.vue'
import ActionInputNote from '@/components/ActionInputNote.vue'
import ActionInputExampleNumber from '@/components/ActionInputExampleNumber.vue'

const props = defineProps<{
  table: DatabaseTable
  id?: string // Not for Settings (KEY) or Logs (AUTO_ID)
}>()

const { getItemById } = useDatabase()
const lockField: Ref<boolean> = ref(false)
const fields = getFields(props.table)
const parentId: Ref<string | undefined> = ref(undefined)

onMounted(async () => {
  if (props.id) {
    // Load the parent item if an id was provided
    const parentItem = (await getItemById(props.table, props.id)) as any

    if (parentItem) {
      parentId.value = parentItem[DatabaseField.ID]
      // Certian fields should be locked if a parent item is loaded
      lockField.value = true
    }
  }
})
</script>

<template>
  <ActionInputId v-if="fields.includes(DatabaseField.ID)" class="q-mb-md" />
  <ActionInputCreatedTimestamp
    v-if="fields.includes(DatabaseField.CREATED_TIMESTAMP)"
    :locked="lockField"
    class="q-mb-md"
  />
  <ActionInputUpdatedTimestamp
    v-if="fields.includes(DatabaseField.UPDATED_TIMESTAMP)"
    :locked="lockField"
    class="q-mb-md"
  />
  <ActionInputName v-if="fields.includes(DatabaseField.NAME)" class="q-mb-md" />
  <ActionInputDescription v-if="fields.includes(DatabaseField.DESCRIPTION)" class="q-mb-md" />
  <ActionInputParentStatus v-if="fields.includes(DatabaseField.PARENT_STATUS)" class="q-mb-md" />
  <ActionInputFavorite v-if="fields.includes(DatabaseField.FAVORITE)" class="q-mb-md" />
  <ActionInputExampleMessage
    v-if="fields.includes(DatabaseField.EXAMPLE_MESSAGE)"
    class="q-mb-md"
  />
  <ActionInputParentId
    v-if="fields.includes(DatabaseField.PARENT_ID)"
    class="q-mb-md"
    :locked="lockField"
    :table="table"
    :oldParentId="parentId"
  />
  <ActionInputNote v-if="fields.includes(DatabaseField.NOTE)" class="q-mb-md" />
  <ActionInputExampleNumber v-if="fields.includes(DatabaseField.EXAMPLE_NUMBER)" class="q-mb-md" />
</template>
