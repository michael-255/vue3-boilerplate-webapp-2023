<script setup lang="ts">
import { QLayout, QPageContainer, QHeader, QToolbar, QToolbarTitle } from 'quasar'
import { RouterView } from 'vue-router'
import { AppText } from '@/constants/globals'
</script>

<template>
  <QLayout view="hHh LpR lff">
    <QHeader flat bordered>
      <QToolbar>
        <QToolbarTitle>{{ AppText.APP_NAME }}</QToolbarTitle>
      </QToolbar>
    </QHeader>

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
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
