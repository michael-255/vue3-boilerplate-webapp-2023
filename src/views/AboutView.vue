<script setup lang="ts">
import { QCard, QCardSection, QBtn } from 'quasar'
import { AppText, Icon, WebURL } from '@/constants/globals'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'

const aboutMessage = `${AppText.APP_NAME} is a Vue 3 Typescript project created by michael-255 on GitHub. It is
publicly available using the MIT License.`
</script>

<template>
  <ResponsivePage :banner-icon="Icon.INFO" banner-title="About">
    <QCard>
      <QCardSection class="q-pb-xs">{{ aboutMessage }}</QCardSection>

      <QCardSection>
        <div class="row q-col-gutter-md justify-start">
          <div class="col-sm-6 col-xs-12">
            <QBtn
              class="full-width"
              color="primary"
              label="GitHub"
              target="_blank"
              :href="WebURL.GITHUB"
              :icon="Icon.CODE"
            />
          </div>

          <div class="col-sm-6 col-xs-12">
            <QBtn
              disable
              class="full-width"
              color="primary"
              label="My Apps"
              target="_blank"
              :href="WebURL.MYAPPS"
              :icon="Icon.WEB"
            />
          </div>
        </div>
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
