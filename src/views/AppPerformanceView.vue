<script setup lang="ts">
import { AppName } from '@/types/misc'
import { useMeta } from 'quasar'
import { Icon } from '@/types/icons'
import ResponsivePage from '@/components/ResponsivePage.vue'

useMeta({ title: `${AppName} - App Performance` })
</script>

<template>
  <ResponsivePage :bannerIcon="Icon.RECORDS" bannerTitle="App Performance">X</ResponsivePage>
</template>
