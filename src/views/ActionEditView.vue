<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField, DatabaseType } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { onMounted } from 'vue'
import { getFieldBlueprints, getFields } from '@/services/data-utils'
import useDatabase from '@/composables/useDatabase'
import useActions from '@/composables/useActions'
import useRouteParams from '@/composables/useRouteParams'
import useActionRecordStore from '@/stores/action-record'
import useSimpleDialogs from '@/composables/useSimpleDialogs'
import useLogger from '@/composables/useLogger'
import ResponsivePage from '@/components/ResponsivePage.vue'

const { routeDatabaseType, routeId } = useRouteParams()
const { log } = useLogger()
const { goBack } = useActions()
const { confirmDialog, dismissDialog } = useSimpleDialogs()
const actionRecordStore = useActionRecordStore()
const { getRecord, updateRecord } = useDatabase()

const fieldBlueprints = getFieldBlueprints(routeDatabaseType as DatabaseType)

// TODO - Must do this before Create and Edit actions
onMounted(async () => {
  actionRecordStore.$reset()
  actionRecordStore.actionRecord[DatabaseField.TYPE] = routeDatabaseType
  actionRecordStore.valid[DatabaseField.TYPE] = true

  const oldRecord = await getRecord(routeDatabaseType as DatabaseType, routeId)

  if (oldRecord) {
    Object.keys(oldRecord).forEach((key) => {
      actionRecordStore.actionRecord[key as DatabaseField] = oldRecord[key as DatabaseField]
    })
  }
})

// TODO
async function onUpdateRecord() {
  const fields = getFields(routeDatabaseType as DatabaseType)

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
          await updateRecord(routeDatabaseType as DatabaseType, routeId, record)

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
  <ResponsivePage :banner-icon="Icon.EDIT" banner-title="Edit">
    <div v-for="(fieldBP, i) in fieldBlueprints" :key="i" class="q-mb-md">
      <!-- Record Type -->
      <QCard v-if="fieldBP.field === DatabaseField.TYPE" class="q-mb-md">
        <QCardSection>
          <div class="text-h6 q-mb-sm">Type</div>
          <div>{{ routeDatabaseType ?? '-' }}</div>
        </QCardSection>
      </QCard>

      <!-- Dynamic Async Components -->
      <component :is="fieldBP.component" />
    </div>

    <QBtn label="Update" color="positive" :icon="Icon.SAVE" @click="onUpdateRecord()" />
  </ResponsivePage>
</template>
