<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted, type Ref, ref, watch, markRaw } from 'vue'
import useLogger from '@/use/useLogger'
import useDatabaseSettings from '@/use/useDatabaseSettings'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
// import ActionDialog from '@/components/shared/ActionDialog.vue'
// import { DB } from './services/LocalDatabase'

const { log } = useLogger()
const route = useRoute()
const { initializeSettings } = useDatabaseSettings()
const layout: Ref<any> = ref(null)

onMounted(async () => {
  await initializeSettings()
})

/**
 * Watching the route for the meta layout property to change. Sets the layout component.
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
      layout.value = markRaw(component?.default || DefaultLayout)
    } catch (error) {
      layout.value = markRaw(DefaultLayout)
      log.error('Route layout watcher', error)
    }
  },
  { immediate: true }
)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>

  <!-- <ActionDialog /> -->
</template>
