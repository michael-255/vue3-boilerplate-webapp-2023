<script setup lang="ts">
import { QTable, type QTableColumn } from 'quasar'
import { Icon } from '@/types/icons'
import { DatabaseType } from '@/types/database'
import { type Ref, ref, onMounted, onUnmounted } from 'vue'
import type { DatabaseRecord } from '@/types/models'
import { idColumn, requiredHiddenColumns, typeColumn } from '@/services/table-columns'
import useLogger from '@/composables/useLogger'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import useActions from '@/composables/useActions'
import useDatabase from '@/composables/useDatabase'

const { log } = useLogger()
const { goBack } = useRoutingHelpers()
const { onDeleteRecord } = useActions()
const { liveDataType } = useDatabase()

// TODO
const columns: Ref<QTableColumn[]> = ref([...requiredHiddenColumns(), typeColumn(), idColumn()])
const rows: Ref<DatabaseRecord[]> = ref([])
const searchFilter: Ref<string> = ref('')

// TODO
const subscription = liveDataType(DatabaseType.LOG).subscribe({
  next: (records) => {
    rows.value = records
    // TODO - Get Unused and Orphaned records
    // TODO - Only need to include the Type and Id
  },
  error: (error) => {
    log.error('Error during orphaned records retrieval', error)
  },
})

// TODO
onMounted(async () => {
  try {
    //
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
        <div class="col-10 text-h6 ellipsis">Orphaned Records</div>
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
