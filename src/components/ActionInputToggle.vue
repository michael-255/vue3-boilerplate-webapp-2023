<script setup lang="ts">
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'

const props = defineProps<{
  locked?: boolean
  oldToggle?: boolean
  label: 'Favorite' | 'Enabled'
}>()

const actionRecordStore = useActionRecordStore()

// Default component state must be valid
if (props.label === 'Favorite') {
  actionRecordStore.temp[DatabaseField.IS_FAVORITED] = props.oldToggle ? props.oldToggle : false
  actionRecordStore.valid[DatabaseField.IS_FAVORITED] = true
} else if (props.label === 'Enabled') {
  actionRecordStore.temp[DatabaseField.IS_ENABLED] = props.oldToggle ? props.oldToggle : false
  actionRecordStore.valid[DatabaseField.IS_ENABLED] = true
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        {{ label }}
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div v-if="label === 'Favorite'" class="q-mb-md">TODO Favorite</div>
      <div v-if="label === 'Enabled'" class="q-mb-md">TODO Enabled</div>

      <QToggle
        v-if="label === 'Favorite'"
        :disable="locked"
        v-model="actionRecordStore.temp[DatabaseField.IS_FAVORITED]"
      />
      <QToggle
        v-if="label === 'Enabled'"
        :disable="locked"
        v-model="actionRecordStore.temp[DatabaseField.IS_ENABLED]"
      />
    </QCardSection>
  </QCard>
</template>
