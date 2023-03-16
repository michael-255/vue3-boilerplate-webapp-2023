<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  getActionFromSlug,
  getActionIcon,
  getTableFromSlug,
  getLabelSingular,
} from '@/services/DatabaseUtils'
import { DatabaseAction } from '@/constants/globals'
import ResponsivePage from '@/components/ResponsivePage.vue'
import ActionInspect from '@/components/ActionInspect.vue'
import ActionCreate from '@/components/ActionCreate.vue'
import ActionEdit from '@/components/ActionEdit.vue'

const route = useRoute()
const routeId = route?.params?.id as string
const routeTable = getTableFromSlug(route?.params?.tableSlug as string)
const routeAction = getActionFromSlug(route?.params?.actionSlug as string)
const routeActionIcon = getActionIcon(routeAction)
const bannerTitle = `${routeAction} ${getLabelSingular(routeTable)}`
</script>

<template>
  <ResponsivePage :banner-icon="routeActionIcon" :banner-title="bannerTitle">
    <ActionInspect
      v-if="routeAction === DatabaseAction.INSPECT"
      :table="routeTable"
      :id="routeId"
    />
    <ActionCreate v-if="routeAction === DatabaseAction.CREATE" :table="routeTable" :id="routeId" />
    <ActionEdit v-if="routeAction === DatabaseAction.EDIT" :table="routeTable" :id="routeId" />
  </ResponsivePage>
</template>
