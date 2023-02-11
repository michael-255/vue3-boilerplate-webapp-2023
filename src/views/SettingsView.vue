<script setup lang="ts">
import { QSelect, QBtn } from 'quasar'
import { AppText, Icon, TableName, Limit, RouteName } from '@/constants/globals'
import useViewSettings from '@/use/useViewSettings'
import ResponsivePage from '@/components/ResponsivePage.vue'
import { slugify } from '@/utils/common'

const {
  showIntroduction,
  darkMode,
  showConsoleLogs,
  showDebugMessages,
  saveInfoMessages,
  importFile,
  deleteDataModel,
  deleteDataOptions,
  onTestLogger,
  onDefaultExamples,
  onRejectedFile,
  onImportFile,
  onExportData,
  onDeleteTableData,
  onDeleteAllData,
  onDeleteDatabase,
} = useViewSettings()
</script>

<template>
  <ResponsivePage :banner-icon="Icon.SETTINGS" banner-title="Settings">
    <!-- Options -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Options</div>

        <!-- Toggles -->
        <div class="q-mb-md">
          Introduction provides instructions on the Home page on how to use the app.
        </div>

        <QToggle v-model="showIntroduction" class="q-mb-md" label="Show Introduction" />

        <div class="q-mb-md">
          Dark Mode allows you to switch between a light or dark theme for the app.
        </div>

        <QToggle v-model="darkMode" label="Dark Mode" />
      </QCardSection>
    </QCard>

    <!-- Defaults -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Defaults</div>

        <!-- Examples -->
        <div class="q-mb-md">Load default Examples into the database.</div>

        <QBtn label="Load Examples" color="primary" @click="onDefaultExamples()" />
      </QCardSection>
    </QCard>

    <!-- Data Management -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Data Management</div>

        <!-- Import -->
        <div class="q-mb-md">
          Import data into the database from a JSON file. The app expects the data in the file to be
          structured the same as the exported version.
        </div>

        <QFile
          v-model="importFile"
          dense
          outlined
          counter
          bottom-slots
          label="File Select"
          :max-file-size="Limit.FILESIZE"
          accept="application/json"
          @rejected="onRejectedFile"
        >
          <template v-slot:before>
            <QBtn :disable="!importFile" label="Import" color="primary" @click="onImportFile()" />
          </template>

          <template v-slot:append>
            <QIcon :name="Icon.CLOSE" @click.stop="importFile = null" class="cursor-pointer" />
          </template>
        </QFile>

        <!-- Export -->
        <div class="q-mb-md">
          Export the entire database as a JSON file. Do this on a regularly basis so you have a
          backup of your data.
        </div>

        <QBtn class="q-mb-md" label="Export" color="primary" @click="onExportData()" />

        <!-- Access Internal Tables -->
        <div class="q-mb-md">
          Access the internal {{ AppText.APP_NAME }} data tables if you need to troubleshoot issues.
        </div>

        <div class="q-mb-md">
          <QBtn
            label="Logs Table"
            color="primary"
            :to="{ name: RouteName.DATA, params: { tableSlug: slugify(TableName.LOGS) } }"
          />
        </div>

        <div>
          <QBtn
            label="Settings Table"
            color="primary"
            :to="{ name: RouteName.DATA, params: { tableSlug: slugify(TableName.SETTINGS) } }"
          />
        </div>
      </QCardSection>
    </QCard>

    <!-- Logging -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Logging</div>

        <!-- Toggles -->
        <div class="q-mb-md">
          Show Console Logs will display all log messages in the developer console.
        </div>

        <QToggle v-model="showConsoleLogs" class="q-mb-md" label="Show Console Logs" />

        <div class="q-mb-md">Show Debug Messages will display debug level notification alerts.</div>

        <QToggle v-model="showDebugMessages" class="q-mb-md" label="Show Debug Messages" />

        <div class="q-mb-md">
          Save Info Messages will save info level messages in the logs table of the database for
          later review.
        </div>

        <QToggle v-model="saveInfoMessages" class="q-mb-md" label="Save Info Messages" />

        <!-- Test Logger -->
        <div class="q-mb-md">
          Validate that your logging settings above are working as expected by using the test action
          below.
        </div>

        <QBtn label="Test Logger" color="primary" @click="onTestLogger()" />
      </QCardSection>
    </QCard>

    <!-- DANGER ZONE -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 text-negative q-mb-md">DANGER ZONE</div>

        <div class="q-mb-md">
          The following operations cannot be undone. Consider exporting your data before proceeding.
        </div>

        <!-- Delete Table Data -->
        <div class="q-mb-md">Select a table and permanently delete all of its data.</div>

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
              label="Delete Data"
              color="negative"
              @click="onDeleteTableData(TableName.LOGS)"
            />
          </template>
        </QSelect>

        <!-- Delete All Data -->
        <div class="q-mb-md">Permanently delete all data from the database.</div>

        <QBtn class="q-mb-md" label="Delete All Data" color="negative" @click="onDeleteAllData()" />

        <!-- Delete Database -->
        <div class="q-mb-md">
          Delete the underlining database and all of its data (requires website reload).
        </div>

        <QBtn label="Delete Database" color="negative" @click="onDeleteDatabase()" />
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
