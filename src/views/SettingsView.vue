<script setup lang="ts">
import { QPage, QCard, QCardSection } from 'quasar'
import { Icon } from '@/constants/globals'
// import OptionsCard from '@/components/settings/OptionsCard.vue'
// import DefaultsCard from '@/components/settings/DefaultsCard.vue'
// import ImportExportCard from '@/components/settings/ImportExportCard.vue'
// import ConverterCard from '@/components/settings/ConverterCard.vue'
// import DangerZoneCard from '@/components/settings/DangerZoneCard.vue'
</script>

<template>
  <QPage padding>
    <!-- Settings Banner -->
    <QCard class="q-mb-sm">
      <QCardSection class="text-h5 text-white bg-primary">
        <QIcon class="q-pb-xs q-pr-xs" :name="Icon.SETTINGS" />
        Settings
      </QCardSection>
    </QCard>

    <!-- <OptionsCard class="q-mb-sm" />
    <DefaultsCard class="q-mb-sm" />
    <ImportExportCard class="q-mb-sm" />
    <ConverterCard class="q-mb-sm" />
    <DangerZoneCard /> -->
  </QPage>
</template>
