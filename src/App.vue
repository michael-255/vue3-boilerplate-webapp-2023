<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted, type Ref, ref, watch, markRaw } from 'vue'
import useDBSettings from '@/use/useDBSettings'
import ErrorLayout from '@/layouts/ErrorLayout.vue'
import useLogger from '@/use/useLogger'

const { log } = useLogger()
const route = useRoute()
const { initializeSettings } = useDBSettings()

const layout: Ref<any> = ref(null)

onMounted(async () => {
  await initializeSettings()
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
