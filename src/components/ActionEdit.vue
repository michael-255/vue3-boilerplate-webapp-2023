<script setup lang="ts">
import { DatabaseField, type AppObject, type DatabaseTable } from '@/constants/globals'
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
  id: string // Not for Settings (KEY) or Logs (AUTO_ID)
}>()

const { getItemById } = useDatabase()
const fields = getFields(props.table)
const oldItem: Ref<AppObject | undefined> = ref(undefined)

onMounted(async () => {
  oldItem.value = await getItemById(props.table, props.id)
})
</script>

<template>
  <ActionInputId
    v-if="fields.includes(DatabaseField.ID) && oldItem"
    :oldId="oldItem[DatabaseField.ID]"
    class="q-mb-md"
  />
  <ActionInputCreatedTimestamp
    v-if="fields.includes(DatabaseField.CREATED_TIMESTAMP) && oldItem"
    :oldTimestamp="oldItem[DatabaseField.CREATED_TIMESTAMP]"
    class="q-mb-md"
  />
  <ActionInputUpdatedTimestamp
    v-if="fields.includes(DatabaseField.UPDATED_TIMESTAMP) && oldItem"
    :oldTimestamp="oldItem[DatabaseField.UPDATED_TIMESTAMP]"
    class="q-mb-md"
  />
  <ActionInputName
    v-if="fields.includes(DatabaseField.NAME) && oldItem"
    :oldName="oldItem[DatabaseField.NAME]"
    class="q-mb-md"
  />
  <ActionInputDescription
    v-if="fields.includes(DatabaseField.DESCRIPTION) && oldItem"
    :oldDescription="oldItem[DatabaseField.DESCRIPTION]"
    class="q-mb-md"
  />
  <ActionInputParentStatus
    v-if="fields.includes(DatabaseField.PARENT_STATUS) && oldItem"
    :oldParentStatus="oldItem[DatabaseField.PARENT_STATUS]"
    class="q-mb-md"
  />
  <ActionInputFavorite
    v-if="fields.includes(DatabaseField.FAVORITE) && oldItem"
    :oldFavorite="oldItem[DatabaseField.FAVORITE]"
    class="q-mb-md"
  />
  <ActionInputExampleMessage
    v-if="fields.includes(DatabaseField.EXAMPLE_MESSAGE) && oldItem"
    :oldExampleMessage="oldItem[DatabaseField.EXAMPLE_MESSAGE]"
    class="q-mb-md"
  />
  <ActionInputParentId
    v-if="fields.includes(DatabaseField.PARENT_ID) && oldItem"
    :table="table"
    :oldParentId="oldItem[DatabaseField.PARENT_ID]"
    class="q-mb-md"
  />
  <ActionInputNote
    v-if="fields.includes(DatabaseField.NOTE) && oldItem"
    :oldNote="oldItem[DatabaseField.NOTE]"
    class="q-mb-md"
  />
  <ActionInputExampleNumber
    v-if="fields.includes(DatabaseField.EXAMPLE_NUMBER) && oldItem"
    :oldExampleNumber="oldItem[DatabaseField.EXAMPLE_NUMBER]"
    class="q-mb-md"
  />
</template>
