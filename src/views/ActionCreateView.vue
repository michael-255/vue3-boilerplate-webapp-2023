<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { getFieldBlueprints, getFields, getLabel } from '@/services/data-utils'
import { onMounted, onUnmounted } from 'vue'
import ResponsivePage from '@/components/ResponsivePage.vue'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import useActionRecordStore from '@/stores/action-record'
import useLogger from '@/composables/useLogger'
import useSimpleDialogs from '@/composables/useSimpleDialogs'
import useDatabase from '@/composables/useDatabase'

const { routeDatabaseType, routeParentId, goBack } = useRoutingHelpers()
const { log } = useLogger()
const { confirmDialog, dismissDialog } = useSimpleDialogs()
const { addRecord } = useDatabase()
const actionRecordStore = useActionRecordStore()

const fieldBlueprints = getFieldBlueprints(routeDatabaseType)

onMounted(() => {
  try {
    actionRecordStore.actionRecord[DatabaseField.TYPE] = routeDatabaseType
    actionRecordStore.valid[DatabaseField.TYPE] = true
  } catch (error) {
    log.error('Error loading create view', error)
  }
})

onUnmounted(() => {
  actionRecordStore.$reset()
})

// TODO
async function onCreateRecord() {
  const fields = getFields(routeDatabaseType)

  // Build record from store using only fields used by its type (ignoring others in store)
  const record = fields.reduce(
    (acc, field) => ({ ...acc, [field]: actionRecordStore.actionRecord[field] }),
    {} as DatabaseRecord
  )

  // Inputs must be valid
  if (actionRecordStore.areRecordFieldsValid(fields)) {
    confirmDialog(
      'Create Record',
      `Create record ${record[DatabaseField.ID]} for ${record[DatabaseField.TYPE]}?`,
      Icon.CREATE,
      'positive',
      async () => {
        try {
          await addRecord(record)

          log.info('Successfully created record', {
            createdRecordType: record[DatabaseField.TYPE],
            createdRecordId: record[DatabaseField.ID],
          })

          goBack()
        } catch (error) {
          log.error('Create failed', error)
        }
      }
    )
  } else {
    dismissDialog(
      'Validation Error',
      'Unable to create record. Ensure all inputs have valid entries.',
      Icon.WARN,
      'warning'
    )
  }
}

/**
 * Determines which fields are locked when a routeParentId is present.
 * Having a routeParentId means you are creating a child record for a parent record.
 * @param field
 */
function lockFields(field: DatabaseField) {
  const lockedFields = [DatabaseField.PARENT_ID, DatabaseField.CREATED_TIMESTAMP]

  if (routeParentId && lockedFields.includes(field)) {
    return true
  } else {
    return false
  }
}
</script>

<template>
  <ResponsivePage
    :banner-icon="Icon.CREATE"
    :banner-title="`Create ${getLabel(routeDatabaseType, 'singular')}`"
  >
    <!-- Error Render -->
    <div v-if="fieldBlueprints.length === 0">
      <QCard class="q-mb-md">
        <QCardSection>
          <div class="text-h6">No fields available for this record type</div>
        </QCardSection>
      </QCard>
    </div>

    <!-- Normal Page Render -->
    <div v-else>
      <div v-for="(fieldBP, i) in fieldBlueprints" :key="i" class="q-mb-md">
        <!-- Dynamic Async Components -->
        <component :is="fieldBP.component" :locked="lockFields(fieldBP.field)" />
      </div>

      <QBtn label="Create" color="positive" :icon="Icon.SAVE" @click="onCreateRecord()" />
    </div>
  </ResponsivePage>
</template>
