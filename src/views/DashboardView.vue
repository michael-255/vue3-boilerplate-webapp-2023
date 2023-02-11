<script setup lang="ts">
import { QCard, QCardSection, QBtn } from 'quasar'
import { Icon, SettingKey, TableName } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useViewDashboard from '@/use/useViewDashboard'
import ResponsivePage from '@/components/ResponsivePage.vue'
import { type Ref, ref, onMounted } from 'vue'
import type { IDBExample } from '@/models/models'
import ParentCard from '@/components/ParentCard.vue'

const settingsStore = useSettingsStore()
const { parentListSelection, parentListOptions, getExamples, onCloseIntroduction } =
  useViewDashboard()

const examples: Ref<IDBExample[]> = ref([])

onMounted(async () => {
  examples.value = await getExamples()
})
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DASHBOARD" banner-title="Dashboard">
    <!-- Introduction -->
    <QCard v-if="settingsStore[SettingKey.SHOW_INTRODUCTION]" class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Introduction</div>

        <!-- TODO -->
        <div class="q-mb-md">
          <div>WORK IN PROGRESS</div>
          <div>- What type of site this is (static, no login, you control your data)</div>
          <div>- Where certain pages are and how to get to them</div>
          <div>- How to favorite things</div>
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

    <!-- List Selection -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">List Selection</div>
        <div class="q-mb-md">Select the Parent items you want to appear below.</div>

        <QOptionGroup v-model="parentListSelection" :options="parentListOptions" color="primary" />
      </QCardSection>
    </QCard>

    <!-- Parent Items List -->
    <!-- Examples -->
    <div v-if="parentListSelection === TableName.EXAMPLES">
      <div v-for="(example, i) in examples" :key="i">
        <ParentCard :item="example" class="q-mb-md" />
      </div>
    </div>
    <!-- Other items... -->
  </ResponsivePage>
</template>
