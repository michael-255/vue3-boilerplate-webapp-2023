import { DatabaseField, DatabaseType, type SettingId } from '@/types/database'
import { RouteName } from '@/router/route-names'
import { slugify } from '@/utils/common'
import { useRoute, useRouter } from 'vue-router'
import { getTypeFromSlug } from '@/services/data-utils'
import useLogger from '@/composables/useLogger'

/**
 * Composable with actions that relate to routing and navigation.
 */
export default function useRoutingHelpers() {
  const route = useRoute()
  const router = useRouter()
  const { log } = useLogger()

  const databaseTypeSlug = route?.params?.databaseTypeSlug ?? ''
  const routeDatabaseType = getTypeFromSlug(databaseTypeSlug as string)
  const routeId = route?.params?.[DatabaseField.ID] as string
  const routeParentId = route?.params?.[DatabaseField.PARENT_ID] as string

  /**
   * Returns true if the route databaseType is valid.
   */
  function isRouteDatabaseTypeValid() {
    return Object.values(DatabaseType).includes(routeDatabaseType as DatabaseType)
  }

  /**
   * Returns the banner with the database type appended to the end.
   * @param title
   */
  function bannerType() {
    if (isRouteDatabaseTypeValid()) {
      return `${routeDatabaseType}`
    } else {
      return 'Error'
    }
  }

  /**
   * Go to orphaned records route.
   */
  async function goToOrphanedRecords() {
    try {
      router.push({ name: RouteName.ORPHANED_RECORDS })
    } catch (error) {
      log.error('Error accessing orphaned records route', error)
    }
  }

  /**
   * Go to data table route.
   * @param type
   */
  async function goToData(type: DatabaseType) {
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

  return {
    routeDatabaseType,
    routeId,
    routeParentId,
    isRouteDatabaseTypeValid,
    bannerType,
    goToOrphanedRecords,
    goToData,
    goToInspect,
    goToCreate,
    goToEdit,
    goToCharts,
    goBack,
  }
}
