<script setup lang="ts">
import { Icon } from '@/types/icons'
import { useRoute } from 'vue-router'
import { DatabaseField, DatabaseType } from '@/types/database'
import { onMounted, ref, type Ref } from 'vue'
import type { DatabaseRecord } from '@/types/models'
import type { Optional } from '@/types/misc'
import { getFieldBlueprints, getTypeFromSlug } from '@/services/data-utils'
import useLogger from '@/composables/useLogger'
import useDatabase from '@/composables/useDatabase'
import ResponsivePage from '@/components/ResponsivePage.vue'

const route = useRoute()
const { log } = useLogger()
const { getRecord } = useDatabase()

const routeDatabaseType = getTypeFromSlug(route?.params?.databaseTypeSlug as string)
const routeId = route?.params?.[DatabaseField.ID] as string

const fieldBlueprints = getFieldBlueprints(routeDatabaseType as DatabaseType)
const record: Ref<Optional<DatabaseRecord>> = ref(null)

onMounted(async () => {
  try {
    record.value = await getRecord(routeDatabaseType as DatabaseType, routeId)
  } catch (error) {
    log.error('Error loading record', error)
  }
})
</script>

<template>
  <ResponsivePage :banner-icon="Icon.INSPECT" banner-title="Inspect">
    <QCard v-for="(fieldBP, i) in fieldBlueprints" :key="i" class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-sm">{{ fieldBP.label }}</div>
        <div>{{ fieldBP.inspectFormat(record?.[fieldBP.field]) ?? '-' }}</div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
