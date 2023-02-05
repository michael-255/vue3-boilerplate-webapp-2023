<script setup lang="ts">
import { QLayout, QPageContainer } from 'quasar'
</script>

<template>
  <QLayout view="hHh LpR lff">
    <QPageContainer>
      <router-view />
    </QPageContainer>
  </QLayout>
</template>
