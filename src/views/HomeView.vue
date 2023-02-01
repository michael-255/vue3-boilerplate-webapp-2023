<script setup lang="ts">
import { QPage } from 'quasar'
import { Icon } from '@/constants/globals'
import SectionBanner from '@/components/shared/SectionBanner.vue'
</script>

<template>
  <QPage padding>
    <SectionBanner title="Home" :icon="Icon.HOME" />
  </QPage>
</template>
