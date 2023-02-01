<script setup lang="ts">
import { QPage, QCard, QCardSection } from 'quasar'
import { Icon } from '@/constants/globals'
</script>

<template>
  <QPage padding>
    <QCard class="q-mb-sm">
      <QCardSection class="text-h5 text-white bg-primary">
        <QIcon class="q-pb-xs q-pr-xs" :name="Icon.DASHBOARD" />
        Dashboard
      </QCardSection>
    </QCard>
  </QPage>
</template>
