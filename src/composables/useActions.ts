import type { DatabaseType, SettingId } from '@/types/database'
import { RouteName } from '@/router/route-names'
import { slugify } from '@/utils/common'
import { useRouter } from 'vue-router'
import { Icon } from '@/types/icons'
import type { DatabaseRecord } from '@/types/models'
import useLogger from '@/composables/useLogger'
import useSimpleDialogs from './useSimpleDialogs'
import useDatabase from '@/composables/useDatabase'

/**
 * Composable with actions that relate to CRUD operations and navigation.
 */
export default function useActions() {
  const router = useRouter()
  const { log } = useLogger()
  const { confirmDialog } = useSimpleDialogs()
  const { createRecord, updateRecord, deleteRecord } = useDatabase()

  /**
   * Go to data table route. The type can also be 'orphaned' to show orphaned records.
   * @param type
   */
  async function goToData(type: DatabaseType | 'orphaned') {
    try {
      router.push({
        name: RouteName.DATA,
        params: { databaseTypeSlug: slugify(type) },
      })
    } catch (error) {
      log.error('Error accessing data route', error)
    }
  }

  /**
   * Go to record inspection route.
   * @param type
   * @param id
   */
  function goToInspect(type: DatabaseType, id: string | SettingId) {
    try {
      router.push({
        name: RouteName.ACTION_INSPECT,
        params: {
          databaseTypeSlug: slugify(type),
          id,
        },
      })
    } catch (error) {
      log.error('Error accessing inspect route', error)
    }
  }

  /**
   * Go to record creation route. If parentId is provided, it will be used for child records.
   * @param type
   * @param parentId Optional parent id
   */
  function goToCreate(type: DatabaseType, parentId?: string) {
    try {
      router.push({
        name: RouteName.ACTION_CREATE,
        params: {
          databaseTypeSlug: slugify(type),
          parentId,
        },
      })
    } catch (error) {
      log.error('Error accessing create route', error)
    }
  }

  /**
   * Go to record edit route.
   * @param type
   * @param id
   */
  function goToEdit(type: DatabaseType, id: string) {
    try {
      router.push({
        name: RouteName.ACTION_EDIT,
        params: {
          databaseTypeSlug: slugify(type),
          id,
        },
      })
    } catch (error) {
      log.error('Error accessing edit route', error)
    }
  }

  /**
   * Go to charts route.
   * @param type
   * @param id
   */
  function goToCharts(type: DatabaseType, id: string) {
    try {
      router.push({
        name: RouteName.ACTION_CHARTS,
        params: {
          databaseTypeSlug: slugify(type),
          id,
        },
      })
    } catch (error) {
      log.error('Error accessing charts route', error)
    }
  }

  /**
   * Go back if previous route state is part of the app history, otherwise go to Dashboard.
   */
  function goBack() {
    try {
      if (router?.options?.history?.state?.back) {
        router.back()
      } else {
        router.push({ name: RouteName.DASHBOARD })
      }
    } catch (error) {
      log.error('Error accessing go back route', error)
    }
  }

  // TODO
  async function onCreateRecord(record: DatabaseRecord) {
    confirmDialog(
      'Create Record',
      `Create new record ${record.id} for ${record.type}?`,
      Icon.CREATE,
      'positive',
      async () => {
        try {
          await createRecord(record)
          log.info('Successfully created record', {
            createdRecordType: record.type,
            createdRecordId: record.id,
          })
        } catch (error) {
          log.error('Create failed', error)
        }
      }
    )
  }

  // TODO
  async function onUpdateRecord(type: DatabaseType, originalId: string, record: DatabaseRecord) {
    confirmDialog(
      'Update Record',
      `Update record ${record.id} for ${record.type}?`,
      Icon.EDIT,
      'positive',
      async () => {
        try {
          await updateRecord(type, originalId, record)
          log.info('Successfully Updated record', {
            updatedRecordType: record.type,
            updatedRecordId: record.id,
          })
        } catch (error) {
          log.error('Update failed', error)
        }
      }
    )
  }

  /**
   * On confirmation, delete the matching record from the database.
   * @param type
   * @param id
   */
  async function onDeleteRecord(type: DatabaseType, id: string) {
    confirmDialog(
      'Delete Record',
      `Permanently delete record ${id} from ${type}?`,
      Icon.DELETE,
      'negative',
      async () => {
        try {
          await deleteRecord(type, id)
          log.info('Successfully deleted record', { deletedRecordType: type, deletedRecordId: id })
        } catch (error) {
          log.error('Delete failed', error)
        }
      }
    )
  }

  return {
    goToData,
    goToInspect,
    goToCreate,
    goToEdit,
    goToCharts,
    goBack,
    onCreateRecord,
    onUpdateRecord,
    onDeleteRecord,
  }
}
