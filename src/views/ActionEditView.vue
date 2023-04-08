<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { onMounted, onUnmounted } from 'vue'
import { getFieldBlueprints, getFields, getLabel } from '@/services/data-utils'
import useDatabase from '@/composables/useDatabase'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import useActionRecordStore from '@/stores/action-record'
import useSimpleDialogs from '@/composables/useSimpleDialogs'
import useLogger from '@/composables/useLogger'
import ResponsivePage from '@/components/ResponsivePage.vue'

const { routeDatabaseType, routeId, goBack } = useRoutingHelpers()
const { log } = useLogger()
const { confirmDialog, dismissDialog } = useSimpleDialogs()
const { getRecord, updateRecord } = useDatabase()
const actionRecordStore = useActionRecordStore()

const fieldBlueprints = getFieldBlueprints(routeDatabaseType)

onMounted(async () => {
  try {
    actionRecordStore.actionRecord[DatabaseField.TYPE] = routeDatabaseType
    actionRecordStore.valid[DatabaseField.TYPE] = true

    if (routeId) {
      const oldRecord = await getRecord(routeDatabaseType, routeId)

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

// TODO
async function onUpdateRecord() {
  const fields = getFields(routeDatabaseType)

  // Build record from store using only fields used by its type (ignoring others in store)
  const record = fields.reduce(
    (acc, field) => ({ ...acc, [field]: actionRecordStore.actionRecord[field] }),
    {} as DatabaseRecord
  )

  // Inputs must be valid to continue
  if (actionRecordStore.areRecordFieldsValid(fields)) {
    confirmDialog(
      'Update Record',
      `Update record ${record[DatabaseField.ID]} for ${record[DatabaseField.TYPE]}?`,
      Icon.EDIT,
      'positive',
      async () => {
        try {
          await updateRecord(routeDatabaseType, routeId, record)

          log.info('Successfully updated record', {
            updatedRecordType: routeDatabaseType,
            updatedRecordId: routeId,
          })

          actionRecordStore.$reset()
          goBack()
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
