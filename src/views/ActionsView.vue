<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getActionFromSlug, getActionIcon, getTableFromSlug } from '@/services/DatabaseUtils'
import ResponsivePage from '@/components/ResponsivePage.vue'
import ActionInspect from '@/components/ActionInspect.vue'
import { DatabaseAction } from '@/constants/globals'

const route = useRoute()

const routeId = route?.params?.id as string
const routeTable = getTableFromSlug(route?.params?.tableSlug as string)
const routeAction = getActionFromSlug(route?.params?.actionSlug as string)
const routeActionIcon = getActionIcon(routeAction)
</script>

<template>
  <ResponsivePage :banner-icon="routeActionIcon" :banner-title="routeAction">
    <!-- Inspect -->
    <ActionInspect
      v-if="routeAction === DatabaseAction.INSPECT"
      :table="routeTable"
      :id="routeId"
    />

    <!-- Edit -->
    <QCard v-if="routeAction === DatabaseAction.EDIT">
      <QCardSection> Edit Components TODO</QCardSection>
    </QCard>

    <!-- Create -->
    <QCard v-if="routeAction === DatabaseAction.CREATE">
      <QCardSection> Create Components TODO </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
