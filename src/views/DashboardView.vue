<script setup lang="ts">
import { Icon } from '@/types/icons'
import ResponsivePage from '@/components/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DASHBOARD" banner-title="Dashboard">
    <QCard>
      <QCardSection>Dashboard</QCardSection>
    </QCard>
  </ResponsivePage>
</template>
