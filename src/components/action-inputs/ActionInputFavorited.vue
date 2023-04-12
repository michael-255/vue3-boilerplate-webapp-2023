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
  actionRecordStore.actionRecord[DatabaseField.IS_FAVORITED] =
    actionRecordStore.actionRecord[DatabaseField.IS_FAVORITED] ?? false
  actionRecordStore.valid[DatabaseField.IS_FAVORITED] = true
})
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Favorited
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Toggle the record as favorited or not. Favorited records are given priority on the
        Dashboard.
      </div>

      <QToggle
        :disable="locked"
        v-model="actionRecordStore.actionRecord[DatabaseField.IS_FAVORITED]"
      />
    </QCardSection>
  </QCard>
</template>
