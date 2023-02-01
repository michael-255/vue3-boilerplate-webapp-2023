<script setup lang="ts">
import { QPage } from 'quasar'
import { QCard, QCardSection, QBtn } from 'quasar'
import { AppString, Icon, Links } from '@/constants/globals'
</script>

<template>
  <QPage padding>
    <div class="row justify-center">
      <div class="col-md-6 col-sm-8 col-xs-12">
        <QCard>
          <QCardSection class="bg-primary text-white text-h5">
            <QIcon class="q-pb-xs q-pr-xs" :name="Icon.INFO" />
            About
          </QCardSection>

          <QCardSection class="q-pb-xs">
            {{ AppString.APP_NAME }} is a Vue 3 Typescript project created by michael-255 on GitHub
          </QCardSection>

          <QCardSection>
            <div class="row q-col-gutter-md justify-start">
              <div class="col-sm-6 col-xs-12">
                <QBtn
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
