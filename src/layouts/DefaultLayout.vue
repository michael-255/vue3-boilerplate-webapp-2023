<script setup lang="ts">
import { QLayout, QPageContainer, QHeader, QToolbar, QToolbarTitle } from 'quasar'
import { AppString } from '@/constants/globals'
</script>

<template>
  <QLayout view="hHh LpR lff">
    <QHeader elevated>
      <QToolbar>
        <QToolbarTitle>{{ AppString.APP_NAME }}</QToolbarTitle>
      </QToolbar>
    </QHeader>

    <QPageContainer>
      <router-view />
    </QPageContainer>
  </QLayout>
</template>
