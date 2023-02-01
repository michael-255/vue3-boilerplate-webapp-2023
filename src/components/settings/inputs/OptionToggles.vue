<script setup lang="ts">
import { QToggle } from 'quasar'
import { computed } from 'vue'
import { SettingKey } from '@/constants/globals'
import useSettingsStore from '@/stores/settings'
import useDBSettings from '@/use/useDBSettings'

const settingsStore = useSettingsStore()
const { setSetting } = useDBSettings()

const darkMode = computed({
  get() {
    return !!settingsStore[SettingKey.DARK_MODE]
  },
  async set(bool: boolean) {
    await setSetting(SettingKey.DARK_MODE, bool)
  },
})

const showConsoleLogs = computed({
  get() {
    return !!settingsStore[SettingKey.SHOW_CONSOLE_LOGS]
  },
  async set(bool: boolean) {
    await setSetting(SettingKey.SHOW_CONSOLE_LOGS, bool)
  },
})

const showDebugMessages = computed({
  get() {
    return !!settingsStore[SettingKey.SHOW_DEBUG_MESSAGES]
  },
  async set(bool: boolean) {
    await setSetting(SettingKey.SHOW_DEBUG_MESSAGES, bool)
  },
})

const saveInfoMessages = computed({
  get() {
    return !!settingsStore[SettingKey.SAVE_INFO_MESSAGES]
  },
  async set(bool: boolean) {
    await setSetting(SettingKey.SAVE_INFO_MESSAGES, bool)
  },
})
</script>

<template>
  <div>
    <div>
      <QToggle v-model="darkMode" label="Dark Mode" />
    </div>

    <div>
      <QToggle v-model="showConsoleLogs" label="Show Console Logs" />
    </div>

    <div>
      <QToggle v-model="showDebugMessages" label="Show Debug Messages" />
    </div>

    <div>
      <QToggle v-model="saveInfoMessages" label="Save Info Messages" />
    </div>
  </div>
</template>
