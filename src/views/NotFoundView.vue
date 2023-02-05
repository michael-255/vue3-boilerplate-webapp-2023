<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage>
    <QCard flat>
      <QCardSection class="bg-negative text-white">
        <div class="text-h3">404</div>
        <div class="text-subtitle1">Page Not Found</div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
