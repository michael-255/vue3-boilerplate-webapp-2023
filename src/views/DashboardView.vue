<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import { Icon, SettingKey, RouteName, DatabaseAction } from '@/constants/globals'
import { slugify } from '@/utils/common'
import useSettingsStore from '@/stores/settings'
import useDashboard from '@/use/useDashboard'
import ResponsivePage from '@/components/ResponsivePage.vue'
import IntroductionCard from '@/components/IntroductionCard.vue'
import ExampleCard from '@/components/ExampleCard.vue'
import { getLabelSingular } from '@/services/DatabaseUtils'

const settingsStore = useSettingsStore()
const { itemRefs, parentItemsRefs, parentItemsSelection, parentItemsOptions } = useDashboard()
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
    <div v-for="(itemRef, i) in itemRefs" :key="i">
      <div v-for="(item, j) in itemRef.value" :key="j">
        <!-- TODO: Need TestCard to fix record saving issue -->
        <div v-show="parentItemsSelection === item.table">
          <ExampleCard
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

    <!-- Bottom of page message -->
    <div class="row justify-center q-my-xl">
      <div class="col-12 text-center">
        <QIcon name="menu_open" size="80px" color="grey" />
      </div>

      <div class="col-12 text-grey text-center">
        {{ parentItemsRefs?.[parentItemsSelection]?.value?.length || '0' }} items found
      </div>

      <QBtn
        class="q-mt-md"
        color="positive"
        :label="`Create ${getLabelSingular(parentItemsSelection)}`"
        :to="{
          name: RouteName.ACTIONS,
          params: {
            tableSlug: slugify(parentItemsSelection),
            actionSlug: slugify(DatabaseAction.CREATE),
          },
        }"
        :icon="Icon.CREATE"
      />
    </div>
  </ResponsivePage>
</template>
