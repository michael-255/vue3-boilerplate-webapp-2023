<script setup lang="ts">
import { AppName } from '@/types/misc'
import { useMeta } from 'quasar'
import { Icon } from '@/types/icons'
import ResponsivePage from '@/components/ResponsivePage.vue'

useMeta({ title: `${AppName} - Record Curing` })
</script>

<template>
  <ResponsivePage :bannerIcon="Icon.RECORDS" bannerTitle="Record Curing">X</ResponsivePage>
</template>
