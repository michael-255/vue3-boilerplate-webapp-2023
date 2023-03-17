<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted, type Ref, ref, watch, markRaw } from 'vue'
import type { Optional } from '@/types/misc'
import useDatabase from '@/composables/useDatabase'
import ErrorLayout from '@/layouts/ErrorLayout.vue'
import useLogger from '@/composables/useLogger'

const { initSettings, purgeExpiredLogs } = useDatabase()
const { log, consoleDebug, consoleLog } = useLogger()
const route = useRoute()

const layout: Ref<any> = ref(null)

onMounted(async () => {
  try {
    await initSettings()
    consoleDebug('Settings initialized')
  } catch (error) {
    // If the settings are not initialized, the database may have had an error or not be open
    consoleLog('Error initializing settings', error)
  }

  try {
    const logsPurged = await purgeExpiredLogs()
    consoleDebug('Expired logs purged', { logsPurged })
  } catch (error) {
    log.error('Error purging expired logs', error)
  }
})

/**
 * Watching route for the meta layout property to change. Sets the layout component.
 */
watch(
  () => route.meta?.layout as Optional<string>,
  async (metaLayout) => {
    try {
      // metaLayout must exist && the imported component
      const component = metaLayout && (await import(`./layouts/${metaLayout}.vue`))
      // markRaw to avoid reactivity on component definition
      // Use the error layout if the component is missing
      layout.value = markRaw(component?.default || ErrorLayout)
    } catch (error) {
      layout.value = markRaw(ErrorLayout)
      log.error('Error with route layout watcher', error)
    }
  },
  { immediate: true }
)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
