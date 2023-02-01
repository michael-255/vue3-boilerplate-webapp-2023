<script setup lang="ts">
import { QPage } from 'quasar'
import { QCard, QCardSection, QBtn } from 'quasar'
import { AppString, Icon, Links } from '@/constants/globals'
import SectionBanner from '@/components/shared/SectionBanner.vue'
</script>

<template>
  <QPage padding>
    <div class="row justify-center">
      <div class="col-md-6 col-sm-8 col-xs-12">
        <SectionBanner title="About" :icon="Icon.INFO" />

        <QCard flat square>
          <QCardSection class="q-pb-xs">
            {{ AppString.APP_NAME }} is a Vue 3 Typescript project created by michael-255 on GitHub.
            It is publicly available using the permissive MIT License.
          </QCardSection>

          <QCardSection>
            <div class="row q-col-gutter-md justify-start">
              <div class="col-sm-6 col-xs-12">
                <QBtn
                  square
                  class="full-width"
                  color="primary"
                  label="GitHub"
                  target="_blank"
                  :href="Links.GITHUB"
                  :icon="Icon.CODE"
                />
              </div>

              <div class="col-sm-6 col-xs-12">
                <QBtn
                  square
                  disable
                  class="full-width"
                  color="primary"
                  label="My Apps"
                  target="_blank"
                  :href="Links.MYAPPS"
                  :icon="Icon.WEB"
                />
              </div>
            </div>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </QPage>
</template>
