<script setup lang="ts">
import { QBtn } from 'quasar'
import { Icon, AppColor } from '@/constants/globals'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useLogger from '@/use/useLogger'
import useDBShared from '@/use/useDBShared'

const { log } = useLogger()
const { confirmDialog, dismissDialog } = useSimpleDialogs()
const { deleteDatabase } = useDBShared()

/**
 * Deletes the underling Dexie Database. This removes all data, and will require a website reload.
 */
async function onDeleteDB(): Promise<void> {
  confirmDialog(
    'Delete Database',
    'Delete the underlining Dexie database? This only needs to be done to correct schema changes in newer versions of the app. All data will be lost.',
    Icon.DELETE,
    AppColor.ERROR,
    async (): Promise<void> => {
      try {
        await deleteDatabase()
        reloadMessageDialog()
      } catch (error) {
        log.error('Database deletion failed', error)
      }
    }
  )
}

function reloadMessageDialog(): void {
  dismissDialog(
    'Reload Reminder',
    'You must reload the website now to resume proper functionality.',
    Icon.WARN,
    AppColor.WARN
  )
}
</script>

<template>
  <!-- Div ensures this item will stack on screen -->
  <div>
    <QBtn square label="Delete Database" :color="AppColor.ERROR" @click="onDeleteDB()" />
  </div>
</template>
