<script setup lang="ts">
import { QCard, QCardSection, QBtn, date } from 'quasar'
import { type ParentTable, DatabaseAction, Icon, RouteName } from '@/constants/globals'
import { slugify } from '@/utils/common'
import { useTimeAgo } from '@vueuse/core'
import useParentCard from '@/use/useParentCard'

defineProps<{
  parentTable: ParentTable
  id: string
  name: string
  favorite: boolean
  previousTimestamp?: number // Will be undefined if no records have been recorded yet
  previousNumber?: number
}>()

const { onFavorite, onUnfavorite, onDelete } = useParentCard()
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">{{ name }}</div>

      <div class="absolute-top-right q-ma-xs">
        <!-- Favorite Star -->
        <QIcon
          v-show="favorite"
          :name="Icon.FAVORITE_ON"
          color="warning"
          size="md"
          class="cursor-pointer"
          @click="onUnfavorite(parentTable, id, name)"
        />
        <QIcon
          v-show="!favorite"
          :name="Icon.FAVORITE_OFF"
          color="grey"
          size="md"
          class="cursor-pointer"
          @click="onFavorite(parentTable, id, name)"
        />

        <!-- Vertical Actions Menu -->
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
                    tableSlug: slugify(parentTable),
                    actionSlug: slugify(DatabaseAction.INSPECT),
                    id,
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
                    tableSlug: slugify(parentTable),
                    actionSlug: slugify(DatabaseAction.EDIT),
                    id,
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
                  params: { tableSlug: slugify(parentTable), id },
                }"
              >
                <QItemSection avatar>
                  <QIcon color="primary" :name="Icon.CHARTS" />
                </QItemSection>
                <QItemSection>Charts</QItemSection>
              </QItem>

              <QSeparator />

              <QItem clickable @click="onDelete(parentTable, id)">
                <QItemSection avatar>
                  <QIcon color="negative" :name="Icon.DELETE" />
                </QItemSection>
                <QItemSection>Delete</QItemSection>
              </QItem>
            </QList>
          </QMenu>
        </QBtn>
      </div>

      <!-- Time Ago Display -->
      <QBadge rounded color="secondary" class="q-py-none">
        <QIcon :name="Icon.PREVIOUS" />
        <span class="text-caption q-ml-xs">
          {{ useTimeAgo(previousTimestamp || '').value || 'No previous records' }}
        </span>
      </QBadge>

      <!-- Previous Record Created Date -->
      <div v-show="previousTimestamp">
        <QIcon :name="Icon.CALENDAR_CHECK" />
        <span class="text-caption q-ml-xs">
          {{ date.formatDate(previousTimestamp, 'ddd, YYYY MMM Do, h:mm A') }}
        </span>
      </div>

      <!-- Additional Components Slot -->
      <slot />
    </QCardSection>
  </QCard>
</template>
