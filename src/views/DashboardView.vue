<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import { Icon, SettingKey, TableName } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useDashboard from '@/use/useDashboard'
import ResponsivePage from '@/components/ResponsivePage.vue'
import IntroductionCard from '@/components/IntroductionCard.vue'
import ExampleCard from '@/components/ExampleCard.vue'

const settingsStore = useSettingsStore()
const { examples, tests, parentItemsSelection, parentItemsOptions } = useDashboard()
// TODO - Add comments about using v-show instead of v-if
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DASHBOARD" banner-title="Dashboard">
    <IntroductionCard v-if="settingsStore[SettingKey.SHOW_INTRODUCTION]" class="q-mb-md" />

    <!-- Parent Items Selection -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-xs">What would you like to work on?</div>

        <QOptionGroup
          v-model="parentItemsSelection"
          :options="parentItemsOptions"
          color="primary"
        />
      </QCardSection>
    </QCard>

    <!-- Parent Items List -->
    <div v-show="parentItemsSelection === TableName.EXAMPLES">
      <div v-for="(example, i) in examples" :key="i">
        <ExampleCard
          class="q-mb-md"
          :parent-table="TableName.EXAMPLES"
          :id="example.id"
          :name="example.name"
          :favorite="example.favorite"
          :previous-timestamp="example.previousTimestamp"
        />
      </div>
    </div>

    <div v-show="parentItemsSelection === TableName.TESTS">
      <div v-for="(test, i) in tests" :key="i">
        <ExampleCard
          class="q-mb-md"
          :parent-table="TableName.TESTS"
          :id="test.id"
          :name="test.name"
          :favorite="test.favorite"
          :previous-timestamp="test.previousTimestamp"
        />
      </div>
    </div>
  </ResponsivePage>
</template>
