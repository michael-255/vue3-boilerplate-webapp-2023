<script setup lang="ts">
import { QPage, QPageScroller, QBtn } from 'quasar'
import { Icon } from '@/types/icons'

defineProps<{
  bannerIcon?: Icon
  bannerTitle?: string
}>()

// TODO - ErrorCard and/or NoDataCard with props?
</script>

<template>
  <QPage padding>
    <div class="row justify-center">
      <div class="col-md-6 col-xs-12">
        <!-- Optional Banner -->
        <QCard v-if="bannerIcon && bannerTitle" class="q-mb-md">
          <QCardSection class="text-h5">
            <QIcon class="q-pb-xs q-pr-xs" :name="bannerIcon" />
            {{ bannerTitle }}
          </QCardSection>
        </QCard>

        <!-- Slot -->
        <slot />

        <!-- Extra space at page bottom so scroller doesn't cover content  -->
        <div class="q-mb-xl" />
      </div>
    </div>

    <!-- Page Scroller -->
    <QPageScroller>
      <QBtn fab :icon="Icon.TOP_OF_PAGE" color="accent" />
    </QPageScroller>
  </QPage>
</template>
