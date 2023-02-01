<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import ImportInput from '@/components/settings/inputs/ImportInput.vue'
import ExportInput from '@/components/settings/inputs/ExportInput.vue'
</script>

<template>
  <QCard flat square>
    <QCardSection>
      <div class="text-h6 q-mb-md">Import & Export</div>

      <div class="q-mb-md">You can import data into the database from a JSON file.</div>
      <ImportInput />

      <div class="q-mb-md">You can export the entire database as a JSON file.</div>
      <ExportInput />
    </QCardSection>
  </QCard>
</template>
