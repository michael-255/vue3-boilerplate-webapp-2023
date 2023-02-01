<script setup lang="ts">
import { QPage } from 'quasar'
import { Icon } from '@/constants/globals'
import BannerCard from '@/components/shared/BannerCard.vue'
</script>

<template>
  <QPage padding>
    <BannerCard title="Reports" :icon="Icon.REPORTS" />
  </QPage>
</template>
