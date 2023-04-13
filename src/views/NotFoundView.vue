<script setup lang="ts">
import { AppText } from '@/types/misc'
import { useMeta } from 'quasar'
import ResponsivePage from '@/components/ResponsivePage.vue'

useMeta({
  title: `${AppText.APP_NAME} - 404`,
  meta: {
    description: { name: 'description', content: '404 Page' },
  },
})
</script>

<template>
  <ResponsivePage>
    <QCard>
      <QCardSection class="bg-negative text-white">
        <div class="text-h3">404</div>
        <div class="text-subtitle1">Page Not Found</div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
