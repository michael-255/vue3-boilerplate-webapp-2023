<script setup lang="ts">
import { QCard, QCardSection, QBtn } from 'quasar'
import { Icon, RouteName } from '@/constants/globals'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'

const parentActionsText = `Primary items define the name, description, status, and other information about the item.`
const recordActionsText = `Record items have the fields that hold the data that the Primary item expects it to store.
The relationship is one Primary item to many Record items.`
</script>

<template>
  <ResponsivePage :banner-icon="Icon.EXAMPLES" banner-title="Page (WIP)">
    <QCard flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Primary Items</div>
        <div class="q-mb-md">{{ parentActionsText }}</div>

        <div class="row q-col-gutter-md justify-start">
          <div class="col-4">
            <QBtn
              stack
              no-caps
              label="Data"
              class="full-width"
              :icon="Icon.TABLE"
              color="info"
              :to="{ name: RouteName.DATA, params: { tableSlug: 'examples' } }"
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
      </QCardSection>
    </QCard>

    <QCard flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Record Items</div>
        <div class="q-mb-md">{{ recordActionsText }}</div>

        <div class="row q-col-gutter-md justify-start">
          <div class="col-4">
            <QBtn
              stack
              no-caps
              label="Data"
              class="full-width"
              :icon="Icon.TABLE"
              color="info"
              :to="{ name: RouteName.DATA, params: { tableSlug: 'example-records' } }"
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

    <!-- App Item Card -->
    <!-- TODO - Shows for Settings, Logs, and Images -->
    <QCard flat class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Application Setting Items</div>
        <div class="q-mb-md">
          This data has limited access to ensure the application functions as expected.
        </div>

        <div class="row q-col-gutter-md justify-start">
          <div class="col-4">
            <QBtn stack no-caps label="Data" class="full-width" :icon="Icon.TABLE" color="info" />
          </div>
        </div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
