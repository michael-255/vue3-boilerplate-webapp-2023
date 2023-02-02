<script setup lang="ts">
import { QPage, QCard, QCardSection, QBtn } from 'quasar'
import { Icon, ParentStatus, RecordStatus } from '@/constants/globals'
import useDBExamples from '@/use/useDBExamples'

const { addExample, addExampleRecord } = useDBExamples()

const parentActionsText = `Parent items define the name, description, status, and other information about the item. You
can create more Parent items, view reports for them, and access the data table for more options.`
const recordActionsText = `Record items have the fields that hold the data that the Parent item expects it to store.
The relationship is one Parent item to many Record items. You can create more Record items and access the data table for
more options.`

async function onAddExampleTEST(): Promise<void> {
  await addExample({
    id: 'test-parent-id',
    createdTimestamp: new Date().getTime(),
    name: 'Test Example',
    description: 'Testing Example Parent',
    favorite: false,
    parentStatus: ParentStatus.ENABLED,
    exampleMessage: 'This is the Example message field.',
  })
}

async function onAddExampleRecordTEST(): Promise<void> {
  await addExampleRecord({
    id: 'test-record-id',
    createdTimestamp: new Date().getTime(),
    parentId: 'test-parent-id',
    note: 'Example Record Note',
    recordStatus: RecordStatus.NONE,
    exampleNumber: 7,
  })
}
</script>

<template>
  <QPage padding>
    <!-- Banner -->
    <QCard flat square class="q-mb-sm">
      <QCardSection class="text-h5">
        <QIcon class="q-pb-xs q-pr-xs" :name="Icon.EXAMPLES" />
        Examples
        <!-- TODO -->
        <QBtn flat rounded :icon="Icon.MENU_VERT" color="grey" class="absolute-right q-ma-xs" />
      </QCardSection>
    </QCard>

    <!--##### Parents #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Parents</div>

        <div class="q-mb-md">{{ parentActionsText }}</div>
        <QBtn round :icon="Icon.ADD" class="q-mr-md" color="positive" />
        <QBtn round :icon="Icon.REPORTS" class="q-mr-md" color="accent" />
        <QBtn round :icon="Icon.TABLE" class="q-mr-md" color="warning" />
      </QCardSection>
    </QCard>

    <!--##### Records #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">Records</div>

        <div class="q-mb-md">{{ recordActionsText }}</div>
        <QBtn round :icon="Icon.ADD" class="q-mr-md" color="positive" />
        <QBtn round :icon="Icon.TABLE" class="q-mr-md" color="warning" />
      </QCardSection>
    </QCard>

    <!--##### TESTING #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection>
        <div class="text-h6 q-mb-md">TESTING</div>

        <QBtn
          square
          label="Add Example"
          :icon="Icon.ADD"
          class="q-mr-md"
          color="primary"
          @click="onAddExampleTEST"
        />
        <QBtn
          square
          label="Add Example Record"
          :icon="Icon.ADD"
          class="q-mr-md"
          color="primary"
          @click="onAddExampleRecordTEST"
        />
      </QCardSection>
    </QCard>

    <!--##### List View #####-->
    <QCard flat square class="q-mb-sm">
      <QCardSection class="text-h5">
        <QIcon class="q-pb-xs q-pr-xs" :name="Icon.LIST" />
        List View
        <!-- TODO -->
        <QBtn flat rounded :icon="Icon.MENU_VERT" color="grey" class="absolute-right q-ma-xs" />
      </QCardSection>
    </QCard>
  </QPage>
</template>
