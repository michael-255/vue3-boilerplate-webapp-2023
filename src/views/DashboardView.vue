<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import { Icon, SettingKey, TableName } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useDashboard from '@/use/useDashboard'
import ResponsivePage from '@/components/ResponsivePage.vue'
import TESTParentCard from '@/components/TESTParentCard.vue'
import IntroductionCard from '@/components/IntroductionCard.vue'

const settingsStore = useSettingsStore()
const { examples, tests, parentItemsSelection, parentItemsOptions } = useDashboard()
// TODO - Add functions to useDashboard that handle setting up the previous records and more
// TODO - Add component comment about using v-show instead of v-if
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
        <TESTParentCard
          class="q-mb-md"
          :table-name="TableName.EXAMPLES"
          :id="example.id"
          :name="example.name"
          :favorite="example.favorite"
          :temp-date="example.createdTimestamp"
        />
      </div>
    </div>

    <div v-show="parentItemsSelection === TableName.TESTS">
      <div v-for="(test, i) in tests" :key="i">
        <TESTParentCard
          class="q-mb-md"
          :table-name="TableName.TESTS"
          :id="test.id"
          :name="test.name"
          :favorite="test.favorite"
          :temp-date="test.createdTimestamp"
        />
      </div>
    </div>
  </ResponsivePage>
</template>
