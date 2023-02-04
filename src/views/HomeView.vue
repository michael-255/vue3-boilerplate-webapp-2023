<script setup lang="ts">
import { QPage, QCard, QCardSection, QBtn } from 'quasar'
import { Icon, RouteName, SettingKey } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useHomeView from '@/use/useHomeView'

const settingsStore = useSettingsStore()
const { onCloseIntroduction } = useHomeView()
</script>

<template>
  <QPage padding>
    <div class="row justify-center">
      <div class="col-md-6 col-xs-12">
        <!-- Banner -->
        <QCard flat class="q-mb-sm">
          <QCardSection class="text-h5">
            <QIcon class="q-pb-xs q-pr-xs" :name="Icon.HOME" />
            Home
          </QCardSection>
        </QCard>

        <!--##### Introduction #####-->
        <QCard v-if="settingsStore[SettingKey.INTRODUCTION]" flat class="q-mb-sm">
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
              label="Got it!"
              :icon="Icon.RECOMMEND"
              color="positive"
              @click="onCloseIntroduction()"
            />
          </QCardSection>
        </QCard>

        <!--##### Quick Access #####-->
        <QCard flat class="q-mb-sm">
          <QCardSection>
            <div class="text-h6 q-mb-md">Quick Access</div>

            <div class="row q-col-gutter-md justify-center">
              <div class="col-sm-6 col-xs-12">
                <QBtn
                  no-caps
                  size="lg"
                  :icon="Icon.EXAMPLES"
                  class="glossy full-width"
                  color="warning"
                  label="Examples"
                  :to="{ name: RouteName.EXAMPLES }"
                />
              </div>

              <div class="col-sm-6 col-xs-12">
                <QBtn
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
      </div>
    </div>
  </QPage>
</template>
