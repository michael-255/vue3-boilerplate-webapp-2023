<script setup lang="ts">
import { QPage, QIcon } from 'quasar'
import { Icon } from '@/constants/globals'
import BannerCard from '@/components/shared/BannerCard.vue'
</script>

<template>
  <QPage padding>
    <BannerCard title="Home" :icon="Icon.HOME" />

    <!--##### Introduction #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Introduction</div>
        <div>Work in progress...</div>
        <!-- TODO -->
      </QCardSection>
    </QCard>

    <!--##### Quick Links #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Quick Links</div>

        <div class="q-mb-md">
          <QBtn square color="warning">
            <div class="row items-center no-wrap">
              <QIcon left :name="Icon.EXAMPLES" />
              <div class="text-center">Record An<br />Example</div>
            </div>
          </QBtn>
        </div>

        <div class="q-mb-md">
          <QBtn square color="accent">
            <div class="row items-center no-wrap">
              <QIcon left :name="Icon.REPORTS" />
              <div class="text-center">View<br />Reports</div>
            </div>
          </QBtn>
        </div>

        <div class="q-mb-md">
          <QBtn square label="TESTING" color="primary" />
        </div>
        <div class="q-mb-md">
          <QBtn square label="TESTING" color="secondary" />
        </div>
        <div class="q-mb-md">
          <QBtn square label="TESTING" color="positive" />
        </div>
        <div class="q-mb-md">
          <QBtn square label="TESTING" color="accent" />
        </div>
        <div class="q-mb-md">
          <QBtn square label="TESTING" color="info" />
        </div>
        <div class="q-mb-md">
          <QBtn square label="TESTING" color="warning" />
        </div>
        <div class="q-mb-md">
          <QBtn square label="TESTING" color="negative" />
        </div>
        <div class="q-mb-md">
          <QBtn square label="TESTING" color="dark" />
        </div>
        <div class="q-mb-md">
          <QBtn square label="TESTING" color="dark-page" />
        </div>
      </QCardSection>
    </QCard>
  </QPage>
</template>
