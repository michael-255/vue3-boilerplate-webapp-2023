<script setup lang="ts">
import { Icon } from '@/types/icons'
import ResponsivePage from '@/components/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage :banner-icon="Icon.CREATE" banner-title="Create">
    <QCard>
      <QCardSection>Create</QCardSection>
    </QCard>
  </ResponsivePage>
</template>
