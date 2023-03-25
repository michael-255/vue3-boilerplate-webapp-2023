<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField, DatabaseType } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { getFieldBlueprints, getFields } from '@/services/data-utils'
import ResponsivePage from '@/components/ResponsivePage.vue'
import useActions from '@/composables/useActions'
import useRouteParams from '@/composables/useRouteParams'
import useActionRecordStore from '@/stores/action-record'
import useLogger from '@/composables/useLogger'
import useSimpleDialogs from '@/composables/useSimpleDialogs'
import useDatabase from '@/composables/useDatabase'

const { routeDatabaseType, routeParentId } = useRouteParams()
const { log } = useLogger()
const { confirmDialog, dismissDialog } = useSimpleDialogs()
const { goBack } = useActions()
const { createRecord } = useDatabase()
const actionRecordStore = useActionRecordStore()

const fieldBlueprints = getFieldBlueprints(routeDatabaseType as DatabaseType)

// TODO - Must do this before Create and Edit actions
actionRecordStore.$reset()
actionRecordStore.actionRecord[DatabaseField.TYPE] = routeDatabaseType
actionRecordStore.valid[DatabaseField.TYPE] = true

// TODO
async function onCreateRecord() {
  const fields = getFields(routeDatabaseType as DatabaseType)

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
          await createRecord(record)

          log.info('Successfully created record', {
            createdRecordType: record[DatabaseField.TYPE],
            createdRecordId: record[DatabaseField.ID],
          })

          actionRecordStore.$reset()
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
  <ResponsivePage :banner-icon="Icon.CREATE" banner-title="Create">
    <div v-for="(fieldBP, i) in fieldBlueprints" :key="i" class="q-mb-md">
      <!-- Record Type -->
      <QCard v-if="fieldBP.field === DatabaseField.TYPE" class="q-mb-md">
        <QCardSection>
          <div class="text-h6 q-mb-sm">Type</div>
          <div>{{ routeDatabaseType ?? '-' }}</div>
        </QCardSection>
      </QCard>

      <!-- Dynamic Async Components -->
      <component :is="fieldBP.component" :locked="lockFields(fieldBP.field)" />
    </div>

    <QBtn label="Create" color="positive" :icon="Icon.SAVE" @click="onCreateRecord()" />
  </ResponsivePage>
</template>
