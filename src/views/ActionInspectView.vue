<script setup lang="ts">
import { Icon } from '@/types/icons'
import { useRoute } from 'vue-router'
import {
  getTypeFromSlug,
  getLabelSingular,
  getDatabaseTypeColumnProps,
} from '@/services/DatabaseUtils'
import { DatabaseField } from '@/types/database'
import { onMounted, ref, type Ref } from 'vue'
import type { DatabaseRecord } from '@/types/models'
import type { Optional } from '@/types/misc'
import useLogger from '@/composables/useLogger'
import useDatabase from '@/composables/useDatabase'
import ResponsivePage from '@/components/ResponsivePage.vue'

const route = useRoute()
const { log } = useLogger()
const { getRecord } = useDatabase()

const routeDatabaseType = getTypeFromSlug(route?.params?.databaseTypeSlug as string)
const routeId = route?.params?.[DatabaseField.ID] as string
const bannerTitle = `Inspect ${getLabelSingular(routeDatabaseType)}`

const columnProps = getDatabaseTypeColumnProps(routeDatabaseType)
const record: Ref<Optional<DatabaseRecord>> = ref(null)

// TODO
const formattedFields = [
  DatabaseField.CREATED_TIMESTAMP,
  DatabaseField.IS_ENABLED,
  DatabaseField.IS_FAVORITED,
]

onMounted(async () => {
  try {
    record.value = await getRecord(routeDatabaseType, routeId)
  } catch (error) {
    log.error('Error loading record', error)
  }
})
</script>

<template>
  <ResponsivePage :banner-icon="Icon.INSPECT" :banner-title="bannerTitle">
    <div v-for="(item, i) in columnProps" :key="i" class="q-mb-md">
      <!-- Do NOT print the hiddenId field -->
      <div v-if="item.name !== 'hiddenId'">
        <!-- Id* - Forces full id print and removes "*" from label -->
        <QCard v-if="item.name === DatabaseField.ID">
          <QCardSection>
            <div class="text-h6 q-mb-sm">Id</div>
            <div>{{ record?.[item.name as DatabaseField] }}</div>
          </QCardSection>
        </QCard>

        <!-- Parent Id* - Forces full id print and removes "*" from label -->
        <QCard v-else-if="item.name === DatabaseField.PARENT_ID">
          <QCardSection>
            <div class="text-h6 q-mb-sm">Parent Id</div>
            <div>{{ record?.[item.name as DatabaseField] }}</div>
          </QCardSection>
        </QCard>

        <!-- Formatted Fields -->
        <QCard v-else-if="formattedFields.includes(item.name)">
          <QCardSection>
            <div class="text-h6 q-mb-sm">{{ item.label }}</div>
            <div>{{ item.format(record?.[item.name as DatabaseField]) }}</div>
          </QCardSection>
        </QCard>

        <!-- All Other fields ignore the format function -->
        <QCard v-else>
          <QCardSection>
            <div class="text-h6 q-mb-sm">{{ item.label }}</div>
            <div>{{ record?.[item.name as DatabaseField] || '-' }}</div>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </ResponsivePage>
</template>
