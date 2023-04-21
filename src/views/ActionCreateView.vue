<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { getFieldBlueprints, getFields, getLabel } from '@/services/Blueprints'
import { onMounted, onUnmounted } from 'vue'
import { AppName } from '@/types/misc'
import { useMeta } from 'quasar'
import ResponsivePage from '@/components/ResponsivePage.vue'
import useRoutables from '@/composables/useRoutables'
import useActionStore from '@/stores/action'
import useLogger from '@/composables/useLogger'
import useDialogs from '@/composables/useDialogs'
import DB from '@/services/LocalDatabase'

useMeta({ title: `${AppName} - Create Record` })

// Composables & Stores
const { routeDatabaseType, routeParentId, goBack } = useRoutables()
const { log } = useLogger()
const { confirmDialog, dismissDialog } = useDialogs()
const actionStore = useActionStore()

// Data
const fieldBlueprints = getFieldBlueprints(routeDatabaseType)

onMounted(() => {
  try {
    actionStore.record[DatabaseField.TYPE] = routeDatabaseType
    actionStore.valid[DatabaseField.TYPE] = true
  } catch (error) {
    log.error('Error loading create view', error)
  }
})

onUnmounted(() => {
  actionStore.$reset()
})

/**
 * Confirmation creates a new record in the database. Validation dialog appears if any field inputs are invalid.
 */
async function onCreateRecord() {
  const fields = getFields(routeDatabaseType)

  // Build record from store using only fields used by its type (ignoring others in store)
  const record = fields.reduce((acc, field) => {
    acc[field] = actionStore.record[field] as DatabaseRecord[typeof field]
    return acc
  }, {} as any) as DatabaseRecord

  // Inputs must be valid
  if (actionStore.areRecordFieldsValid(fields)) {
    confirmDialog(
      'Create Record',
      `Create record ${record[DatabaseField.ID]} for ${record[DatabaseField.TYPE]}?`,
      Icon.CREATE,
      'positive',
      async () => {
        try {
          await DB.addRecord(record)

          log.info('Successfully created record', {
            createdRecordType: record[DatabaseField.TYPE],
            createdRecordId: record[DatabaseField.ID],
          })

          goBack() // Return to previous page
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
 * Determines which fields are locked or hidden when a routeParentId is present.
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
    :bannerIcon="Icon.CREATE"
    :bannerTitle="`Create ${getLabel(routeDatabaseType, 'singular')}`"
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
      <!-- TODO - QForm -->
      <div v-for="(fieldBP, i) in fieldBlueprints" :key="i" class="q-mb-md">
        <!-- Dynamic Async Components -->
        <component
          :is="fieldBP.component"
          :locked="lockFields(fieldBP.field)"
          :default="fieldBP.getDefault()"
        />
      </div>

      <QBtn label="Create" color="positive" :icon="Icon.SAVE" @click="onCreateRecord()" />
    </div>
  </ResponsivePage>
</template>
