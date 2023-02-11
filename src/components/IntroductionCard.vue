<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import { Icon } from '@/constants/globals'
import useIntroduction from '@/use/useIntroduction'

const { onCloseIntroduction } = useIntroduction()
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">Introduction</div>

      <div class="q-mb-md">
        <div>WORK IN PROGRESS</div>
        <div>- Where certain pages are and how to get to them</div>
        <div>- How to favorite things</div>
        <div>- How to use the menu</div>
        <div>- How some Settings work</div>
        <div>- How to change the Dashboard parent list</div>
        <div>- Get users up-to-speed on the app ASAP</div>
      </div>

      <QBtn
        label="Got it!"
        class="full-width"
        size="lg"
        color="positive"
        :icon="Icon.RECOMMEND"
        @click="onCloseIntroduction()"
      />
    </QCardSection>
  </QCard>
</template>
