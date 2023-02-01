<script setup lang="ts">
import { QCard, QCardSection, QCardActions, QBtn } from 'quasar'
import { Icon, RouteName } from '@/constants/globals'
</script>

<template>
  <QPage padding>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-5 col-xs-12">
        <QCard>
          <QCardSection class="bg-negative text-white">
            <div class="text-h3">404</div>
            <div class="text-subtitle1">Page Not Found</div>
          </QCardSection>

          <QCardActions>
            <QBtn
              flat
              class="full-width"
              :to="{ name: RouteName.HOME }"
              :icon="Icon.UNDO"
              label="Return to Dashboard"
            />
          </QCardActions>
        </QCard>
      </div>
    </div>
  </QPage>
</template>
