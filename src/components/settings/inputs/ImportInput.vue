<script setup lang="ts">
import { QFile, QBtn } from 'quasar'
import { type Ref, ref } from 'vue'
import { Icon, AppColor, TableName } from '@/constants/globals'
import useSimpleDialogs from '@/use/useSimpleDialogs'
import useLogger from '@/use/useLogger'
import useDBShared from '@/use/useDBShared'

const { log, consoleDebug } = useLogger()
const { confirmDialog } = useSimpleDialogs()
const { importItems } = useDBShared()

const file: Ref<any> = ref(null)
const fileSizeLimit = 100000000 // 100 mega bytes

/**
 * Called when a file has been rejected by the input.
 * @param entries
 */
function onRejectedFile(entries: any): void {
  const fileName = entries[0]?.file?.name || undefined
  log.warn(`Cannot import "${fileName}"`, entries)
}

/**
 * Confirm if you want to import your data from a JSON file.
 */
function onImport(): void {
  confirmDialog(
    'Import',
    `Import file "${file.value.name}" and attempt to load data from it?`,
    Icon.INFO,
    AppColor.INFO,
    async (): Promise<void> => {
      try {
        await confirmedFileImport()
        file.value = null // Clear input
      } catch (error) {
        log.error('Import failed', error)
      }
    }
  )
}

/**
 * Imports data properties it can parse that are defined below.
 */
async function confirmedFileImport(): Promise<void> {
  const parsedFileData = JSON.parse(await file.value.text())

  // Use table keys as guide for what data can be imported
  const tableKeys = Object.values(TableName)

  // Only retrieve data stored under a matching table key
  const importData = tableKeys.reduce(
    (o, key: TableName) => ({ ...o, [key]: parsedFileData[key] || [] }),
    {} as any
  )

  consoleDebug('importData =', importData)

  await Promise.all(
    tableKeys.map((table: TableName) => {
      // Logs and Settings are NOT imported
      if (table !== TableName.SETTINGS && table !== TableName.LOGS) {
        importItems(table, importData[table])
      }
    })
  )

  log.info('Imported available data with exclusions')
}
</script>

<template>
  <QFile
    v-model="file"
    dense
    outlined
    counter
    bottom-slots
    label="File"
    :max-file-size="fileSizeLimit"
    accept="application/json"
    @rejected="onRejectedFile"
  >
    <template v-slot:before>
      <QBtn
        :disable="!file"
        square
        label="Import"
        color="primary"
        class="q-mr-xs"
        @click="onImport()"
      />
    </template>

    <template v-slot:after>
      <QIcon :name="Icon.CLOSE" @click.stop="file = null" class="cursor-pointer" />
    </template>
  </QFile>
</template>
