<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted, type Ref, ref, watch, markRaw } from 'vue'
import useDatabase from '@/use/useDatabase'
import ErrorLayout from '@/layouts/ErrorLayout.vue'
import useLogger from '@/use/useLogger'

const { log, consoleDebug } = useLogger()
const route = useRoute()
const { initializeSettings, purgeExpiredLogs } = useDatabase()

const layout: Ref<any> = ref(null)

onMounted(async () => {
  try {
    await initializeSettings()
    consoleDebug('Settings initialized')
  } catch (error) {
    log.error('Error initializing settings', error)
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
  () => route.meta?.layout as string | undefined,
  async (metaLayout) => {
    try {
      // metaLayout must exist && the imported component
      const component = metaLayout && (await import(`./layouts/${metaLayout}.vue`))
      // markRaw to avoid reactivity on component definition
      // default is the component
      // Use the default layout if the component is missing
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
