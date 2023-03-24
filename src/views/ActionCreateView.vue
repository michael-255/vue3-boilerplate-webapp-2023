<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField, DatabaseType } from '@/types/database'
import type { DatabaseRecord } from '@/types/models'
import { getFieldBlueprints, getFields } from '@/services/data-utils'
import ResponsivePage from '@/components/ResponsivePage.vue'
import useActions from '@/composables/useActions'
import useRouteParams from '@/composables/useRouteParams'
import useActionRecordStore from '@/stores/action-record'

const { routeDatabaseType, routeParentId } = useRouteParams()
const { onCreateRecord } = useActions()
const actionRecordStore = useActionRecordStore()

const fieldBlueprints = getFieldBlueprints(routeDatabaseType as DatabaseType)

// TODO - Must do this before Create and Edit actions
actionRecordStore.$reset()
actionRecordStore.temp[DatabaseField.TYPE] = routeDatabaseType

// TODO
async function onCreate(record: DatabaseRecord) {
  const fields = getFields(routeDatabaseType as DatabaseType)
  const realRecord = {} as DatabaseRecord
  // removing null fields from store record before creation
  fields.forEach((field) => {
    realRecord[field] = record[field]
  })
  await onCreateRecord(realRecord)
}
</script>

<template>
  <ResponsivePage :banner-icon="Icon.CREATE" banner-title="Create">
    <div v-for="(fieldBP, i) in fieldBlueprints" :key="i" class="q-mb-md">
      <component :is="fieldBP.component" />
    </div>

    <!-- <div v-for="(item, i) in columnProps" :key="i" class="q-mb-md">
      <div v-if="item.name !== 'hiddenId'">
        <ActionInputId v-if="item.name === DatabaseField.ID" />
        <ActionInputCreatedTimestamp
          v-if="item.name === DatabaseField.CREATED_TIMESTAMP"
          :locked="routeParentId ? true : false"
        />
        <ActionInputName v-if="item.name === DatabaseField.NAME" :label="item.label as any" />
        <ActionInputParentId
          v-if="item.name === DatabaseField.PARENT_ID"
          :locked="routeParentId ? true : false"
          :oldParentId="routeParentId"
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
      label="Create"
      color="positive"
      :icon="Icon.SAVE"
      @click="onCreate({ ...actionRecordStore.temp })"
    />
  </ResponsivePage>
</template>
