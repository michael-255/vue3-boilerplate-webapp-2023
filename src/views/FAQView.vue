<script setup lang="ts">
import { Icon } from '@/constants/globals'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
</script>

<template>
  <ResponsivePage :banner-icon="Icon.HELP" banner-title="FAQ">
    <QCard class="q-mb-md">
      <QCardSection>Message about FAQ page.</QCardSection>
    </QCard>

    <QList bordered class="rounded-borders">
      <QExpansionItem label="How does this app work?">
        <QCard>
          <QCardSection> Test 1 </QCardSection>
        </QCard>
      </QExpansionItem>

      <QSeparator />

      <QExpansionItem label="Question?">
        <QCard>
          <QCardSection> Test 2 </QCardSection>
        </QCard>
      </QExpansionItem>

      <QSeparator />

      <QExpansionItem label="Question?">
        <QCard>
          <QCardSection> Test 3 </QCardSection>
        </QCard>
      </QExpansionItem>

      <QSeparator />

      <QExpansionItem label="Question?">
        <QCard>
          <QCardSection> Test 4 </QCardSection>
        </QCard>
      </QExpansionItem>

      <QSeparator />

      <QExpansionItem label="Question?">
        <QCard>
          <QCardSection> Test 5 </QCardSection>
        </QCard>
      </QExpansionItem>
    </QList>
  </ResponsivePage>
</template>
