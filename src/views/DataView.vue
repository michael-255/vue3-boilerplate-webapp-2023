<script setup lang="ts">
import { QTable } from 'quasar'
import { ref } from 'vue'

const selected = ref([])
const selectModel = ref(null)
const selectOptions = ref([])

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
]
</script>

<template>
  <QTable
    flat
    square
    title="Treats"
    selection="single"
    v-model:selected="selected"
    :rows="rows"
    :columns="columns"
    row-key="name"
  >
    <template v-slot:top>
      <div class="text-h6">Examples</div>

      <QSelect
        v-model="selectModel"
        dense
        outlined
        :options="selectOptions"
        class="full-width q-mr-sm q-mb-sm"
      />

      <!-- Search Input -->
      <QInput
        outlined
        dense
        clearable
        debounce="300"
        v-model="selectModel"
        placeholder="Search"
        class="full-width q-mr-sm q-mb-sm"
      >
        <template v-slot:append>
          <QIcon name="search" />
        </template>
      </QInput>
    </template>
  </QTable>
</template>
