<script setup lang="ts">
import { Icon } from '@/types/icons'
import { DatabaseField, DatabaseType } from '@/types/database'
import {
  getFields,
  getDatabaseTypeColumnProps,
  getLabelSingular,
  getTypeFromSlug,
} from '@/services/DatabaseUtils'
import { useRoute } from 'vue-router'
import type { DatabaseRecord } from '@/types/models'
import { onMounted, type Ref, ref } from 'vue'
import type { Optional } from '@/types/misc'
import useLogger from '@/composables/useLogger'
import useDatabase from '@/composables/useDatabase'
import useActions from '@/composables/useActions'
import useActionRecordStore from '@/stores/action-record'
import ResponsivePage from '@/components/ResponsivePage.vue'
import ActionInputId from '@/components/ActionInputId.vue'
import ActionInputCreatedTimestamp from '@/components/ActionInputCreatedTimestamp.vue'
import ActionInputName from '@/components/ActionInputName.vue'
import ActionInputText from '@/components/ActionInputText.vue'
import ActionInputParentId from '@/components/ActionInputParentId.vue'
import ActionInputToggle from '@/components/ActionInputToggle.vue'
import ActionInputNumber from '@/components/ActionInputNumber.vue'

const route = useRoute()
const { log } = useLogger()
const { onUpdateRecord } = useActions()
const actionRecordStore = useActionRecordStore()
const { getRecord } = useDatabase()

const routeDatabaseType = getTypeFromSlug(route?.params?.databaseTypeSlug as string)
const routeId = route?.params?.[DatabaseField.ID] as string
const bannerTitle = `Edit ${getLabelSingular(routeDatabaseType)}`

const columnProps = getDatabaseTypeColumnProps(routeDatabaseType)

// TODO - Must do this before Create and Edit actions
actionRecordStore.$reset()
actionRecordStore.temp[DatabaseField.TYPE] = routeDatabaseType

const oldRecord: Ref<Optional<DatabaseRecord>> = ref(null)

onMounted(async () => {
  // TODO
  oldRecord.value = await getRecord(routeDatabaseType, routeId)
})

// TODO
async function onUpdate(type: DatabaseType, originalId: string, record: DatabaseRecord) {
  const fields = getFields(routeDatabaseType)
  const realRecord = {} as DatabaseRecord
  // removing null fields from store record before creation
  fields.forEach((field) => {
    realRecord[field] = record[field]
  })
  await onUpdateRecord(type, originalId, realRecord)
}
</script>

<template>
  <ResponsivePage :banner-icon="Icon.CREATE" :banner-title="bannerTitle">
    <div v-for="(item, i) in columnProps" :key="i" class="q-mb-md">
      <!-- Do NOT print the hiddenId field -->
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
    </div>

    <QBtn
      label="Update"
      color="positive"
      :icon="Icon.SAVE"
      @click="onUpdate(routeDatabaseType, routeId, { ...actionRecordStore.temp })"
    />
  </ResponsivePage>
</template>
