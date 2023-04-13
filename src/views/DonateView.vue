<script setup lang="ts">
import { Icon } from '@/types/icons'
import { useMeta } from 'quasar'
import ResponsivePage from '@/components/ResponsivePage.vue'

const appName = import.meta.env.VITE_APP_NAME

useMeta({
  title: `${appName} - Donate`,
  meta: {
    description: { name: 'description', content: 'Donate Page' },
  },
})
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DONATE" banner-title="Donate">
    <QCard>
      <QCardSection>
        <div class="q-mb-md">
          Hope you enjoyed using {{ appName }}. I try to create and maintain projects that people
          find useful. Please consider donating to help me out. Thank you!
        </div>

        <div class="q-mb-md">
          Donations are done through Ko-fi. It's safe, easy to use, and doesn't require an account.
        </div>

        <div class="row q-col-gutter-md justify-center">
          <div class="col-sm-6 col-xs-12">
            <QBtn
              class="full-width"
              color="warning"
              label="Donate with Ko-fi"
              target="_blank"
              href="https://ko-fi.com/"
              :icon="Icon.WEB"
            />
          </div>
        </div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
