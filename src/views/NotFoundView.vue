<script setup lang="ts">
import { QCard, QCardSection } from 'quasar'
</script>

<template>
  <QPage padding>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-5 col-xs-12">
        <QCard flat square>
          <QCardSection class="bg-negative text-white">
            <div class="text-h3">404</div>
            <div class="text-subtitle1">Page Not Found</div>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </QPage>
</template>
