<script setup lang="ts">
import { QPage, QCard, QCardSection, QBtn } from 'quasar'
import { Icon, SettingKey } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useHomeView from '@/use/useHomeView'
import useLogger from '@/use/useLogger'
import { ref } from 'vue'

const { consoleDebug } = useLogger()
const settingsStore = useSettingsStore()
const { onCloseIntroduction } = useHomeView()

const groupOptions = [
  {
    label: 'Examples',
    value: 'option1',
  },
]

const group = ref('option1')
</script>

<template>
  <QPage padding>
    <div class="row justify-center">
      <div class="col-md-6 col-xs-12">
        <!-- Banner -->
        <QCard flat class="q-mb-sm">
          <QCardSection class="text-h5">
            <QIcon class="q-pb-xs q-pr-xs" :name="Icon.DASHBOARD" />
            Dashboard
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

        <!--##### List Selection #####-->
        <QCard flat class="q-mb-sm">
          <QCardSection>
            <div class="text-h6 q-mb-md">List Selection</div>
            <div class="q-mb-md">
              Select the Primary items you want to appear in the Dashboard list below.
            </div>

            <QOptionGroup v-model="group" :options="groupOptions" color="primary" />
          </QCardSection>
        </QCard>

        <!-- Parent List -->
        <QCard flat class="q-mb-sm">
          <QCardSection>
            <div class="text-h6 q-mb-md">Defaults</div>

            <!-- Examples -->
            <div class="q-mb-md">TODO</div>
            <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
          </QCardSection>
        </QCard>
        <QCard flat class="q-mb-sm">
          <QCardSection>
            <div class="text-h6 q-mb-md">Defaults</div>

            <!-- Examples -->
            <div class="q-mb-md">TODO</div>
            <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
          </QCardSection>
        </QCard>
        <QCard flat class="q-mb-sm">
          <QCardSection>
            <div class="text-h6 q-mb-md">Defaults</div>

            <!-- Examples -->
            <div class="q-mb-md">TODO</div>
            <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
          </QCardSection>
        </QCard>
        <QCard flat class="q-mb-sm">
          <QCardSection>
            <div class="text-h6 q-mb-md">Defaults</div>

            <!-- Examples -->
            <div class="q-mb-md">TODO</div>
            <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
          </QCardSection>
        </QCard>
        <QCard flat class="q-mb-sm">
          <QCardSection>
            <div class="text-h6 q-mb-md">Defaults</div>

            <!-- Examples -->
            <div class="q-mb-md">TODO</div>
            <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
          </QCardSection>
        </QCard>
        <QCard flat class="q-mb-sm">
          <QCardSection>
            <div class="text-h6 q-mb-md">Defaults</div>

            <!-- Examples -->
            <div class="q-mb-md">TODO</div>
            <QBtn label="Examples" :icon="Icon.EXAMPLES" color="primary" />
          </QCardSection>
        </QCard>
      </div>
    </div>
  </QPage>
</template>
