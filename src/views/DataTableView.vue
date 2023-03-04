<script setup lang="ts">
import { QTable } from 'quasar'
import { DatabaseTable, Icon } from '@/constants/globals'
import { onMounted, ref, type Ref, onUnmounted } from 'vue'
import { getTableFromSlug, getTableColumnProps } from '@/services/DatabaseUtils'
import { useRoute } from 'vue-router'
import type { Subscription } from 'dexie'
import useGoBack from '@/use/useGoBack'
import useLogger from '@/use/useLogger'
import useDatabase from '@/use/useDatabase'

const route = useRoute()
const { log, consoleDebug } = useLogger()
const { onGoBack } = useGoBack()
const { liveQueryDataTable } = useDatabase()

const routeTable = getTableFromSlug(route?.params?.tableSlug as string)
const subscriptions: Ref<Subscription[]> = ref([])
const rows: Ref<any[]> = ref([])
const columns: Ref<any[]> = ref([])
const searchFilter = ref('')

onMounted(async () => {
  try {
    if (Object.values(DatabaseTable).includes(routeTable)) {
      // Setup subscription and load data
      subscriptions.value.push(
        liveQueryDataTable(routeTable).subscribe({
          next: (items: any[]) => {
            rows.value = items
            consoleDebug(`Retrieved ${routeTable}`, items)
          },
          error: (error) => {
            log.error(`Failed to retrieve ${routeTable}`, error)
          },
        })
      )
      // Load column props for table
      columns.value = getTableColumnProps(routeTable)
    } else {
      // Table is invalid
      rows.value = []
      columns.value = []
      log.error('Invalid table', { tableSlug: route?.params?.tableSlug })
    }
  } catch (error) {
    log.error('Failed to retrieve table data', error)
  }
})

onUnmounted(() => {
  subscriptions.value?.map((sub) => sub.unsubscribe())
})

/**
 * Gets the text for the number of items found for the current table.
 * @returns Items found text
 */
function getTableItemsCountText() {
  const count = rows?.value?.length || 0

  if (count === 1) {
    return '1 item found'
  } else {
    return `${count} items found`
  }
}
</script>

<template>
  <QTable
    :rows="rows"
    :columns="columns"
    :rows-per-page-options="[0]"
    virtual-scroll
    fullscreen
    no-data-label=""
    row-key="id"
  >
    <!-- Column Headers -->
    <!-- Hiding "hiddenId" so only the truncated Id* is shown -->
    <template v-slot:header="props">
      <QTr :props="props">
        <QTh
          v-show="col.name !== 'hiddenId'"
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </QTh>
        <QTh auto-width />
      </QTr>
    </template>

    <template v-slot:top>
      <div class="row justify-start full-width q-mb-md">
        <div class="col-10 text-h6 ellipsis">{{ routeTable || 'No Table Found' }}</div>
        <QBtn
          round
          flat
          class="absolute-top-right q-mr-sm q-mt-sm"
          :icon="Icon.CLOSE"
          @click="onGoBack()"
        />
      </div>

      <div class="row justify-start full-width">
        <div class="col-12">
          <QInput
            outlined
            dense
            clearable
            debounce="300"
            v-model="searchFilter"
            placeholder="Search"
          >
            <template v-slot:before>
              <QBtn color="primary" class="q-px-sm q-mr-xs" :icon="Icon.OPTIONS" />
              <QBtn color="positive" class="q-px-sm" :icon="Icon.ADD" />
            </template>

            <template v-slot:append>
              <QIcon name="search" />
            </template>
          </QInput>
        </div>
      </div>
    </template>

    <template v-slot:bottom>{{ getTableItemsCountText() }}</template>
  </QTable>
</template>
