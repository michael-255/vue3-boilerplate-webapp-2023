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
} from 'quasar'
import { AppText, Icon, RouteName } from '@/constants/globals'
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

        <QToolbarTitle>{{ AppText.APP_NAME }}</QToolbarTitle>

        <QBtn
          v-if="route.name !== RouteName.DASHBOARD"
          flat
          round
          :to="{ name: RouteName.DASHBOARD }"
          :icon="Icon.BACK"
        />
      </QToolbar>
    </QHeader>

    <!-- Menu Drawer -->
    <QDrawer v-model="mainMenuStore.drawer" :width="220" overlay show-if-above side="left">
      <div class="row justify-center">
        <QAvatar outline size="100px" class="q-my-md">
          <img src="@/assets/menu-avatar.png" />
        </QAvatar>
      </div>

      <QList>
        <QItem clickable v-ripple :to="{ name: RouteName.DASHBOARD }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.DASHBOARD" />
          </QItemSection>
          <QItemSection>Dashboard</QItemSection>
        </QItem>

        <QItem clickable v-ripple :to="{ name: RouteName.EXAMPLES }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.EXAMPLES" />
          </QItemSection>
          <QItemSection>Examples</QItemSection>
        </QItem>

        <QSeparator spaced="md" inset />

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
