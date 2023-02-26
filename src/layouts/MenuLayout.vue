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
import { AppText, Icon, RouteName, DatabaseTable } from '@/constants/globals'
import { RouterView, useRoute } from 'vue-router'
import { slugify } from '@/utils/common'
import useGoBack from '@/use/useGoBack'
import useUIStore from '@/stores/ui'

const { onGoBack } = useGoBack()
const uiStore = useUIStore()
const route = useRoute()
</script>

<template>
  <QLayout view="hHh LpR lff">
    <!-- App Header -->
    <QHeader elevated>
      <QToolbar>
        <QBtn flat round :icon="Icon.MENU_STANDARD" @click="uiStore.drawer = !uiStore.drawer" />

        <QToolbarTitle>{{ AppText.APP_NAME }}</QToolbarTitle>

        <QBtn
          v-if="route.name !== RouteName.DASHBOARD"
          flat
          round
          :icon="Icon.BACK"
          @click="onGoBack()"
        />
      </QToolbar>
    </QHeader>

    <!-- Menu Drawer -->
    <QDrawer v-model="uiStore.drawer" :width="250" overlay show-if-above bordered side="left">
      <div class="row justify-center">
        <QAvatar outline size="100px" class="q-my-md">
          <img src="@/assets/menu-avatar.png" />
        </QAvatar>
      </div>

      <QList>
        <!-- Section 1 -->
        <QItem clickable v-ripple :to="{ name: RouteName.DASHBOARD }">
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.DASHBOARD" />
          </QItemSection>
          <QItemSection>Dashboard</QItemSection>
        </QItem>

        <QSeparator spaced="md" inset />

        <!-- Section 2 -->
        <QItem
          clickable
          v-ripple
          :to="{ name: RouteName.DATA, params: { tableSlug: slugify(DatabaseTable.EXAMPLES) } }"
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
                params: { tableSlug: slugify(DatabaseTable.EXAMPLE_RECORDS) },
              }"
              :icon="Icon.RECORDS"
            />
          </QItemSection>
        </QItem>

        <QItem
          clickable
          v-ripple
          :to="{ name: RouteName.DATA, params: { tableSlug: slugify(DatabaseTable.TESTS) } }"
        >
          <QItemSection avatar>
            <QIcon color="primary" :name="Icon.TESTS" />
          </QItemSection>
          <QItemSection>Tests</QItemSection>
          <QItemSection side>
            <QBtn
              flat
              class="q-px-sm"
              :to="{
                name: RouteName.DATA,
                params: { tableSlug: slugify(DatabaseTable.TEST_RECORDS) },
              }"
              :icon="Icon.RECORDS"
            />
          </QItemSection>
        </QItem>

        <QSeparator spaced="md" inset />

        <!-- Section 3 -->
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

        <QItem clickable v-ripple active-class="text-warning" :to="{ name: RouteName.DONATE }">
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
