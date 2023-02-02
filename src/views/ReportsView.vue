<script setup lang="ts">
import { QPage, QCard, QCardSection, QBtn } from 'quasar'
import { Icon } from '@/constants/globals'
</script>

<template>
  <QPage padding>
    <!-- Banner -->
    <QCard flat square class="q-mb-sm">
      <QCardSection class="text-h5">
        <QIcon class="q-pb-xs q-pr-xs" :name="Icon.REPORTS" />
        Reports
        <!-- TODO -->
        <QBtn flat rounded :icon="Icon.MENU_VERT" color="grey" class="absolute-right q-ma-xs" />
      </QCardSection>
    </QCard>
  </QPage>
</template>
