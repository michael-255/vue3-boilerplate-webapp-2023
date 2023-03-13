<script setup lang="ts">
import { QTable } from 'quasar'
import { DatabaseAction, Icon, RouteName } from '@/constants/globals'
import { getSupportedActions } from '@/services/DatabaseUtils'
import { slugify } from '@/utils/common'
import useGoBack from '@/use/useGoBack'
import useDataTable from '@/use/useDataTable'

const {
  routeTable,
  rows,
  columns,
  columnOptions,
  visibleColumns,
  searchFilter,
  getTableItemsCountText,
  onDelete,
} = useDataTable()
const { onGoBack } = useGoBack()
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
            :to="{
              name: RouteName.CHARTS,
              params: {
                tableSlug: slugify(routeTable),
                id: props.cols[0].value,
              },
            }"
          />
          <!-- INSPECT -->
          <QBtn
            v-if="getSupportedActions(routeTable).includes(DatabaseAction.INSPECT)"
            flat
            round
            dense
            class="q-ml-xs"
            color="primary"
            :icon="Icon.INSPECT"
            :to="{
              name: RouteName.ACTIONS,
              params: {
                tableSlug: slugify(routeTable),
                actionSlug: slugify(DatabaseAction.INSPECT),
                id: props.cols[0].value,
              },
            }"
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
            :to="{
              name: RouteName.ACTIONS,
              params: {
                tableSlug: slugify(routeTable),
                actionSlug: slugify(DatabaseAction.EDIT),
                id: props.cols[0].value,
              },
            }"
          />
          <!-- DELETE -->
          <QBtn
            v-if="getSupportedActions(routeTable).includes(DatabaseAction.DELETE)"
            flat
            round
            dense
            class="q-ml-xs"
            color="negative"
            @click="onDelete(props.cols[0].value)"
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
          @click="onGoBack()"
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
                :to="{
                  name: RouteName.ACTIONS,
                  params: {
                    tableSlug: slugify(routeTable),
                    actionSlug: slugify(DatabaseAction.CREATE),
                  },
                }"
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

    <template v-slot:bottom>{{ getTableItemsCountText() }}</template>
  </QTable>
</template>
