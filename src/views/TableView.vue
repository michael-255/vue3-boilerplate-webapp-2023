<script setup lang="ts">
import { QCard, QCardSection, QBtn } from 'quasar'
import { Icon, RouteName, TableName } from '@/constants/globals'
import { slugify } from '@/utils/common'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'

// Must define the table names below in order so the primary matches with the record table.
const primaryTables = [TableName.EXAMPLES, TableName.TESTS]
const recordTables = [TableName.EXAMPLE_RECORDS, TableName.TEST_RECORDS]

const primaryActionsText = `Define the name, description, status, and other information about the Primary item.`
const recordActionsText = `Define the fields that hold the data that the Primary item expects it to store.
The relationship is one Primary item to many Record items.`
</script>

<template>
  <ResponsivePage :banner-icon="Icon.TABLE" banner-title="Tables">
    <QCard flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Primary Items</div>
        <div class="q-mb-md">{{ primaryActionsText }}</div>
        <div class="text-h6 q-mb-md">Record Items</div>
        <div class="q-mb-md">{{ recordActionsText }}</div>
      </QCardSection>
    </QCard>

    <QCard v-for="(primaryTable, i) in primaryTables" :key="i" flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">{{ primaryTable }}</div>

        <div class="text-subtitle1 q-mb-md">Primary</div>
        <div class="row q-col-gutter-md justify-start q-mb-md">
          <div class="col-4">
            <QBtn
              stack
              no-caps
              label="Data"
              class="full-width"
              :icon="Icon.TABLE"
              color="info"
              :to="{ name: RouteName.DATA, params: { tableSlug: slugify(primaryTables[i]) } }"
            />
          </div>
          <div class="col-4">
            <QBtn
              stack
              no-caps
              label="Create"
              class="full-width"
              :icon="Icon.CREATE"
              color="positive"
            />
          </div>
          <div class="col-4">
            <QBtn
              stack
              no-caps
              label="Reports"
              class="full-width"
              :icon="Icon.REPORTS"
              color="accent"
            />
          </div>
        </div>

        <div class="text-subtitle1 q-mb-md">Record</div>
        <div class="row q-col-gutter-md justify-start">
          <div class="col-4">
            <QBtn
              stack
              no-caps
              label="Data"
              class="full-width"
              :icon="Icon.TABLE"
              color="info"
              :to="{ name: RouteName.DATA, params: { tableSlug: slugify(recordTables[i]) } }"
            />
          </div>
          <div class="col-4">
            <QBtn
              stack
              no-caps
              label="Create"
              class="full-width"
              :icon="Icon.CREATE"
              color="positive"
            />
          </div>
        </div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
