<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import { Icon, SettingKey, RouteName, DatabaseAction } from '@/constants/globals'
import { slugify } from '@/utils/common'
import { getLabelSingular } from '@/services/DatabaseUtils'
import useSettingsStore from '@/stores/settings'
import useDashboard from '@/use/useDashboard'
import ResponsivePage from '@/components/ResponsivePage.vue'
import IntroductionCard from '@/components/IntroductionCard.vue'

const settingsStore = useSettingsStore()
const {
  itemRefs,
  itemComponents,
  parentListSelection,
  parentListOptions,
  getDashboardItemsCountText,
} = useDashboard()
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DASHBOARD" banner-title="Dashboard">
    <IntroductionCard v-if="settingsStore[SettingKey.SHOW_INTRODUCTION]" class="q-mb-md" />

    <!-- Parent Items Selection -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-xs">What would you like to work on?</div>

        <QOptionGroup v-model="parentListSelection" :options="parentListOptions" color="primary" />
      </QCardSection>
    </QCard>

    <!-- Parent Items List -->
    <div v-for="(itemRef, i) in itemRefs" :key="i">
      <div v-for="(item, j) in itemRef.value" :key="j">
        <!-- Using v-show so the DOM doesn't get updated when switching the parent selection -->
        <div v-show="parentListSelection === item.table">
          <component
            v-if="item.table === item.table"
            :is="itemComponents[parentListSelection]"
            class="q-mb-md"
            :parent-table="item.table"
            :id="item.id"
            :name="item.name"
            :favorite="item.favorite"
            :previous-timestamp="item.previousTimestamp"
            :previous-number="item.previousNumber"
          />
        </div>
      </div>
    </div>

    <!-- Bottom of page message and create button -->
    <div class="row justify-center q-my-xl">
      <div class="col-12 text-center">
        <QIcon name="menu_open" size="80px" color="grey" />
      </div>

      <div class="col-12 text-grey text-center">{{ getDashboardItemsCountText() }}</div>

      <QBtn
        class="q-mt-md"
        color="positive"
        :label="`Create ${getLabelSingular(parentListSelection)}`"
        :to="{
          name: RouteName.ACTIONS,
          params: {
            tableSlug: slugify(parentListSelection),
            actionSlug: slugify(DatabaseAction.CREATE),
          },
        }"
        :icon="Icon.CREATE"
      />
    </div>
  </ResponsivePage>
</template>
