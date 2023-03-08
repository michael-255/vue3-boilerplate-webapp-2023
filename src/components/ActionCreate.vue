<script setup lang="ts">
import { QCard } from 'quasar'
import type { DatabaseTable, SettingKey } from '@/constants/globals'

defineProps<{
  table: DatabaseTable
  id?: string | number | SettingKey
}>()

// TODO - If id exists, restrict fields cause its a record creation
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-sm">{{ table || 'None' }}</div>
      <div class="text-h6 q-mb-sm">{{ id || 'None' }}</div>
    </QCardSection>
  </QCard>
</template>
