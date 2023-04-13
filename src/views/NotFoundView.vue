<script setup lang="ts">
import { useMeta } from 'quasar'
import ResponsivePage from '@/components/ResponsivePage.vue'

const appName = import.meta.env.VITE_APP_NAME

useMeta({
  title: `${appName} - 404`,
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
