<script setup lang="ts">
import { QCard } from 'quasar'
import type { DatabaseTable, SettingKey } from '@/constants/globals'
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

defineProps<{
  table: DatabaseTable
  id?: string | number | SettingKey
}>()

// TODO - If id exists, restrict fields cause its a record creation
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
