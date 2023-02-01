<script setup lang="ts">
import { QPage, QCard, QCardSection, QBtn } from 'quasar'
import { Icon, RouteName, SettingKey } from '@/constants/globals'
import BannerCard from '@/components/shared/BannerCard.vue'
import useSettingsStore from '@/stores/settings'
import useDBSettings from '@/use/useDBSettings'

const settingsStore = useSettingsStore()
const { setSetting } = useDBSettings()

/**
 * TODO
 * - Move this to a useHomeView file?
 */
async function onCloseIntroduction(): Promise<void> {
  await setSetting(SettingKey.INTRODUCTION, false)
}
</script>

<template>
  <QPage padding>
    <BannerCard title="Home" :icon="Icon.HOME" />

    <!--##### Introduction #####-->
    <QCard v-if="settingsStore[SettingKey.INTRODUCTION]" flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Introduction</div>

        <!-- TODO -->
        <div class="q-mb-md">
          <div>WORK IN PROGRESS</div>
          <div>- What type of site this is (static, no login, you control your data)</div>
          <div>- Where certain pages are and how to get to them</div>
          <div>- How to favorite things</div>
        </div>

        <QBtn
          square
          label="Got it!"
          icon="recommend"
          color="positive"
          @click="onCloseIntroduction()"
        />
      </QCardSection>
    </QCard>

    <!--##### Quick Access #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Quick Access</div>

        <div class="row q-col-gutter-md justify-center">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <QBtn
              square
              no-caps
              size="lg"
              :icon="Icon.EXAMPLES"
              class="glossy full-width"
              color="warning"
              label="Examples"
              :to="{ name: RouteName.HOME }"
            />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <QBtn
              square
              no-caps
              size="lg"
              :icon="Icon.REPORTS"
              class="glossy full-width"
              color="accent"
              label="Reports"
              :to="{ name: RouteName.HOME }"
            />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <QBtn
              square
              no-caps
              size="lg"
              :icon="Icon.SETTINGS"
              class="glossy full-width"
              color="secondary"
              label="Settings"
              :to="{ name: RouteName.SETTINGS }"
            />
          </div>
        </div>
      </QCardSection>
    </QCard>
  </QPage>
</template>
