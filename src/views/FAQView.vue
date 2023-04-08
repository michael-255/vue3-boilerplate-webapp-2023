<script setup lang="ts">
import { Icon } from '@/types/icons'
import ResponsivePage from '@/components/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage :banner-icon="Icon.HELP" banner-title="FAQ">
    <QList bordered class="rounded-borders">
      <QExpansionItem label="How does this app work?">
        <QCard>
          <QCardSection>
            <div class="q-mb-md">
              This web app is whats called a static website. All of your data is being stored
              locally on the device and web browser you are using the site with. This means you
              retain control of your data at all times.
            </div>
            <div>
              However, this also means you are responsible for making backups of your data by using
              the export feature in Settings to download it.
            </div>
          </QCardSection>
        </QCard>
      </QExpansionItem>

      <QSeparator />

      <QExpansionItem label="How do I move my data to another device?">
        <QCard>
          <QCardSection>
            <div class="q-mb-md">
              First, use the export feature in Settings to download your data. You'll need to email
              the exported data file to yourself so you can access it on the new device.
            </div>
            <div>
              Then, use the import feature in Settings on your new device to load your exported data
              into the app.
            </div>
          </QCardSection>
        </QCard>
      </QExpansionItem>
    </QList>
  </ResponsivePage>
</template>
