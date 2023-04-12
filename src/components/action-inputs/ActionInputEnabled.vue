<script setup lang="ts">
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import useActionRecordStore from '@/stores/action-record'
import { onMounted } from 'vue'

// Props & Emits
defineProps<{
  locked?: boolean
}>()

// Composables & Stores
const actionRecordStore = useActionRecordStore()

onMounted(() => {
  actionRecordStore.actionRecord[DatabaseField.IS_ENABLED] =
    actionRecordStore.actionRecord[DatabaseField.IS_ENABLED] ?? true
  actionRecordStore.valid[DatabaseField.IS_ENABLED] = true
})
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Enabled
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Toggle the record as enabled or not. Only enabled records will appear on the Dashboard.
      </div>

      <QToggle
        :disable="locked"
        v-model="actionRecordStore.actionRecord[DatabaseField.IS_ENABLED]"
      />
    </QCardSection>
  </QCard>
</template>
