<script setup lang="ts">
import { QBtn } from 'quasar'
import { Icon, AppColor, TableName } from '@/constants/globals'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useLogger from '@/use/useLogger'
import useDBSettings from '@/use/useDBSettings'
import useDBShared from '@/use/useDBShared'

const { log } = useLogger()
const { confirmDialog } = useSimpleDialogs()
const { initializeSettings } = useDBSettings()
const { clearTable } = useDBShared()

async function onClearAll(): Promise<void> {
  confirmDialog(
    'Clear All',
    'Permanetly remove all app data from the database?',
    Icon.DELETE,
    AppColor.ERROR,
    async (): Promise<void> => {
      try {
        await Promise.all(Object.values(TableName).map((table) => clearTable(table as TableName)))
        await initializeSettings()
      } catch (error) {
        log.error('Error clearing all tables', error)
      }
    }
  )
}
</script>

<template>
  <!-- Div ensures this item will stack on screen -->
  <div>
    <QBtn square label="Clear All" :color="AppColor.ERROR" @click="onClearAll()" />
  </div>
</template>
