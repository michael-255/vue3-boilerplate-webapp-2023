<script setup lang="ts">
import type { Example, ExampleRecord } from '@/models/models'
import type { AnyModel } from '@/constants/types'
import type { IndexableType } from 'dexie'
import { QCard, QCardSection, QBtn } from 'quasar'
import { ActionName, Field, Icon, RouteName, TableName } from '@/constants/globals'
import { type Ref, onMounted, ref, computed } from 'vue'
import { slugify } from '@/utils/common'
import { useTimeAgo } from '@vueuse/core'
import { dexieWrapper } from '@/services/DexieWrapper'
import useLogger from '@/use/useLogger'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useDatabaseCommon from '@/use/useDatabaseCommon'

const props = defineProps<{
  tableName: TableName
  item: Example
}>()

const { log } = useLogger()
const { confirmDialog } = useSimpleDialogs()
const { deleteItem } = useDatabaseCommon()

const previousRecord: Ref<ExampleRecord | undefined> = ref(undefined)

onMounted(async () => {
  previousRecord.value = await getNewestExampleRecord(TableName.EXAMPLE_RECORDS, props.item.id)
})

/**
 * Get most recent item by table and field value.
 * @param table
 * @param field
 * @param value
 * @returns Single item or undefined
 */
async function getNewestExampleRecord(
  tableName: TableName,
  parentId: string
): Promise<ExampleRecord | undefined> {
  return (
    await dexieWrapper
      .table(tableName)
      .where(Field.PARENT_ID)
      .equalsIgnoreCase(parentId)
      .sortBy(Field.CREATED_TIMESTAMP)
  ).reverse()[0]
}

/**
 * Update provided properties on table item by the originalId.
 * @param tableName
 * @param originalId
 * @param props
 * @returns 1 on a successful update
 */
async function updateItem(
  tableName: TableName,
  originalId: string,
  props: Partial<AnyModel>
): Promise<IndexableType> {
  return await dexieWrapper.table(tableName).update(originalId, props)
}

const rating = computed({
  get() {
    return props.item.favorite ? 1 : 0
  },
  async set(num: number) {
    log.info('Favorites updated')
    await updateItem(props.tableName, props.item.id, { favorite: num === 1 ? true : false })
  },
})

const timeAgo = useTimeAgo(props.item?.createdTimestamp || '')

async function onDelete(id: string): Promise<void> {
  confirmDialog(
    'Delete',
    `Permanently delete item ${id} from ${props.tableName}?`,
    Icon.DELETE,
    'negative',
    async () => {
      try {
        await deleteItem(props.tableName, id)
        log.info(`Successfully deleted item ${id}`)
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
      <div class="text-h6 q-mb-md">{{ item.name }}</div>

      <QBadge rounded color="secondary" class="q-py-none">
        <QIcon :name="Icon.PREVIOUS" />
        <span class="text-caption q-ml-xs">{{ timeAgo || 'No previous records' }}</span>
      </QBadge>

      <div>
        <QIcon :name="Icon.CALENDAR_CHECK" />
        <span class="text-caption q-ml-xs">
          {{ new Date(previousRecord?.createdTimestamp || 0).toDateString() }}
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
                    tableSlug: slugify(tableName),
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
                    tableSlug: slugify(tableName),
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
                  params: { tableSlug: slugify(tableName), id: item.id },
                }"
              >
                <QItemSection avatar>
                  <QIcon color="primary" :name="Icon.CHARTS" />
                </QItemSection>
                <QItemSection>Charts</QItemSection>
              </QItem>

              <QSeparator />

              <QItem clickable @click="onDelete(item.id)">
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
