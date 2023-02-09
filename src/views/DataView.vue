<script setup lang="ts">
import { Icon, RouteName, TableName } from '@/constants/globals'
import { QTable } from 'quasar'
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
      <div class="row justify-start full-width">
        <div class="col-9">
          <div class="text-h6">Measurement Records</div>
          <!-- Search Input -->
          <QInput
            outlined
            dense
            clearable
            debounce="300"
            v-model="searchFilter"
            placeholder="Search"
            class="q-mr-sm q-mb-sm"
          >
            <template v-slot:append>
              <QIcon name="search" />
            </template>
          </QInput>
        </div>

        <div class="col-3">
          <QBtn round color="primary" :icon="Icon.CLOSE" :to="{ name: RouteName.DASHBOARD }" />

          <QSelect
            v-model="selectModel"
            dense
            outlined
            :options="selectOptions"
            class="q-mr-sm q-mb-sm"
          />
        </div>
      </div>
    </template>
  </QTable>
</template>
