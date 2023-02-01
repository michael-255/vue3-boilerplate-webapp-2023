<script setup lang="ts">
import { QPage, QBtn } from 'quasar'
import { AppColor, Icon } from '@/constants/globals'
import BannerCard from '@/components/shared/BannerCard.vue'
import OptionToggles from '@/components/settings/inputs/OptionToggles.vue'
import TestLoggerButton from '@/components/settings/buttons/TestLoggerButton.vue'
import ImportInput from '@/components/settings/inputs/ImportInput.vue'
import ExportInput from '@/components/settings/inputs/ExportInput.vue'
import ClearAllButton from '@/components/settings/buttons/ClearAllButton.vue'
import DeleteDatabaseButton from '@/components/settings/buttons/DeleteDatabaseButton.vue'

const optionsText = `Dark Mode allows you to switch between a light or dark themed app.
Show Console Logs will display all log messages in the developer console when turned on.
Show Debug Messages will display debug level notification alerts when on.
Save Info Messages will save info level messages in the logs table of the database for later review.`
const defaultsText = `TODO`
const importText = `You can import data into the database from a JSON file.`
const exportText = `You can export the entire database as a JSON file.`
const tableViewerText = `TODO`
const dangerZoneText = `Permanetly delete all of your data from the database using Clear All.
Permanetly delete your data and the underlining database using Delete Database (requires site reload).
None of the actions in this section can be undone. Export your data before proceeding.`
</script>

<template>
  <QPage padding>
    <BannerCard title="Settings" :icon="Icon.SETTINGS" />

    <!-- Options -->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Options</div>
        <div class="q-mb-md">{{ optionsText }}</div>
        <OptionToggles class="q-mb-lg" />
        <TestLoggerButton />
      </QCardSection>
    </QCard>

    <!-- Defaults -->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Defaults</div>
        <div class="q-mb-md">{{ defaultsText }}</div>
      </QCardSection>
    </QCard>

    <!-- Data Management -->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Data Management</div>

        <div class="q-mb-md">{{ importText }}</div>
        <ImportInput />

        <div class="q-mb-md">{{ exportText }}</div>
        <ExportInput class="q-mb-md" />

        <div class="q-mb-md">{{ tableViewerText }}</div>
        <div class="q-mb-sm">
          <QBtn square label="Examples" :icon="Icon.EXAMPLE" :color="AppColor.INFO" />
        </div>
        <div class="q-mb-sm">
          <QBtn square label="Settings" :icon="Icon.SETTINGS" :color="AppColor.WARN" />
        </div>
        <div class="q-mb-sm">
          <QBtn square label="Images" :icon="Icon.DASHBOARD" :color="AppColor.WARN" />
        </div>
        <div>
          <QBtn square label="Logs" :icon="Icon.LOGS" :color="AppColor.WARN" />
        </div>
      </QCardSection>
    </QCard>

    <!-- DANGER ZONE -->
    <QCard flat square>
      <QCardSection>
        <div class="text-h6 text-negative q-mb-md">DANGER ZONE</div>
        <div class="q-mb-lg">{{ dangerZoneText }}</div>
        <ClearAllButton class="q-mb-sm" />
        <DeleteDatabaseButton />
      </QCardSection>
    </QCard>
  </QPage>
</template>
