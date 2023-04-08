<script setup lang="ts">
import { Icon } from '@/types/icons'
import { onMounted, ref, type Ref } from 'vue'
import type { DatabaseRecord } from '@/types/models'
import type { Optional } from '@/types/misc'
import { getFieldBlueprints, getLabel } from '@/services/data-utils'
import useLogger from '@/composables/useLogger'
import useDatabase from '@/composables/useDatabase'
import useRoutingHelpers from '@/composables/useRoutingHelpers'
import ResponsivePage from '@/components/ResponsivePage.vue'

const { routeDatabaseType, routeId } = useRoutingHelpers()
const { log } = useLogger()
const { getRecord } = useDatabase()

const fieldBlueprints = getFieldBlueprints(routeDatabaseType)
const record: Ref<Optional<DatabaseRecord>> = ref(null)

onMounted(async () => {
  try {
    record.value = await getRecord(routeDatabaseType, routeId)
  } catch (error) {
    log.error('Error loading inspect view', error)
  }
})
</script>

<template>
  <ResponsivePage
    :banner-icon="Icon.INSPECT"
    :banner-title="`Inspect ${getLabel(routeDatabaseType, 'singular')}`"
  >
    <QCard v-for="(fieldBP, i) in fieldBlueprints" :key="i" class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-sm">{{ fieldBP.label }}</div>
        <div>{{ fieldBP.inspectFormat(record?.[fieldBP.field]) ?? '-' }}</div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
