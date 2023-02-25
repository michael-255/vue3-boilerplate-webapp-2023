<script setup lang="ts">
import { QCard, date } from 'quasar'
import { DatabaseField, type AppObject, type DatabaseTable } from '@/constants/globals'
import { onMounted, ref, type Ref } from 'vue'
import { truncateString } from '@/utils/common'
import useDatabase from '@/use/useDatabase'
import { getFields } from '@/services/DatabaseUtils'

const props = defineProps<{
  table: DatabaseTable
  id: string
}>()

const { getItemById } = useDatabase()

const item: Ref<AppObject | null> = ref(null)
const fields = getFields(props.table)

onMounted(async () => {
  item.value = (await getItemById(props.table, props.id)) as AppObject
})
</script>

<template>
  <!-- Setting Fields -->
  <QCard v-if="fields.includes(DatabaseField.KEY) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Key</div>

      <div>{{ item[DatabaseField.KEY] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.VALUE) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Value</div>

      <div>{{ item[DatabaseField.VALUE] }}</div>
    </QCardSection>
  </QCard>

  <!-- Log Fields -->
  <QCard v-if="fields.includes(DatabaseField.AUTO_ID) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Auto Id</div>

      <div>{{ item[DatabaseField.AUTO_ID] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.TIMESTAMP) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Timestamp</div>

      <div>{{ item[DatabaseField.TIMESTAMP] }}</div>
      <div>
        {{ date.formatDate(item[DatabaseField.TIMESTAMP], 'dddd, YYYY MMM Do, h:mm A') }}
      </div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.SEVERITY) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Severity</div>

      <div>{{ item[DatabaseField.SEVERITY] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.APP_NAME) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Application Name</div>

      <div>{{ item[DatabaseField.APP_NAME] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.LABEL) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Label</div>

      <div>{{ item[DatabaseField.LABEL] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.DETAILS) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Details</div>

      <div>{{ item[DatabaseField.DETAILS] }}</div>
    </QCardSection>
  </QCard>

  <!-- Entity Fields -->
  <QCard v-if="fields.includes(DatabaseField.ID) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Id</div>

      <div>{{ item[DatabaseField.ID] }}</div>
      <div>{{ truncateString(item[DatabaseField.ID], 8, '*') }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.CREATED_TIMESTAMP) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Created Date</div>

      <div>{{ item[DatabaseField.CREATED_TIMESTAMP] }}</div>
      <div>
        {{ date.formatDate(item[DatabaseField.CREATED_TIMESTAMP], 'dddd, YYYY MMM Do, h:mm A') }}
      </div>
    </QCardSection>
  </QCard>

  <!-- Parent Fields -->
  <QCard v-if="fields.includes(DatabaseField.NAME) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Name</div>

      <div>{{ item[DatabaseField.NAME] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.DESCRIPTION) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Description</div>

      <div>{{ item[DatabaseField.DESCRIPTION] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.PARENT_STATUS) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Parent Status</div>

      <div>{{ item[DatabaseField.PARENT_STATUS] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.FAVORITE) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Favorite</div>

      <div>{{ item[DatabaseField.FAVORITE] ? 'Yes' : 'No' }}</div>
    </QCardSection>
  </QCard>

  <!-- Record Fields -->
  <QCard v-if="fields.includes(DatabaseField.PARENT_ID) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-sm">Parent Id</div>

      <div>{{ item[DatabaseField.PARENT_ID] }}</div>
      <div>{{ truncateString(item[DatabaseField.PARENT_ID], 8, '*') }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.RECORD_STATUS) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Record Status</div>

      <div>{{ item[DatabaseField.RECORD_STATUS] }}</div>
    </QCardSection>
  </QCard>

  <QCard v-if="fields.includes(DatabaseField.NOTE) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Note</div>

      <div>{{ item[DatabaseField.NOTE] }}</div>
    </QCardSection>
  </QCard>

  <!-- Example & Test Fields -->
  <QCard v-if="fields.includes(DatabaseField.EXAMPLE_MESSAGE) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Example Message</div>

      <div>{{ item[DatabaseField.EXAMPLE_MESSAGE] }}</div>
    </QCardSection>
  </QCard>

  <!-- Example & Test Record Fields -->
  <QCard v-if="fields.includes(DatabaseField.EXAMPLE_NUMBER) && item" class="q-mb-md">
    <QCardSection>
      <div class="text-h6 q-mb-md">Example Number</div>

      <div>{{ item[DatabaseField.EXAMPLE_NUMBER] }}</div>
    </QCardSection>
  </QCard>
</template>
