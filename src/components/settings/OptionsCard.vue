<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import OptionToggles from '@/components/settings/inputs/OptionToggles.vue'
import TestLoggerButton from '@/components/settings/buttons/TestLoggerButton.vue'
</script>

<template>
  <QCard flat square>
    <QCardSection>
      <div class="text-h6 q-mb-md">Options</div>

      <div class="q-mb-md">
        <span>Dark Mode allows you to switch between a light or dark themed app.</span>
        <span>
          Show Console Logs will display all log messages in the developer console when turned on.
        </span>
        <span>Show Debug Messages will display debug level notification alerts when on.</span>
        <span>
          Save Info Messages will save info level messages in the logs table of the database for
          later review.
        </span>
      </div>

      <OptionToggles class="q-mb-lg" />
      <TestLoggerButton />
    </QCardSection>
  </QCard>
</template>
