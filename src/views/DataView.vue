<script setup lang="ts">
import { QTable } from 'quasar'
import {
  getFields,
  getVisibleColumns,
  getDatabaseTypeColumnProps,
  getSupportedActions,
  getTypeFromSlug,
} from '@/services/DatabaseUtils'
import { Icon } from '@/types/icons'
import { DatabaseAction, DatabaseField, SettingId } from '@/types/database'
import { type Ref, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { DatabaseRecord } from '@/types/models'
import type { ColumnProps } from '@/types/frontend'
import useLogger from '@/composables/useLogger'
import useActions from '@/composables/useActions'
import useDatabase from '@/composables/useDatabase'

const route = useRoute()
const { log, consoleDebug } = useLogger()
const { goToCharts, goToInspect, goToEdit, goToCreate, goBack, onDeleteRecord } = useActions()
const { getSetting, liveDataType } = useDatabase()

// TODO
const routeTable = getTypeFromSlug(route?.params?.databaseTypeSlug as string)
const rows: Ref<DatabaseRecord[]> = ref([])
const columns: Ref<ColumnProps[]> = ref(getDatabaseTypeColumnProps(routeTable) ?? [])
// TODO
const columnOptions: Ref<ColumnProps[]> = ref(
  columns.value.filter(
    (col: ColumnProps) =>
      !col.required && col.name !== DatabaseField.TYPE && col.name !== DatabaseField.ID
  )
)
const visibleColumns: Ref<string[]> = ref([])
const searchFilter: Ref<string> = ref('')

// TODO
const subscription = liveDataType(routeTable).subscribe({
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
    const showAllDataColumns = (await getSetting(SettingId.SHOW_ALL_DATA_COLUMNS))?.value

    // This sets up what is currently visible on the data table
    if (showAllDataColumns) {
      // All columns
      const allCols = getFields(routeTable)
      consoleDebug('All columns', allCols)
      visibleColumns.value = allCols
    } else {
      // Default columns
      const visibleCols = getVisibleColumns(routeTable)
      consoleDebug('Default columns', visibleCols)
      visibleColumns.value = visibleCols
    }
  } catch (error) {
    log.error('Failed to retrieve visible columns', error)
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
    :columns="columns as any"
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
        <!-- Hiding "hiddenId" so only the truncated Id* is shown -->
        <QTh
          v-show="col.name !== 'hiddenId'"
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </QTh>
        <QTh auto-width>Actions</QTh>
      </QTr>
    </template>

    <!-- Rows -->
    <template v-slot:body="props">
      <QTr :props="props">
        <QTd v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </QTd>
        <QTd auto-width>
          <!-- CHARTS -->
          <QBtn
            v-if="getSupportedActions(routeTable).includes(DatabaseAction.CHARTS)"
            flat
            round
            dense
            class="q-ml-xs"
            color="accent"
            :icon="Icon.CHARTS"
            @click="goToCharts(props.cols[0].value, props.cols[1].value)"
          />
          <!-- INSPECT -->
          <QBtn
            flat
            round
            dense
            class="q-ml-xs"
            color="primary"
            :icon="Icon.INSPECT"
            @click="goToInspect(props.cols[0].value, props.cols[1].value)"
          />
          <!-- EDIT -->
          <QBtn
            v-if="getSupportedActions(routeTable).includes(DatabaseAction.EDIT)"
            flat
            round
            dense
            class="q-ml-xs"
            color="orange-9"
            :icon="Icon.EDIT"
            @click="goToEdit(props.cols[0].value, props.cols[1].value)"
          />
          <!-- DELETE -->
          <QBtn
            v-if="getSupportedActions(routeTable).includes(DatabaseAction.DELETE)"
            flat
            round
            dense
            class="q-ml-xs"
            color="negative"
            @click="onDeleteRecord(props.cols[0].value, props.cols[1].value)"
            :icon="Icon.DELETE"
          />
        </QTd>
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
            <template v-slot:before>
              <!-- CREATE -->
              <QBtn
                v-if="getSupportedActions(routeTable).includes(DatabaseAction.CREATE)"
                color="positive"
                class="q-px-sm q-mr-xs"
                :icon="Icon.ADD"
                @click="goToCreate(routeTable)"
              />
              <!-- OPTIONS (Visible Columns) -->
              <QSelect
                v-model="visibleColumns"
                :options="columnOptions"
                :disable="!rows.length"
                bg-color="primary"
                standout
                multiple
                dense
                options-dense
                emit-value
                map-options
                option-value="name"
                display-value=""
              >
                <template v-slot:prepend>
                  <QIcon color="white" :name="Icon.OPTIONS" />
                </template>
              </QSelect>
            </template>

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
