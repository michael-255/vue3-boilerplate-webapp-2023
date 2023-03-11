<script setup lang="ts">
import { DatabaseField, Icon } from '@/constants/globals'
import useItemsStore from '@/stores/items'

defineProps<{
  locked?: boolean
}>()

const itemsStore = useItemsStore()

// Default component state must be valid
itemsStore.newItem[DatabaseField.FAVORITE] = itemsStore?.oldItem?.[DatabaseField.FAVORITE]
  ? itemsStore.oldItem[DatabaseField.FAVORITE]
  : false
itemsStore.validateItem[DatabaseField.FAVORITE] = true
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Favorite
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Favorite</div>

      <QToggle :disable="locked" v-model="itemsStore.newItem[DatabaseField.FAVORITE]" />
    </QCardSection>
  </QCard>
</template>
