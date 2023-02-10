<script setup lang="ts">
import { Icon } from '@/constants/globals'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DONATE" banner-title="Donate">
    <QCard>
      <QCardSection>
        <div>Buy me a coffee</div>
        <div>PayPal</div>
        <div>Venmo</div>
        <div>Bitcoin</div>
        <div>Ethereum</div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
