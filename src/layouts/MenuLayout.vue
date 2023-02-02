<script setup lang="ts">
import {
  QLayout,
  QPageContainer,
  QBtn,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QDrawer,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QSeparator,
} from 'quasar'
import { AppString, Icon, RouteName } from '@/constants/globals'
import { useRoute } from 'vue-router'
import useUIStore from '@/stores/ui'

const mainMenuStore = useUIStore()
const route = useRoute()
</script>

<template>
  <QLayout view="hHh LpR lff">
    <!-- App Header -->
    <QHeader flat bordered>
      <QToolbar>
        <QBtn flat round :icon="Icon.MENU" @click="mainMenuStore.drawer = !mainMenuStore.drawer" />

        <QToolbarTitle>{{ AppString.APP_NAME }}</QToolbarTitle>

        <QBtn
          v-if="route.name !== RouteName.HOME"
          flat
          round
          :to="{ name: RouteName.HOME }"
          :icon="Icon.HOME"
        />
      </QToolbar>
    </QHeader>

    <!-- Menu Drawer -->
    <QDrawer v-model="mainMenuStore.drawer" :width="250" show-if-above side="left" bordered>
      <div class="row justify-center">
        <QAvatar outline size="90px" class="q-my-md">
          <img src="../../public/android-chrome-512x512.png" />
        </QAvatar>
      </div>

      <QList>
        <QItem clickable v-ripple :to="{ name: RouteName.HOME }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.HOME" />
          </QItemSection>
          <QItemSection>Home</QItemSection>
        </QItem>

        <QItem clickable v-ripple :to="{ name: RouteName.EXAMPLES }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.EXAMPLES" />
          </QItemSection>
          <QItemSection>Examples</QItemSection>
        </QItem>

        <QItem clickable v-ripple :to="{ name: RouteName.SETTINGS }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.SETTINGS" />
          </QItemSection>
          <QItemSection>Settings</QItemSection>
        </QItem>

        <QItem clickable v-ripple :to="{ name: RouteName.ABOUT }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.INFO" />
          </QItemSection>
          <QItemSection>About</QItemSection>
        </QItem>
      </QList>
    </QDrawer>

    <!-- Router View -->
    <QPageContainer>
      <router-view />
    </QPageContainer>
  </QLayout>
</template>
