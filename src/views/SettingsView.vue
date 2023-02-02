<script setup lang="ts">
import { QPage, QSelect, QBtn } from 'quasar'
import { Icon, TableName, AppLimits } from '@/constants/globals'
import useSettingsView from '@/use/useSettingsView'

const {
  introduction,
  darkMode,
  showConsoleLogs,
  showDebugMessages,
  saveInfoMessages,
  importFile,
  accessTableModel,
  accessTableOptions,
  deleteDataModel,
  deleteDataOptions,
  onTestLogger,
  onRejectedFile,
  onImportFile,
  onExportData,
  onDeleteTableData,
  onDeleteAllData,
  onDeleteDatabase,
} = useSettingsView()

// Options
const introductionText = `Introduction provides instructions on the Home page on how to use the app.`
const darkModeText = `Dark Mode allows you to switch between a light or dark theme for the app.`

// Defaults
const defaultExamplesText = `Load default Examples into the database.`

// Data Management
const importText = `Import data into the database from a JSON file. The app expects the data in the file to be
structured the same as the exported version.`
const exportText = `Export the entire database as a JSON file. Do this on a regularly basis so you have a backup of your
data.`
const accessTableText = `Select a table and access it directly in a data table format. This gives you access to
operations for individual records for most tables.`

// Logging
const showConsoleLogsText = `Show Console Logs will display all log messages in the developer console.`
const showDebugMessagesText = `Show Debug Messages will display debug level notification alerts.`
const saveInfoMessagesText = `Save Info Messages will save info level messages in the logs table of the database for
later review.`
const testLoggerText = `Validate that your logging settings above are working as expected by using the test action
below.`

// DANGER ZONE
const dangerZoneText = `The following operations cannot be undone. Consider exporting your data before proceeding.`
const deleteTableDataText = `Select a table and permanently delete all of its data.`
const deleteAllDataText = `Permanently delete all data from the database.`
const deleteDatabaseText = `Delete the underlining database and all of its data (requires website reload).`
</script>

<template>
  <QPage padding>
    <!-- Banner -->
    <QCard flat square class="q-mb-sm">
      <QCardSection class="text-h5">
        <QIcon class="q-pb-xs q-pr-xs" :name="Icon.SETTINGS" />
        Settings
      </QCardSection>
    </QCard>

    <!--##### Options #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Options</div>

        <!-- Toggles -->
        <div class="q-mb-md">{{ introductionText }}</div>
        <QToggle v-model="introduction" class="q-mb-md" label="Introduction" />

        <div class="q-mb-md">{{ darkModeText }}</div>
        <QToggle v-model="darkMode" label="Dark Mode" />
      </QCardSection>
    </QCard>

    <!--##### Defaults #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Defaults</div>

        <!-- Examples -->
        <div class="q-mb-md">{{ defaultExamplesText }}</div>
        <QBtn square label="Examples" :icon="Icon.EXAMPLES" color="primary" />
      </QCardSection>
    </QCard>

    <!--##### Data Management #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Data Management</div>

        <!-- Import -->
        <div class="q-mb-md">{{ importText }}</div>
        <QFile
          v-model="importFile"
          dense
          outlined
          counter
          bottom-slots
          label="File Select"
          :max-file-size="AppLimits.FILESIZE"
          accept="application/json"
          @rejected="onRejectedFile"
        >
          <template v-slot:before>
            <QBtn
              :disable="!importFile"
              square
              label="Import"
              color="primary"
              class="q-mr-xs"
              @click="onImportFile()"
            />
          </template>

          <template v-slot:after>
            <QIcon :name="Icon.CLOSE" @click.stop="importFile = null" class="cursor-pointer" />
          </template>
        </QFile>

        <!-- Export -->
        <div class="q-mb-md">{{ exportText }}</div>
        <QBtn square class="q-mb-md" label="Export" color="primary" @click="onExportData()" />

        <!-- Access Table -->
        <div class="q-mb-md">{{ accessTableText }}</div>
        <QSelect
          outlined
          dense
          v-model="accessTableModel"
          :options="accessTableOptions"
          label="Database Table"
        >
          <template v-slot:before>
            <QBtn
              :disable="!accessTableModel"
              square
              class="q-mr-xs"
              label="Access Table"
              color="primary"
            />
          </template>
        </QSelect>
      </QCardSection>
    </QCard>

    <!--##### Logging #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Logging</div>

        <!-- Toggles -->
        <div class="q-mb-md">{{ showConsoleLogsText }}</div>
        <QToggle v-model="showConsoleLogs" class="q-mb-md" label="Show Console Logs" />

        <div class="q-mb-md">{{ showDebugMessagesText }}</div>
        <QToggle v-model="showDebugMessages" class="q-mb-md" label="Show Debug Messages" />

        <div class="q-mb-md">{{ saveInfoMessagesText }}</div>
        <QToggle v-model="saveInfoMessages" class="q-mb-md" label="Save Info Messages" />

        <!-- Test Logger -->
        <div class="q-mb-md">{{ testLoggerText }}</div>
        <QBtn square label="Test Logger" color="primary" @click="onTestLogger()" />
      </QCardSection>
    </QCard>

    <!--##### DANGER ZONE #####-->
    <QCard flat square>
      <QCardSection>
        <div class="text-h6 text-negative q-mb-md">DANGER ZONE</div>
        <div class="q-mb-md">{{ dangerZoneText }}</div>

        <!-- Delete Table Data -->
        <div class="q-mb-md">{{ deleteTableDataText }}</div>
        <QSelect
          v-model="deleteDataModel"
          outlined
          dense
          label="Database Table"
          class="q-mb-md"
          :options="deleteDataOptions"
        >
          <template v-slot:before>
            <QBtn
              :disable="!deleteDataModel"
              square
              class="q-mr-xs"
              label="Delete Data"
              color="negative"
              @click="onDeleteTableData(TableName.LOGS)"
            />
          </template>
        </QSelect>

        <!-- Delete All Data -->
        <div class="q-mb-md">{{ deleteAllDataText }}</div>
        <QBtn
          square
          class="q-mb-md"
          label="Delete All Data"
          color="negative"
          @click="onDeleteAllData()"
        />

        <!-- Delete Database -->
        <div class="q-mb-md">{{ deleteDatabaseText }}</div>
        <QBtn square label="Delete Database" color="negative" @click="onDeleteDatabase()" />
      </QCardSection>
    </QCard>
  </QPage>
</template>
