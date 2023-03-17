<script setup lang="ts">
import { Icon } from '@/types/icons'
import ResponsivePage from '@/components/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage :banner-icon="Icon.INSPECT" banner-title="Inspect">
    <QCard>
      <QCardSection>Inspect</QCardSection>
    </QCard>
  </ResponsivePage>
</template>
