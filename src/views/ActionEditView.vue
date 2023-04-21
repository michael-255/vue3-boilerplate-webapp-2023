<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { onMounted, onUnmounted } from 'vue'
import { getFieldBlueprints, getFields, getLabel } from '@/services/Blueprints'
import { AppName } from '@/types/misc'
import { useMeta } from 'quasar'
import useRoutables from '@/composables/useRoutables'
import useActionStore from '@/stores/action'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ResponsivePage from '@/components/ResponsivePage.vue'
import DB from '@/services/LocalDatabase'

useMeta({ title: `${AppName} - Edit Record` })

// Composables & Stores
const { routeDatabaseType, routeId, goBack } = useRoutables()
const { log } = useLogger()
const { confirmDialog, dismissDialog } = useDialogs()
const actionStore = useActionStore()

// Data
const fieldBlueprints = getFieldBlueprints(routeDatabaseType)

onMounted(async () => {
  try {
    actionStore.record[DatabaseField.TYPE] = routeDatabaseType
    actionStore.valid[DatabaseField.TYPE] = true

    if (routeId) {
      const oldRecord = await DB.getRecord(routeDatabaseType, routeId)

      if (oldRecord) {
        Object.keys(oldRecord).forEach((key) => {
          actionStore.record[key as DatabaseField] = oldRecord[key as DatabaseField]
        })
      }
    }
  } catch (error) {
    log.error('Error loading edit view', error)
  }
})

onUnmounted(() => {
  actionStore.$reset()
})

/**
 * Confirmation edits the existing record in the database. Validation dialog appears if any field inputs are invalid.
 */
async function onUpdateRecord() {
  const fields = getFields(routeDatabaseType)

  // Build record from store using only fields used by its type (ignoring others in store)
  const record = fields.reduce((acc, field) => {
    acc[field] = actionStore.record[field] as DatabaseRecord[typeof field]
    return acc
  }, {} as any) as DatabaseRecord

  // Inputs must be valid to continue
  if (actionStore.areRecordFieldsValid(fields)) {
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

          actionStore.$reset()
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
    :bannerIcon="Icon.EDIT"
    :bannerTitle="`Edit ${getLabel(routeDatabaseType, 'singular')}`"
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
        <component :is="fieldBP.component" :default="fieldBP.getDefault()" />
      </div>

      <QBtn label="Update" color="positive" :icon="Icon.SAVE" @click="onUpdateRecord()" />
    </div>
  </ResponsivePage>
</template>
