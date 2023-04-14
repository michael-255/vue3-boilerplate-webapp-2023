<script setup lang="ts">
import { type Ref, ref, onUnmounted } from 'vue'
import { AppName } from '@/types/misc'
import { useMeta, type QTableColumn } from 'quasar'
import { Icon } from '@/types/icons'
import type { CurableRecord } from '@/types/misc'
import { DatabaseField, RecordIssue } from '@/types/database'
import { requiredTypeColumn } from '@/services/blueprints/table-columns'
import { requiredIdColumn } from '@/services/blueprints/table-columns'
import { typeColumn } from '@/services/blueprints/table-columns'
import { partialIdColumn } from '@/services/blueprints/table-columns'
import { getRecordsCountDisplay } from '@/utils/common'
import useLogger from '@/composables/useLogger'
import useActions from '@/composables/useActions'
import useRoutables from '@/composables/useRoutables'
import DB from '@/services/LocalDatabase'

useMeta({ title: `${AppName} - Record Curing` })

// Composables & Stores
const { log } = useLogger()
const { goToInspect, goToEdit, goBack } = useRoutables()
const { onDeleteRecord } = useActions()

// Data
const columns: Ref<QTableColumn[]> = ref([
  requiredTypeColumn,
  requiredIdColumn,
  typeColumn,
  partialIdColumn,
  // Custom record issue cloumn for Record Curing page only
  {
    name: 'recordIssue',
    label: 'Record Issue',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.recordIssue,
    format: (val: RecordIssue) => `${val}`,
  } as QTableColumn,
])
const columnOptions: Ref<QTableColumn[]> = ref(
  columns.value.filter((col: QTableColumn) => !col.required)
)
const visibleColumns: Ref<string[]> = ref([DatabaseField.TYPE, DatabaseField.ID, 'recordIssue'])
const rows: Ref<CurableRecord[]> = ref([])
const searchFilter: Ref<string> = ref('')

const subscription = DB.liveRecordCuring().subscribe({
  next: async (records) => {
    // TODO: Need to collect the records with issues only (might have to do each manaully in here)
    // - Parent: Unused or Missing Required Data (all parent types)
    // - Child: Orphaned or Missing Required Data (all child types)
    const curableRecords: CurableRecord[] = records
      .filter(async (record) => await DB.isRecordUnused(record))
      .map((record) => {
        // TODO - Everything is getting flagged as unused... this needs work
        return {
          [DatabaseField.TYPE]: record.type,
          [DatabaseField.ID]: record.id,
          recordIssue: RecordIssue.UNUSED,
        } as CurableRecord
      })

    rows.value = curableRecords
  },
  error: (error) => {
    log.error('Error during data retrieval', error)
  },
})

onUnmounted(() => {
  subscription.unsubscribe()
})
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
        <QTd auto-width>
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
        <!-- Tabel Title -->
        <div class="col-10 text-h6 ellipsis">Record Curing</div>
        <!-- Go Back Button -->
        <QBtn
          round
          flat
          class="absolute-top-right q-mr-sm q-mt-sm"
          :icon="Icon.BACK"
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

    <template v-slot:bottom>{{ getRecordsCountDisplay(rows) }}</template>
  </QTable>
</template>
