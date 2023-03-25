<script setup lang="ts">
import { QCard, QCardSection, QRating } from 'quasar'
import { type Ref, ref } from 'vue'
import { SettingId } from '@/types/database'
import { AppText } from '@/types/misc'
import { Icon } from '@/types/icons'
import { RouteName } from '@/router/route-names'
import useDatabase from '@/composables/useDatabase'
import useUIStore from '@/stores/ui'

const uiStore = useUIStore()
const { setSetting } = useDatabase()

const exampleFavorite: Ref<number> = ref(0)
// TODO
// - Refine the introduction explanations by including more details
// - Add a message when you click certain buttons versus routing the user to a new page
// - Add a message when you click the star icon
// - Add a message when you click the menu icon

/**
 * Set the introduction setting value to false in settings to close the introduction card.
 */
async function onCloseIntroduction(): Promise<void> {
  await setSetting(SettingId.SHOW_INTRODUCTION, false)
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">Introduction</div>

      <div class="q-mb-md">
        Welcome to {{ AppText.APP_NAME }}. This app provides a simple foundation to build your own
        web apps.
      </div>

      <div class="q-mb-md">
        You are currently on the Dashboard page. This page gives you quick access to the primary
        data you work with in the app. You can favorite items on the Dashboard by clicking the star
        icon in the top right corner of the item like the example one below. This prioritizes the
        item to the top of the list.
      </div>

      <QRating
        v-model="exampleFavorite"
        :max="1"
        :icon="Icon.FAVORITE_OFF"
        :icon-selected="Icon.FAVORITE_ON"
        color="warning"
        size="md"
        class="q-mb-md"
      />

      <div class="q-mb-md">
        You can navigate through the app using the menu in the top left corner of the page. A quick
        link is provided below. These pages include your data tables, Frequently Asked Questions
        (FAQ), and the Settings page.
      </div>

      <QBtn
        round
        color="primary"
        class="q-mb-md"
        :icon="Icon.MENU_STANDARD"
        @click="uiStore.drawer = !uiStore.drawer"
      />

      <div class="q-mb-md">
        The Settings page provides you access to features like importing and exporting your data,
        logging, data table deletion, and more. A quick link is provided below.
      </div>

      <QBtn
        class="q-mb-md"
        color="primary"
        label="Settings"
        :to="{ name: RouteName.SETTINGS }"
        :icon="Icon.SETTINGS"
      />

      <div class="q-mb-md">
        Hope you find {{ AppText.APP_NAME }} useful. Please consider donating to help me continue to
        create and maintain apps like this. Thank you!
      </div>

      <QBtn
        class="q-mb-md"
        color="warning"
        label="Donate"
        :to="{ name: RouteName.DONATE }"
        :icon="Icon.DONATE"
      />

      <div class="q-mb-md">
        When you are ready, click the GOT IT button below to hide the Introduction. You can unhide
        the Introduction in the Settings page if needed.
      </div>

      <QBtn
        label="Got it"
        class="full-width"
        size="lg"
        color="positive"
        :icon="Icon.RECOMMEND"
        @click="onCloseIntroduction()"
      />
    </QCardSection>
  </QCard>
</template>
