<script setup lang="ts">
import { QPage, QIcon } from 'quasar'
import { Icon, AppColor } from '@/constants/globals'
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
          <QBtn square :color="AppColor.WARN">
            <div class="row items-center no-wrap">
              <QIcon left :name="Icon.EXAMPLES" />
              <div class="text-center">Record An<br />Example</div>
            </div>
          </QBtn>
        </div>

        <div>
          <QBtn square :color="AppColor.DEBUG">
            <div class="row items-center no-wrap">
              <QIcon left :name="Icon.REPORTS" />
              <div class="text-center">View<br />Reports</div>
            </div>
          </QBtn>
        </div>
      </QCardSection>
    </QCard>
  </QPage>
</template>
