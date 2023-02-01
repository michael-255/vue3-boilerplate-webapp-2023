<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import type { Icon } from '@/constants/globals'

defineProps<{
  icon: Icon
  title: string
}>()
</script>

<template>
  <QCard flat square class="q-mb-sm">
    <QCardSection class="text-h5">
      <QIcon class="q-pb-xs q-pr-xs" :name="icon" />
      {{ title }}
    </QCardSection>
  </QCard>
</template>
