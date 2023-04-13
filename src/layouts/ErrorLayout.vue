<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppName } from '@/types/misc'
</script>

<template>
  <QLayout view="hHh LpR lff">
    <QHeader elevated>
      <QToolbar>
        <QToolbarTitle>{{ AppName }}</QToolbarTitle>
      </QToolbar>
    </QHeader>

    <!-- Router View -->
    <QPageContainer>
      <RouterView v-slot="{ Component, route }">
        <transition name="global-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </QPageContainer>
  </QLayout>
</template>
