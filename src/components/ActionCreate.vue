<script setup lang="ts">
import { QCard } from 'quasar'
import type { DatabaseTable, SettingKey } from '@/constants/globals'
import ActionInputId from '@/components/ActionInputId.vue'
import ActionInputTimestamp from '@/components/ActionInputTimestamp.vue'
import ActionInputName from '@/components/ActionInputName.vue'
import ActionInputTextArea from '@/components/ActionInputTextArea.vue'

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
  <ActionInputTimestamp class="q-mb-md" type="CreatedTimestamp" />
  <ActionInputTimestamp class="q-mb-md" type="UpdatedTimestamp" :locked="true" />
  <ActionInputName class="q-mb-md" />
  <ActionInputTextArea class="q-mb-md" type="Note" />
</template>
