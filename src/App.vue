<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted, type Ref, ref, watch, markRaw } from 'vue'
import { Icon } from '@/types/icons'
import type { Optional } from '@/types/misc'
import ErrorLayout from '@/layouts/ErrorLayout.vue'
import useLogger from '@/composables/useLogger'
import useNotifications from '@/composables/useNotifications'
import DB from '@/services/LocalDatabase'

const { log } = useLogger()
const { notify } = useNotifications()
const route = useRoute()

const layout: Ref<any> = ref(null)

onMounted(async () => {
  try {
    await DB.initSettings()
    log.silentDebug('Settings initialized')
  } catch (error) {
    // If the settings are not initialized, the database may have had an error or not be open
    // Must use basic print log since it doesn't require the DB or notify'
    log.print('Error initializing settings', error)
    notify('Error initializing settings', Icon.ERROR, 'error')
  }

  try {
    const logsPurged = await DB.purgeExpiredLogs()
    log.silentDebug('Expired logs purged', { logsPurged })
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

<style lang="css">
/* These are the global transition styles used by the app layouts */
.global-fade-enter-active,
.global-fade-leave-active {
  transition: opacity 0.15s;
}
.global-fade-enter-from,
.global-fade-leave-to {
  opacity: 0;
}
</style>
