<script setup lang="ts">
import { QPage, QCard, QCardSection } from 'quasar'
import { Icon } from '@/constants/globals'
</script>

<template>
  <QPage padding>
    <!-- Banner -->
    <QCard flat square class="q-mb-sm">
      <QCardSection class="text-h5">
        <QIcon class="q-pb-xs q-pr-xs" :name="Icon.REFRESH" />
        Action View
      </QCardSection>
    </QCard>
  </QPage>
</template>
