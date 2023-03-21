import type { DatabaseType, SettingId } from '@/types/database'
import { RouteName } from '@/router/route-names'
import { slugify } from '@/utils/common'
import { useRouter } from 'vue-router'
import useLogger from '@/composables/useLogger'

export default function useAppRoutes() {
  const router = useRouter()
  const { log } = useLogger()

  /**
   * Go to data table route. The type can be 'orphaned' to show orphaned records.
   * @param type
   */
  async function onDataRoute(type: DatabaseType | 'orphaned') {
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
  function onInspectRoute(type: DatabaseType, id: string | SettingId) {
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
  function onCreateRoute(type: DatabaseType, parentId?: string) {
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
  function onEditRoute(type: DatabaseType, id: string) {
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
  function onChartsRoute(type: DatabaseType, id: string) {
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
  function onGoBackRoute() {
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
    onDataRoute,
    onInspectRoute,
    onCreateRoute,
    onEditRoute,
    onChartsRoute,
    onGoBackRoute,
  }
}
