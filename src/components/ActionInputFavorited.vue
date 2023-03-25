<script setup lang="ts">
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'

defineProps<{
  locked?: boolean
}>()

const actionRecordStore = useActionRecordStore()

// Default component state must be valid
if (
  actionRecordStore.actionRecord[DatabaseField.IS_FAVORITED] === undefined ||
  actionRecordStore.actionRecord[DatabaseField.IS_FAVORITED] === null
) {
  actionRecordStore.actionRecord[DatabaseField.IS_FAVORITED] = false
}
actionRecordStore.valid[DatabaseField.IS_FAVORITED] = true
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Favorited
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Favorited</div>

      <QToggle
        :disable="locked"
        v-model="actionRecordStore.actionRecord[DatabaseField.IS_FAVORITED]"
      />
    </QCardSection>
  </QCard>
</template>
