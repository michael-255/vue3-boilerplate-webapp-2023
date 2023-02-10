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
import { AppText, Icon, RouteName, TableName } from '@/constants/globals'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { slugify } from '@/utils/common'
import useUIStore from '@/stores/ui'

const mainMenuStore = useUIStore()
const route = useRoute()
const router = useRouter()

/**
 * Go back if pervious state is part of the app history, otherwise go to Dashboard.
 */
function goBack(): void {
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push({ name: RouteName.DASHBOARD })
  }
}
</script>

<template>
  <QLayout view="hHh LpR lff">
    <!-- App Header -->
    <QHeader elevated>
      <QToolbar>
        <QBtn
          flat
          round
          :icon="Icon.MENU_STANDARD"
          @click="mainMenuStore.drawer = !mainMenuStore.drawer"
        />

        <QToolbarTitle>{{ AppText.APP_NAME }}</QToolbarTitle>

        <QBtn
          v-if="route.name !== RouteName.DASHBOARD"
          flat
          round
          :icon="Icon.BACK"
          @click="goBack()"
        />
      </QToolbar>
    </QHeader>

    <!-- Menu Drawer -->
    <QDrawer v-model="mainMenuStore.drawer" :width="250" overlay show-if-above bordered side="left">
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

        <QSeparator spaced="md" inset />

        <QItem
          clickable
          v-ripple
          :to="{ name: RouteName.DATA, params: { tableSlug: slugify(TableName.EXAMPLES) } }"
        >
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.EXAMPLES" />
          </QItemSection>
          <QItemSection>Examples</QItemSection>
          <QItemSection side>
            <QBtn
              flat
              class="q-px-sm"
              :to="{
                name: RouteName.DATA,
                params: { tableSlug: slugify(TableName.EXAMPLE_RECORDS) },
              }"
              :icon="Icon.RECORDS"
            />
          </QItemSection>
        </QItem>

        <QItem
          clickable
          v-ripple
          :to="{ name: RouteName.DATA, params: { tableSlug: slugify(TableName.TESTS) } }"
        >
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.TESTS" />
          </QItemSection>
          <QItemSection>Tests</QItemSection>
          <QItemSection side>
            <QBtn
              flat
              class="q-px-sm"
              :to="{ name: RouteName.DATA, params: { tableSlug: slugify(TableName.TEST_RECORDS) } }"
              :icon="Icon.RECORDS"
            />
          </QItemSection>
        </QItem>

        <QSeparator spaced="md" inset />

        <QItem clickable v-ripple :to="{ name: RouteName.SETTINGS }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.SETTINGS" />
          </QItemSection>
          <QItemSection>Settings</QItemSection>
        </QItem>

        <QItem clickable v-ripple :to="{ name: RouteName.FAQ }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.HELP" />
          </QItemSection>
          <QItemSection>FAQ</QItemSection>
        </QItem>

        <QItem clickable v-ripple :to="{ name: RouteName.ABOUT }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.INFO" />
          </QItemSection>
          <QItemSection>About</QItemSection>
        </QItem>

        <QItem clickable v-ripple :to="{ name: RouteName.DONATE }">
          <QItemSection avatar>
            <QIcon color="warning" :name="Icon.DONATE" />
          </QItemSection>
          <QItemSection>Donate</QItemSection>
        </QItem>
      </QList>
    </QDrawer>

    <!-- Router View -->
    <QPageContainer>
      <RouterView v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </QPageContainer>
  </QLayout>
</template>

<style lang="css">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
