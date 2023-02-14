<script setup lang="ts">
import type { Example } from '@/models/models'
import { QCard, QCardSection, QBtn } from 'quasar'
import { ActionName, Icon, RouteName, TableName } from '@/constants/globals'
import { ref } from 'vue'
import { slugify } from '@/utils/common'

defineProps<{
  item: Example
}>()

const rating = ref(0)
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">{{ item.name }}</div>

      <QBadge rounded color="secondary" class="q-py-none">
        <QIcon :name="Icon.PREVIOUS" />
        <span class="text-caption q-ml-xs">1 day ago</span>
      </QBadge>

      <div>
        <QIcon :name="Icon.CALENDAR_CHECK" />
        <span class="text-caption q-ml-xs">
          {{ new Date(item.createdTimestamp).toDateString() }}
        </span>
      </div>

      <!-- Additional Components Slot -->
      <slot />

      <div class="absolute-top-right q-ma-xs">
        <QRating
          v-model="rating"
          :max="1"
          :icon="Icon.FAVORITE_OFF"
          :icon-selected="Icon.FAVORITE_ON"
          color="warning"
          size="md"
          class="q-mr-xs"
        />

        <QBtn round flat :icon="Icon.MENU_VERTICAL">
          <QMenu
            auto-close
            anchor="top right"
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <QList>
              <QItem
                clickable
                :to="{
                  name: RouteName.ACTIONS,
                  params: {
                    tableSlug: slugify(TableName.EXAMPLES),
                    actionSlug: slugify(ActionName.INSPECT),
                    id: item.id,
                  },
                }"
              >
                <QItemSection avatar>
                  <QIcon color="primary" :name="Icon.INSPECT" />
                </QItemSection>
                <QItemSection>Inspect</QItemSection>
              </QItem>

              <QItem
                clickable
                :to="{
                  name: RouteName.ACTIONS,
                  params: {
                    tableSlug: slugify(TableName.EXAMPLES),
                    actionSlug: slugify(ActionName.EDIT),
                    id: item.id,
                  },
                }"
              >
                <QItemSection avatar>
                  <QIcon color="primary" :name="Icon.EDIT" />
                </QItemSection>
                <QItemSection>Edit</QItemSection>
              </QItem>

              <QItem
                clickable
                :to="{
                  name: RouteName.CHARTS,
                  params: { tableSlug: slugify(TableName.EXAMPLES), id: item.id },
                }"
              >
                <QItemSection avatar>
                  <QIcon color="primary" :name="Icon.CHARTS" />
                </QItemSection>
                <QItemSection>Charts</QItemSection>
              </QItem>

              <QSeparator />

              <QItem clickable>
                <QItemSection avatar>
                  <QIcon color="negative" :name="Icon.DELETE" />
                </QItemSection>
                <QItemSection>Delete</QItemSection>
              </QItem>
            </QList>
          </QMenu>
        </QBtn>
      </div>
    </QCardSection>
  </QCard>
</template>
