<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField, DatabaseType } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { onMounted, type Ref, ref } from 'vue'
import type { Optional } from '@/types/misc'
import useLogger from '@/composables/useLogger'
import useDatabase from '@/composables/useDatabase'
import useActions from '@/composables/useActions'
import useRouteParams from '@/composables/useRouteParams'
import useActionRecordStore from '@/stores/action-record'
import ResponsivePage from '@/components/ResponsivePage.vue'
import { getFieldBlueprints, getFields } from '@/services/data-utils'

const { routeDatabaseType, routeId } = useRouteParams()
const { log } = useLogger()
const { onUpdateRecord } = useActions()
const actionRecordStore = useActionRecordStore()
const { getRecord } = useDatabase()

const fieldBlueprints = getFieldBlueprints(routeDatabaseType as DatabaseType)

// TODO - Must do this before Create and Edit actions
actionRecordStore.$reset()
actionRecordStore.temp[DatabaseField.TYPE] = routeDatabaseType

const oldRecord: Ref<Optional<DatabaseRecord>> = ref(null)

onMounted(async () => {
  // TODO
  oldRecord.value = await getRecord(routeDatabaseType as DatabaseType, routeId)
})

// TODO
async function onUpdate(type: DatabaseType, originalId: string, record: DatabaseRecord) {
  const fields = getFields(routeDatabaseType as DatabaseType)
  const realRecord = {} as DatabaseRecord
  // removing null fields from store record before creation
  fields.forEach((field) => {
    realRecord[field] = record[field]
  })
  await onUpdateRecord(type, originalId, realRecord)
}
</script>

<template>
  <ResponsivePage :banner-icon="Icon.EDIT" banner-title="Edit">
    <div v-for="(fieldBP, i) in fieldBlueprints" :key="i" class="q-mb-md">
      <component :is="fieldBP.component" />
    </div>

    <!-- <div v-for="(item, i) in columnProps" :key="i" class="q-mb-md">
      <div v-if="item.name !== 'hiddenId'">
        <ActionInputId v-if="item.name === DatabaseField.ID" />
        <ActionInputCreatedTimestamp v-if="item.name === DatabaseField.CREATED_TIMESTAMP" />
        <ActionInputName v-if="item.name === DatabaseField.NAME" :label="item.label as any" />
        <ActionInputParentId
          v-if="item.name === DatabaseField.PARENT_ID"
          :type="routeDatabaseType"
        />
        <ActionInputText v-if="item.name === DatabaseField.TEXT" :label="item.label as any" />
        <ActionInputToggle
          v-if="item.name === DatabaseField.IS_FAVORITED"
          :label="item.label as any"
        />
        <ActionInputToggle
          v-if="item.name === DatabaseField.IS_ENABLED"
          :label="item.label as any"
        />
        <ActionInputNumber v-if="item.name === DatabaseField.NUMBER" />
      </div>
    </div> -->

    <QBtn
      label="Update"
      color="positive"
      :icon="Icon.SAVE"
      @click="onUpdate(routeDatabaseType as DatabaseType, routeId, { ...actionRecordStore.temp })"
    />
  </ResponsivePage>
</template>
