<script setup lang="ts">
import { QTable, type QTableColumn } from 'quasar'
import { Icon } from '@/types/icons'
import { DatabaseType, SettingId } from '@/types/database'
import { type Ref, ref, onMounted, onUnmounted } from 'vue'
import type { DatabaseRecord } from '@/types/models'
import { getTableColumns, getFields, getVisibleColumns } from '@/services/data-utils'
import useLogger from '@/composables/useLogger'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import useActions from '@/composables/useActions'
import useDatabase from '@/composables/useDatabase'

const { log } = useLogger()
const {
  routeDatabaseType,
  isRouteDatabaseTypeValid,
  goToCharts,
  goToInspect,
  goToEdit,
  goToCreate,
  goBack,
} = useRoutingHelpers()
const { onDeleteRecord } = useActions()
const { getRecord, liveDataType } = useDatabase()

// TODO
const columns: Ref<QTableColumn[]> = ref(getTableColumns(routeDatabaseType as DatabaseType) ?? [])
// TODO
const columnOptions: Ref<QTableColumn[]> = ref(
  columns.value.filter((col: QTableColumn) => !col.required)
)
const visibleColumns: Ref<string[]> = ref([])
const rows: Ref<DatabaseRecord[]> = ref([])
const searchFilter: Ref<string> = ref('')

// TODO
const subscription = liveDataType(routeDatabaseType as DatabaseType).subscribe({
  next: (records) => {
    rows.value = records
  },
  error: (error) => {
    log.error('Error during data retrieval', error)
  },
})

// TODO
onMounted(async () => {
  try {
    if (!isRouteDatabaseTypeValid()) {
      throw new Error(`Invalid route databaseType: ${routeDatabaseType}`)
    }

    const showAllDataColumns = (
      await getRecord(DatabaseType.SETTING, SettingId.SHOW_ALL_DATA_COLUMNS)
    )?.value

    // This sets up what is currently visible on the data table
    if (showAllDataColumns) {
      visibleColumns.value = getFields(routeDatabaseType as DatabaseType) ?? [] // All columns
    } else {
      visibleColumns.value = getVisibleColumns(routeDatabaseType as DatabaseType) ?? [] // Default columns
    }
  } catch (error) {
    log.error('Error loading orphaned records view', error)
  }
})

// TODO
onUnmounted(() => {
  subscription.unsubscribe()
})

// TODO
function getRecordsCountText() {
  const count = rows?.value?.length ?? 0

  if (count === 1) {
    return '1 record found'
  } else {
    return `${count} records found`
  }
}
</script>

<template>
  <QTable
    :rows="rows"
    :columns="columns"
    :visible-columns="visibleColumns"
    :rows-per-page-options="[0]"
    :filter="searchFilter"
    virtual-scroll
    fullscreen
    row-key="id"
  >
    <!-- Column Headers -->
    <template v-slot:header="props">
      <QTr :props="props">
        <!-- Do not show "hiddenType" and "hiddenId" -->
        <QTh
          v-for="col in props.cols"
          v-show="col.name !== 'hiddenType' && col.name !== 'hiddenId'"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </QTh>
        <QTh auto-width class="text-left">Actions</QTh>
      </QTr>
    </template>

    <!-- Rows -->
    <template v-slot:body="props">
      <QTr :props="props">
        <QTd v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </QTd>
      </QTr>
    </template>

    <template v-slot:top>
      <div class="row justify-start full-width q-mb-md">
        <div class="col-10 text-h6 ellipsis">{{ routeDatabaseType || 'No Data Found' }}</div>
        <QBtn
          round
          flat
          class="absolute-top-right q-mr-sm q-mt-sm"
          :icon="Icon.CLOSE"
          @click="goBack()"
        />
      </div>

      <div class="row justify-start full-width">
        <div class="col-12">
          <!-- SEARCH -->
          <QInput
            :disable="!rows.length"
            outlined
            dense
            clearable
            debounce="300"
            v-model="searchFilter"
            placeholder="Search"
          >
            <template v-slot:append>
              <QIcon name="search" />
            </template>
          </QInput>
        </div>
      </div>
    </template>

    <template v-slot:bottom>{{ getRecordsCountText() }}</template>
  </QTable>
</template>
