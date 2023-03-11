<script setup lang="ts">
import { QInput, QDate, QBtn, QTime, QPopupProxy, date } from 'quasar'
import { type Ref, ref } from 'vue'
import { DatabaseField, Icon } from '@/constants/globals'
import useItemsStore from '@/stores/items'

defineProps<{
  locked?: boolean
}>()

const itemsStore = useItemsStore()
const inputRef: Ref<any> = ref(null)
const displayedDate: Ref<string> = ref('')
const dateTimePicker: Ref<string> = ref('')

// Default component state must be valid
if (itemsStore?.oldItem?.[DatabaseField.UPDATED_TIMESTAMP]) {
  updateDates(itemsStore.oldItem[DatabaseField.UPDATED_TIMESTAMP])
} else {
  updateDates()
}
itemsStore.validateItem[DatabaseField.UPDATED_TIMESTAMP] = true

function updateDates(timestamp: number = new Date().getTime()): void {
  itemsStore.newItem[DatabaseField.UPDATED_TIMESTAMP] = timestamp
  itemsStore.validateItem[DatabaseField.UPDATED_TIMESTAMP] = true
  displayedDate.value = date.formatDate(timestamp, 'ddd, YYYY MMM Do, h:mm A')
}

/**
 * If a picker time exists, sets display date and model ref to the picker time.
 */
function onPickerDateTime(): void {
  if (dateTimePicker.value) {
    updateDates(new Date(dateTimePicker.value).getTime())
  }
}

function validateInput(): void {
  itemsStore.validateItem[DatabaseField.UPDATED_TIMESTAMP] = !!inputRef?.value?.validate()
}
</script>

<template>
  <QCard>
    <QCardSection>
      <div class="text-h6 q-mb-md">
        Updated Date
        <QIcon v-if="locked" :name="Icon.LOCK" color="primary" class="q-pb-xs" />
      </div>

      <div class="q-mb-md">TODO Updated Date</div>

      <QInput
        v-model="displayedDate"
        ref="inputRef"
        label="Updated Date"
        dense
        outlined
        disable
        color="primary"
        hint="Auto formatted"
        @blur="validateInput()"
      >
        <template v-slot:after>
          <!-- Date Picker -->
          <QBtn :disable="locked" :icon="Icon.CALENDAR_DATE" color="primary" class="q-px-sm">
            <QPopupProxy cover transition-show="scale" transition-hide="scale">
              <QDate v-model="dateTimePicker" mask="YYYY-MM-DDTHH:mm:ss.000Z">
                <div class="row items-center justify-end q-gutter-sm">
                  <QBtn label="Cancel" flat v-close-popup />
                  <QBtn label="OK" color="primary" flat @click="onPickerDateTime()" v-close-popup />
                </div>
              </QDate>
            </QPopupProxy>
          </QBtn>

          <!-- Time Picker -->
          <QBtn :disable="locked" :icon="Icon.CLOCK" color="primary" class="q-ml-sm q-px-sm">
            <QPopupProxy cover transition-show="scale" transition-hide="scale">
              <QTime v-model="dateTimePicker" now-btn mask="YYYY-MM-DDTHH:mm:ss.000Z">
                <div class="row items-center justify-end q-gutter-sm">
                  <QBtn label="Cancel" flat v-close-popup />
                  <QBtn label="OK" color="primary" flat @click="onPickerDateTime()" v-close-popup />
                </div>
              </QTime>
            </QPopupProxy>
          </QBtn>

          <!-- Set DateTime to now -->
          <QBtn
            :disable="locked"
            :icon="Icon.CALENDAR_CHECK"
            color="positive"
            class="q-ml-sm q-px-sm"
            @click="updateDates()"
          />
        </template>
      </QInput>
    </QCardSection>
  </QCard>
</template>
