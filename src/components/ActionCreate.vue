<script setup lang="ts">
import { QCard } from 'quasar'
import type { AnyModel, DatabaseTable } from '@/constants/globals'
import { onMounted, ref, type Ref } from 'vue'
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
import useDatabase from '@/use/useDatabase'

const props = defineProps<{
  table: DatabaseTable
  id?: string // Not for Settings or Logs (Key or Auto Id)
}>()

const { getItemById } = useDatabase()
const item: Ref<AnyModel | undefined> = ref(undefined)

onMounted(async () => {
  // Load an item if an id was provided
  if (props.id) {
    item.value = await getItemById(props.table, props.id)
  }
})

// TODO
// - item can be passed to the components to populate the "oldItem" fields
// - An id existing during a "create" then lock certain inputs
// - You may have to do these components like you do "ActionInspect" (no need for getTableComponents)
</script>

<template>
  <QCard class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">{{ table || 'None' }}</div>
      <div class="text-h6 q-mb-sm">{{ id || 'None' }}</div>
    </QCardSection>
  </QCard>

  <ActionInputId class="q-mb-md" />
  <ActionInputCreatedTimestamp class="q-mb-md" />
  <ActionInputUpdatedTimestamp class="q-mb-md" :locked="true" />
  <ActionInputName class="q-mb-md" />
  <ActionInputDescription class="q-mb-md" />
  <ActionInputParentStatus class="q-mb-md" />
  <ActionInputFavorite class="q-mb-md" />
  <ActionInputExampleMessage class="q-mb-md" />
  <ActionInputParentId class="q-mb-md" :table="table" />
  <ActionInputNote class="q-mb-md" :locked="true" />
  <ActionInputExampleNumber class="q-mb-md" />
</template>
