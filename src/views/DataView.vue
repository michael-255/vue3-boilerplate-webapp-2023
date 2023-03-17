<script setup lang="ts">
import { Icon } from '@/types/icons'
import ResponsivePage from '@/components/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage :banner-icon="Icon.TABLE" banner-title="Data">
    <QCard>
      <QCardSection>Data</QCardSection>
    </QCard>
  </ResponsivePage>
</template>
