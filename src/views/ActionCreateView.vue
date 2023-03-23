<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField } from '@/types/database'
import {
  getFields,
  getDatabaseTypeColumnProps,
  getLabelSingular,
  getTypeFromSlug,
} from '@/services/DatabaseUtils'
import { useRoute } from 'vue-router'
import type { DatabaseRecord } from '@/types/models'
import ResponsivePage from '@/components/ResponsivePage.vue'
import useActions from '@/composables/useActions'
import useActionRecordStore from '@/stores/action-record'
import ActionInputId from '@/components/ActionInputId.vue'
import ActionInputCreatedTimestamp from '@/components/ActionInputCreatedTimestamp.vue'
import ActionInputName from '@/components/ActionInputName.vue'
import ActionInputText from '@/components/ActionInputText.vue'
import ActionInputParentId from '@/components/ActionInputParentId.vue'
import ActionInputToggle from '@/components/ActionInputToggle.vue'
import ActionInputNumber from '@/components/ActionInputNumber.vue'

const route = useRoute()
const { onCreateRecord } = useActions()
const actionRecordStore = useActionRecordStore()

const routeDatabaseType = getTypeFromSlug(route?.params?.databaseTypeSlug as string)
const routeParentId = route?.params?.[DatabaseField.PARENT_ID] as string
const bannerTitle = `Create ${getLabelSingular(routeDatabaseType)}`

const columnProps = getDatabaseTypeColumnProps(routeDatabaseType)

// TODO - Must do this before Create and Edit actions
actionRecordStore.$reset()
actionRecordStore.temp[DatabaseField.TYPE] = routeDatabaseType

// TODO
async function onCreate(record: DatabaseRecord) {
  const fields = getFields(routeDatabaseType)
  const realRecord = {} as DatabaseRecord
  // removing null fields from store record before creation
  fields.forEach((field) => {
    realRecord[field] = record[field]
  })
  await onCreateRecord(realRecord)
}
</script>

<template>
  <ResponsivePage :banner-icon="Icon.CREATE" :banner-title="bannerTitle">
    <div v-for="(item, i) in columnProps" :key="i" class="q-mb-md">
      <!-- Do NOT print the hiddenId field -->
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
    </div>

    <QBtn
      label="Create"
      color="positive"
      :icon="Icon.SAVE"
      @click="onCreate({ ...actionRecordStore.temp })"
    />
  </ResponsivePage>
</template>
