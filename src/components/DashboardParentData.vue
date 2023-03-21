<script setup lang="ts">
import { QCard, QCardSection, QBtn, date } from 'quasar'
import { slugify } from '@/utils/common'
import { useTimeAgo } from '@vueuse/core'
import { DatabaseField, type DatabaseParentType, type DatabaseType } from '@/types/database'
import { Icon } from '@/types/icons'
import { RouteName } from '@/router/route-names'
import useLogger from '@/composables/useLogger'
import useSimpleDialogs from '@/composables/useSimpleDialogs'
import useDatabase from '@/composables/useDatabase'

defineProps<{
  type: DatabaseParentType
  id: string
  name: string
  isFavorite: boolean
  // Will be undefined if no records have been recorded yet
  previousText?: string
  previousTimestamp?: number
}>()

const { log } = useLogger()
const { confirmDialog, dismissDialog } = useSimpleDialogs()
const { updateRecord, deleteRecord } = useDatabase()

// TODO
async function viewPreviousNote(note: string) {
  dismissDialog('Previous Note', note, Icon.NOTE, 'info')
}

// TODO
async function onFavorite(type: DatabaseParentType, id: string, name: string) {
  confirmDialog(
    'Favorite',
    `Do you want to favorite ${name}?`,
    Icon.FAVORITE_ON,
    'info',
    async () => {
      try {
        await updateRecord(type, id, { [DatabaseField.IS_FAVORITED]: true })
        log.info(`${name} favorited`, { favoritedRecordType: type, favoritedRecordId: id })
      } catch (error) {
        log.error('Favorite update failed', error)
      }
    }
  )
}

// TODO
async function onUnfavorite(type: DatabaseParentType, id: string, name: string) {
  confirmDialog(
    'Unfavorite',
    `Do you want to unfavorite ${name}?`,
    Icon.FAVORITE_OFF,
    'info',
    async () => {
      try {
        await updateRecord(type, id, { [DatabaseField.IS_FAVORITED]: false })
        log.info(`${name} unfavorited`, {
          unfavoritedRecordType: type,
          unfavoritedRecordId: id,
        })
      } catch (error) {
        log.error('Unfavorite update failed', error)
      }
    }
  )
}

// TODO
async function onDelete(type: DatabaseType, id: string): Promise<void> {
  confirmDialog(
    'Delete',
    `Permanently delete item ${id} from ${type}?`,
    Icon.DELETE,
    'negative',
    async () => {
      try {
        await deleteRecord(type, id)
        log.info('Successfully deleted item', { deletedRecordType: type, deletedRecordId: id })
      } catch (error) {
        log.error('Delete failed', error)
      }
    }
  )
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">{{ name }}</div>

      <div class="absolute-top-right q-ma-xs">
        <!-- Note -->
        <QIcon
          v-show="previousText"
          :name="Icon.NOTE"
          color="primary"
          size="md"
          class="cursor-pointer q-mr-xs"
          @click="viewPreviousNote(previousText || '')"
        />

        <!-- Favorite Star -->
        <QIcon
          v-show="isFavorite"
          :name="Icon.FAVORITE_ON"
          color="warning"
          size="md"
          class="cursor-pointer"
          @click="onUnfavorite(type, id, name)"
        />
        <QIcon
          v-show="!isFavorite"
          :name="Icon.FAVORITE_OFF"
          color="grey"
          size="md"
          class="cursor-pointer"
          @click="onFavorite(type, id, name)"
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
                  name: RouteName.ACTION_INSPECT,
                  params: {
                    databaseTypeSlug: slugify(type),
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
                  name: RouteName.ACTION_EDIT,
                  params: {
                    databaseTypeSlug: slugify(type),
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
                  name: RouteName.ACTION_CHARTS,
                  params: { databaseTypeSlug: slugify(type), id },
                }"
              >
                <QItemSection avatar>
                  <QIcon color="primary" :name="Icon.CHARTS" />
                </QItemSection>
                <QItemSection>Charts</QItemSection>
              </QItem>

              <QSeparator />

              <QItem clickable @click="onDelete(type, id)">
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
