import { getTypeFromSlug } from '@/services/data-utils'
import { DatabaseField } from '@/types/database'
import { useRoute } from 'vue-router'

export default function useRouteParams() {
  const route = useRoute()
  const databaseTypeSlug = route?.params?.databaseTypeSlug ?? ''
  const routeDatabaseType = getTypeFromSlug(databaseTypeSlug as string)
  const routeId = route?.params?.[DatabaseField.ID] as string
  const routeParentId = route?.params?.[DatabaseField.PARENT_ID] as string

  return {
    routeDatabaseType,
    routeId,
    routeParentId,
  }
}
