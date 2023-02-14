<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import type { Example, Test } from '@/models/models'
import { QCard, QCardSection } from 'quasar'
import { Icon, SettingKey, TableName } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useViewDashboard from '@/use/useViewDashboard'
import ResponsivePage from '@/components/ResponsivePage.vue'
import ParentCard from '@/components/ParentCard.vue'
import IntroductionCard from '@/components/IntroductionCard.vue'

const settingsStore = useSettingsStore()
const { parentItemsSelection, parentItemsOptions, getExamples, getTests } = useViewDashboard()

const examples: Ref<Example[]> = ref([])
const tests: Ref<Test[]> = ref([])

onMounted(async () => {
  examples.value = await getExamples()
  tests.value = await getTests()
})
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DASHBOARD" banner-title="Dashboard">
    <IntroductionCard v-if="settingsStore[SettingKey.SHOW_INTRODUCTION]" class="q-mb-md" />

    <!-- Parent Items Selection -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-xs">What would you like to do?</div>

        <QOptionGroup
          v-model="parentItemsSelection"
          :options="parentItemsOptions"
          color="primary"
        />
      </QCardSection>
    </QCard>

    <!-- Parent Items List -->
    <!-- Examples -->
    <div v-if="parentItemsSelection === TableName.EXAMPLES">
      <div v-for="(example, i) in examples" :key="i">
        <ParentCard :item="example" class="q-mb-md" />
      </div>
    </div>

    <div v-else-if="parentItemsSelection === TableName.TESTS">
      <div v-for="(test, i) in tests" :key="i">
        <ParentCard :item="test" class="q-mb-md" />
      </div>
    </div>
    <!-- Other items... -->
  </ResponsivePage>
</template>
