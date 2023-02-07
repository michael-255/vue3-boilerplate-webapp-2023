<script setup lang="ts">
import { QCard, QCardSection, QBtn, date } from 'quasar'
import { Icon, SettingKey, RouteName } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useDashboard from '@/use/useDashboard'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'

const settingsStore = useSettingsStore()
const { parentListSelection, onCloseIntroduction } = useDashboard()

const groupOptions = [
  {
    label: 'Examples',
    value: 'examples',
  },
  {
    label: 'Tests',
    value: 'tests',
  },
]
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DASHBOARD" banner-title="Dashboard">
    <!-- Introduction -->
    <QCard v-if="settingsStore[SettingKey.SHOW_INTRODUCTION]" flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Introduction</div>

        <!-- TODO -->
        <div class="q-mb-md">
          <div>WORK IN PROGRESS</div>
          <div>- What type of site this is (static, no login, you control your data)</div>
          <div>- Where certain pages are and how to get to them</div>
          <div>- How to favorite things</div>
        </div>

        <!-- TODO - TEMP - For Testing -->
        <div class="q-mb-md">
          {{ date.formatDate(new Date(), 'YYYY MM DD HH mm ss SSSZ') }}
        </div>

        <!-- TODO - TEMP - For Testing -->
        <div class="q-mb-md">
          <QBtn
            label="Actions"
            :icon="Icon.EDIT"
            color="warning"
            :to="{
              name: RouteName.ACTIONS,
              params: { tableSlug: 'examples', actionSlug: 'create' },
            }"
          />
        </div>

        <!-- TODO - TEMP - For Testing -->
        <div class="q-mb-md">
          <QBtn
            label="Charts"
            :icon="Icon.CHARTS"
            color="accent"
            :to="{
              name: RouteName.CHARTS,
              params: { tableSlug: 'examples', id: 'test-123' },
            }"
          />
        </div>

        <QBtn
          label="Got it!"
          :icon="Icon.RECOMMEND"
          color="positive"
          @click="onCloseIntroduction()"
        />
      </QCardSection>
    </QCard>

    <!-- List Selection -->
    <QCard flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">List Selection</div>
        <div class="q-mb-md">
          Select the Parent items you want to appear in the Dashboard list below.
        </div>

        <QOptionGroup v-model="parentListSelection" :options="groupOptions" color="primary" />
      </QCardSection>
    </QCard>

    <!-- Parent Items List -->
    <QCard flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Defaults</div>
        <div class="q-mb-md">TODO</div>
        <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
      </QCardSection>
    </QCard>
    <QCard flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Defaults</div>
        <div class="q-mb-md">TODO</div>
        <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
      </QCardSection>
    </QCard>
    <QCard flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Defaults</div>
        <div class="q-mb-md">TODO</div>
        <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
