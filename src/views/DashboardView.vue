<script setup lang="ts">
import { QCard, QCardSection, QBtn, date } from 'quasar'
import { Icon, SettingKey, RouteName } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useDashboard from '@/use/useDashboard'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { ref } from 'vue'

const settingsStore = useSettingsStore()
const { parentListSelection, onCloseIntroduction } = useDashboard()

const rating = ref(0)

const groupOptions = [
  {
    label: 'Examples',
    value: 'examples',
  },
  {
    label: 'Tests',
    value: 'tests',
  },
]
</script>

<template>
  <ResponsivePage :banner-icon="Icon.DASHBOARD" banner-title="Dashboard">
    <!-- Introduction -->
    <QCard v-if="settingsStore[SettingKey.SHOW_INTRODUCTION]" class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Introduction</div>

        <!-- TODO -->
        <div class="q-mb-md">
          <div>WORK IN PROGRESS</div>
          <div>- What type of site this is (static, no login, you control your data)</div>
          <div>- Where certain pages are and how to get to them</div>
          <div>- How to favorite things</div>
        </div>

        <!-- TODO - TEMP - For Testing -->
        <div class="q-mb-md">
          {{ date.formatDate(new Date(), 'YYYY MM DD HH mm ss SSSZ') }}
        </div>

        <!-- TODO - TEMP - For Testing -->
        <div class="q-mb-md">
          <QBtn
            label="Actions Test Route"
            :icon="Icon.EDIT"
            color="warning"
            :to="{
              name: RouteName.ACTIONS,
              params: { tableSlug: 'examples', actionSlug: 'create' },
            }"
          />
        </div>

        <!-- TODO - TEMP - For Testing -->
        <div class="q-mb-md">
          <QBtn
            label="Charts Test Route"
            :icon="Icon.CHARTS"
            color="accent"
            :to="{
              name: RouteName.CHARTS,
              params: { tableSlug: 'examples', id: 'test-123' },
            }"
          />
        </div>

        <div class="row justify-center">
          <QBtn
            label="Got it!"
            size="lg"
            color="positive"
            :icon="Icon.RECOMMEND"
            @click="onCloseIntroduction()"
          />
        </div>
      </QCardSection>
    </QCard>

    <!-- List Selection -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">List Selection</div>
        <div class="q-mb-md">
          Select the Parent items you want to appear in the Dashboard list below.
        </div>

        <QOptionGroup v-model="parentListSelection" :options="groupOptions" color="primary" />
      </QCardSection>
    </QCard>

    <!-- Parent Items List -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Example List Card</div>

        <div>
          <QBadge rounded color="secondary" class="q-py-none">
            <QIcon :name="Icon.PREVIOUS" />
            <span class="text-caption q-ml-xs">1 day ago</span>
          </QBadge>
        </div>

        <div>
          <QIcon :name="Icon.CALENDAR_CHECK" />
          <span class="text-caption q-ml-xs">{{ new Date().toDateString() }}</span>
        </div>

        <div>
          <QIcon :name="Icon.STOPWATCH" />
          <span class="text-caption q-ml-xs">1h 23m 15s</span>
        </div>

        <div class="absolute-top-right q-ma-xs">
          <QRating
            v-model="rating"
            :max="1"
            :icon="Icon.FAVORITE_OFF"
            :icon-selected="Icon.FAVORITE_ON"
            color="warning"
            size="md"
            class="q-mr-xs"
          />

          <QBtn round flat :icon="Icon.MENU_VERTICAL">
            <QMenu auto-close cover anchor="top middle">
              <QList>
                <QItem clickable>
                  <QItemSection avatar>
                    <QIcon color="primary" :name="Icon.INSPECT" />
                  </QItemSection>
                  <QItemSection>Inspect</QItemSection>
                </QItem>

                <QItem clickable>
                  <QItemSection avatar>
                    <QIcon color="primary" :name="Icon.EDIT" />
                  </QItemSection>
                  <QItemSection>Edit</QItemSection>
                </QItem>

                <QItem clickable>
                  <QItemSection avatar>
                    <QIcon color="primary" :name="Icon.CHARTS" />
                  </QItemSection>
                  <QItemSection>Charts</QItemSection>
                </QItem>

                <QSeparator />

                <QItem clickable>
                  <QItemSection avatar>
                    <QIcon color="negative" :name="Icon.DELETE" />
                  </QItemSection>
                  <QItemSection>Delete</QItemSection>
                </QItem>
              </QList>
            </QMenu>
          </QBtn>
        </div>
      </QCardSection>
    </QCard>

    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Example List Card</div>

        <div class="q-mb-none">
          <QBadge rounded color="secondary" class="q-py-none">
            <QIcon :name="Icon.PREVIOUS" class="q-mr-xs" />
            <span class="text-caption">No previous records</span>
          </QBadge>
        </div>

        <div class="absolute-top-right q-ma-xs">
          <QRating
            v-model="rating"
            :max="1"
            :icon="Icon.FAVORITE_OFF"
            :icon-selected="Icon.FAVORITE_ON"
            color="warning"
            size="md"
            class="q-mr-xs"
          />

          <QBtn round flat :icon="Icon.MENU_VERTICAL" />
        </div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
