<script setup lang="ts">
import { DatabaseField } from '@/types/database'
import { Icon } from '@/types/icons'
import { onMounted } from 'vue'
import AppDefault from '@/services/AppDefaults'
import useActionStore from '@/stores/action'

// Props & Emits
defineProps<{
  locked?: boolean
}>()

// Composables & Stores
const actionStore = useActionStore()

onMounted(() => {
  actionStore.record[DatabaseField.IS_FAVORITED] =
    actionStore.record[DatabaseField.IS_FAVORITED] ?? AppDefault[DatabaseField.IS_FAVORITED]
  actionStore.valid[DatabaseField.IS_FAVORITED] = true
})
</script>

<template>
  <QCard v-show="!locked">
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Favorited
        <QIcon v-if="locked" :name="Icon.LOCK" color="warning" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">
        Toggle the record as favorited or not. Favorited records are given priority on the
        Dashboard.
      </div>

      <QToggle :disable="locked" v-model="actionStore.record[DatabaseField.IS_FAVORITED]" />
    </QCardSection>
  </QCard>
</template>
