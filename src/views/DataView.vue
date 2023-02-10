<script setup lang="ts">
import { QTable } from 'quasar'
import { Icon, RouteName, TableName } from '@/constants/globals'
import { ref } from 'vue'

const selectOptions = Object.values(TableName)
const selectModel = ref(selectOptions[0])
const searchFilter = ref('')

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: (row: any) => row.name,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
] as any[]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
  },
  {
    name: 'Eclair',
    calories: 262,
  },
  {
    name: 'Cupcake',
    calories: 305,
  },
  {
    name: 'Gingerbread',
    calories: 356,
  },
  {
    name: 'Jelly bean',
    calories: 375,
  },
  {
    name: 'Lollipop',
    calories: 392,
  },
  {
    name: 'Honeycomb',
    calories: 408,
  },
  {
    name: 'Donut',
    calories: 452,
  },
  {
    name: 'KitKat',
    calories: 518,
  },
  {
    name: 'Frozen Yogurt',
    calories: 159,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
  },
  {
    name: 'Eclair',
    calories: 262,
  },
  {
    name: 'Cupcake',
    calories: 305,
  },
  {
    name: 'KitKat',
    calories: 518,
  },
  {
    name: 'Frozen Yogurt',
    calories: 159,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
  },
  {
    name: 'Eclair',
    calories: 262,
  },
  {
    name: 'Cupcake',
    calories: 305,
  },
]
</script>

<template>
  <QTable
    :rows="rows"
    :columns="columns"
    :rows-per-page-options="[0]"
    virtual-scroll
    fullscreen
    row-key="name"
  >
    <template v-slot:top>
      <div class="row justify-start full-width q-mb-md">
        <div class="col-10 text-h6 ellipsis">Measurement Records</div>
        <QBtn
          round
          flat
          class="absolute-top-right q-mr-sm q-mt-sm"
          :icon="Icon.CLOSE"
          :to="{ name: RouteName.DASHBOARD }"
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
              <QBtn color="primary" class="q-px-sm" :icon="Icon.OPTIONS" />
            </template>

            <template v-slot:append>
              <QIcon name="search" />
            </template>
          </QInput>
        </div>
      </div>
    </template>

    <template v-slot:bottom>
      <div class="row justify-between full-width">
        <QBtn color="positive" class="q-px-sm" :icon="Icon.ADD" />
        <div class="q-mt-sm">{{ columns.length || 0 }} items found</div>
      </div>
    </template>
  </QTable>
</template>
