<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
import ClearAllButton from '@/components/settings/buttons/ClearAllButton.vue'
import DeleteDatabaseButton from '@/components/settings/buttons/DeleteDatabaseButton.vue'
</script>

<template>
  <QCard flat square>
    <QCardSection>
      <div>
        <div class="text-h6 text-negative q-mb-md">DANGER ZONE</div>

        <div class="q-mb-lg">
          <span>Permanetly delete all of your data from the database using Clear All.</span>
          <span>
            Permanetly delete your data and the underlining database using Delete Database (requires
            site reload).
          </span>
          <span>
            None of the actions in this section can be undone. Export your data before proceeding.
          </span>
        </div>

        <ClearAllButton class="q-mb-sm" />
        <DeleteDatabaseButton />
      </div>
    </QCardSection>
  </QCard>
</template>
