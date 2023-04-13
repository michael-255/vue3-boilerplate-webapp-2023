<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { onMounted, onUnmounted } from 'vue'
import { getFieldBlueprints, getFields, getLabel } from '@/services/Blueprints'
import { useMeta } from 'quasar'
import useRoutables from '@/composables/useRoutables'
import useActionRecordStore from '@/stores/action-record'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ResponsivePage from '@/components/ResponsivePage.vue'
import DB from '@/services/LocalDatabase'

const appName = import.meta.env.VITE_APP_NAME

useMeta({
  title: `${appName} - Edit Record`,
  meta: {
    description: { name: 'description', content: 'Edit Record Page' },
  },
})

// Composables & Stores
const { routeDatabaseType, routeId, goBack } = useRoutables()
const { log } = useLogger()
const { confirmDialog, dismissDialog } = useDialogs()
const actionRecordStore = useActionRecordStore()

// Data
const fieldBlueprints = getFieldBlueprints(routeDatabaseType)

onMounted(async () => {
  try {
    actionRecordStore.actionRecord[DatabaseField.TYPE] = routeDatabaseType
    actionRecordStore.valid[DatabaseField.TYPE] = true

    if (routeId) {
      const oldRecord = await DB.getRecord(routeDatabaseType, routeId)

      if (oldRecord) {
        Object.keys(oldRecord).forEach((key) => {
          actionRecordStore.actionRecord[key as DatabaseField] = oldRecord[key as DatabaseField]
        })
      }
    }
  } catch (error) {
    log.error('Error loading edit view', error)
  }
})

onUnmounted(() => {
  actionRecordStore.$reset()
})

/**
 * Confirmation edits the existing record in the database. Validation dialog appears if any field inputs are invalid.
 */
async function onUpdateRecord() {
  const fields = getFields(routeDatabaseType)

  // Build record from store using only fields used by its type (ignoring others in store)
  const record = fields.reduce((acc, field) => {
    acc[field] = actionRecordStore.actionRecord[field] as DatabaseRecord[typeof field]
    return acc
  }, {} as any) as DatabaseRecord

  // Inputs must be valid to continue
  if (actionRecordStore.areRecordFieldsValid(fields)) {
    confirmDialog(
      'Update Record',
      `Update record ${record[DatabaseField.ID]} for ${record[DatabaseField.TYPE]}?`,
      Icon.EDIT,
      'positive',
      async () => {
        try {
          await DB.updateRecord(routeDatabaseType, routeId, record)

          log.info('Successfully updated record', {
            updatedRecordType: routeDatabaseType,
            updatedRecordId: routeId,
          })

          actionRecordStore.$reset()
          goBack() // Return to previous page
        } catch (error) {
          log.error('Update failed', error)
        }
      }
    )
  } else {
    dismissDialog(
      'Validation Error',
      'Unable to update record. Ensure all inputs have valid entries.',
      Icon.WARN,
      'warning'
    )
  }
}
</script>

<template>
  <ResponsivePage
    :banner-icon="Icon.EDIT"
    :banner-title="`Edit ${getLabel(routeDatabaseType, 'singular')}`"
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
        <component :is="fieldBP.component" />
      </div>

      <QBtn label="Update" color="positive" :icon="Icon.SAVE" @click="onUpdateRecord()" />
    </div>
  </ResponsivePage>
</template>
