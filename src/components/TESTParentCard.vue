<script setup lang="ts">
import { QCard, QCardSection, QBtn } from 'quasar'
import { ActionName, Icon, RouteName, TableName } from '@/constants/globals'
import { slugify } from '@/utils/common'
import { useTimeAgo } from '@vueuse/core'
import useParentCard from '@/use/useParentCard'

defineProps<{
  tableName: TableName
  id: string
  name: string
  favorite: boolean
  tempDate: number
}>()

const { onFavoriteToggle, onDelete } = useParentCard()
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
          @click="onFavoriteToggle(tableName, id, favorite)"
        />
        <QIcon
          v-show="!favorite"
          :name="Icon.FAVORITE_OFF"
          color="grey"
          size="md"
          class="cursor-pointer"
          @click="onFavoriteToggle(tableName, id, favorite)"
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
                    tableSlug: slugify(tableName),
                    actionSlug: slugify(ActionName.INSPECT),
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
                    tableSlug: slugify(tableName),
                    actionSlug: slugify(ActionName.EDIT),
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
                  params: { tableSlug: slugify(tableName), id },
                }"
              >
                <QItemSection avatar>
                  <QIcon color="primary" :name="Icon.CHARTS" />
                </QItemSection>
                <QItemSection>Charts</QItemSection>
              </QItem>

              <QSeparator />

              <QItem clickable @click="onDelete(tableName, id)">
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
          {{ useTimeAgo(tempDate || '').value || 'No previous records' }}
        </span>
      </QBadge>

      <!-- Previous Record Created Date -->
      <div>
        <QIcon :name="Icon.CALENDAR_CHECK" />
        <span class="text-caption q-ml-xs">
          {{ new Date(0).toDateString() }}
        </span>
      </div>

      <!-- Additional Components Slot -->
      <slot />
    </QCardSection>
  </QCard>
</template>
