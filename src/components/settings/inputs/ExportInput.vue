<script setup lang="ts">
import { exportFile, QInput, QBtn } from 'quasar'
import { type Ref, ref } from 'vue'
import { Icon, AppColor, TableName } from '@/constants/globals'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useLogger from '@/use/useLogger'
import useDBShared from '@/use/useDBShared'

const { log, consoleDebug } = useLogger()
const { confirmDialog } = useSimpleDialogs()
const { getTable } = useDBShared()

const exportText: Ref<string> = ref('')

/**
 * Confirm if you want to export your data as a JSON file.
 */
function onExport(): void {
  let filename = `export-${new Date().toISOString().split('T')[0]}`
  if (exportText.value && exportText.value.length) {
    filename = exportText.value
  }
  filename += '.json'

  confirmDialog(
    'Export',
    `Export the file "${filename}" with your data?`,
    Icon.INFO,
    AppColor.INFO,
    async (): Promise<void> => {
      try {
        await confirmedFileExport(filename)
        exportText.value = '' // Clear input
      } catch (error) {
        log.error('Export failed', error)
      }
    }
  )
}

/**
 * Exports the tables listed in the function as a JSON file.
 * @param filename
 */
async function confirmedFileExport(filename: string): Promise<void> {
  // Use table keys as guide for what data can be exported
  const tableKeys = Object.values(TableName)

  // Get all data from each table
  const tableData = await Promise.all(tableKeys.map((table) => getTable(table as TableName)))

  // Converting the data array into a object with table names as keys
  const exportData = tableKeys.reduce((o, key, i) => ({ ...o, [key]: tableData[i] }), {})

  consoleDebug('exportData =', exportData)

  // Attempt to download the export data
  const fileStatus = exportFile(filename, JSON.stringify(exportData), {
    encoding: 'UTF-8',
    mimeType: 'application/json',
  })

  if (fileStatus === true) {
    log.info('File downloaded succesfully')
  } else {
    throw new Error('Browser denied file download')
  }
}
</script>

<template>
  <QInput v-model="exportText" dense outlined placeholder="Filename">
    <template v-slot:before>
      <QBtn square label="Export" color="primary" class="q-mr-xs" @click="onExport()" />
    </template>

    <template v-slot:after>
      <QIcon :name="Icon.CLOSE" @click.stop="exportText = ''" class="cursor-pointer" />
    </template>
  </QInput>
</template>
