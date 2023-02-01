<script setup lang="ts">
import { QPage } from 'quasar'
import { Icon } from '@/constants/globals'
import SectionBanner from '@/components/shared/SectionBanner.vue'
import OptionsCard from '@/components/settings/OptionsCard.vue'
import DefaultsCard from '@/components/settings/DefaultsCard.vue'
import ImportExportCard from '@/components/settings/ImportExportCard.vue'
import DangerZoneCard from '@/components/settings/DangerZoneCard.vue'
</script>

<template>
  <QPage padding>
    <SectionBanner title="Settings" :icon="Icon.SETTINGS" />

    <OptionsCard class="q-mb-sm" />
    <DefaultsCard class="q-mb-sm" />
    <ImportExportCard class="q-mb-sm" />
    <DangerZoneCard />
  </QPage>
</template>
