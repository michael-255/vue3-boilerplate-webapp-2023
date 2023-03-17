<script setup lang="ts">
import { Icon } from '@/types/icons'
import ResponsivePage from '@/components/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage :banner-icon="Icon.EDIT" banner-title="Edit">
    <QCard>
      <QCardSection>Edit</QCardSection>
    </QCard>
  </ResponsivePage>
</template>
