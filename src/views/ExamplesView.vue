<script setup lang="ts">
import { QPage, QCard, QCardSection, QBtn } from 'quasar'
import { Icon, ParentStatus, RecordStatus } from '@/constants/globals'
import useDBExamples from '@/use/useDBExamples'

const { addExample, addExampleRecord } = useDBExamples()

const parentActionsText = `Parent items define the name, description, status, and other information about the item.`
const recordActionsText = `Record items have the fields that hold the data that the Parent item expects it to store.
The relationship is one Parent item to many Record items.`

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
    <div class="row justify-center">
      <div class="col-md-6 col-xs-12">
        <!-- Banner -->
        <QCard flat class="q-mb-sm">
          <QCardSection class="text-h5">
            <QIcon class="q-pb-xs q-pr-xs" :name="Icon.EXAMPLES" />
            Examples
          </QCardSection>
        </QCard>

        <!--##### Expansion Panel #####-->
        <QList bordered class="q-mb-sm">
          <QExpansionItem group="somegroup" :icon="Icon.TABLE" label="Table Options">
            <QCard>
              <QCardSection>
                <div class="text-h6 q-mb-md">Parents</div>
                <div class="q-mb-md">{{ parentActionsText }}</div>
                <div class="q-mb-md">
                  <QBtn label="Create New Example" :icon="Icon.CREATE_PARENT" color="positive" />
                </div>

                <div class="q-mb-md">
                  <QBtn label="Examples Data" :icon="Icon.TABLE" color="info" />
                </div>

                <div class="q-mb-md">
                  <QBtn label="Reports" :icon="Icon.REPORTS" color="accent" />
                </div>

                <div class="text-h6 q-mb-md">Records</div>
                <div class="q-mb-md">{{ recordActionsText }}</div>
                <div class="q-mb-md">
                  <QBtn
                    label="Create New Record"
                    :icon="Icon.CREATE_RECORD"
                    class="q-mr-md"
                    color="positive"
                  />
                </div>
                <div>
                  <QBtn label="Records Data" :icon="Icon.RECORDS" class="q-mr-md" color="info" />
                </div>
              </QCardSection>
            </QCard>
          </QExpansionItem>

          <QSeparator />

          <QExpansionItem group="somegroup" :icon="Icon.CLOSE" label="TESTING">
            <QCard>
              <QCardSection>
                <div class="q-mb-md">
                  <QBtn
                    label="Add Example"
                    :icon="Icon.ADD"
                    color="primary"
                    @click="onAddExampleTEST"
                  />
                </div>
                <div>
                  <QBtn
                    label="Add Example Record"
                    :icon="Icon.ADD"
                    color="primary"
                    @click="onAddExampleRecordTEST"
                  />
                </div>
              </QCardSection>
            </QCard>
          </QExpansionItem>

          <QSeparator />

          <QExpansionItem group="somegroup" :icon="Icon.LIST" label="List Filters">
            <QCard>
              <QCardSection>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
                eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
                architecto suscipit iste eveniet doloribus ullam aliquid.
              </QCardSection>
            </QCard>
          </QExpansionItem>
        </QList>

        <!-- List Examples here... -->
      </div>
    </div>
  </QPage>
</template>
