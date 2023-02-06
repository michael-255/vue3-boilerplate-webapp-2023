<script setup lang="ts">
import { QLayout, QPageContainer } from 'quasar'
</script>

<template>
  <QLayout view="hHh LpR lff">
    <QPageContainer>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </QPageContainer>
  </QLayout>
</template>

<style lang="css">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
