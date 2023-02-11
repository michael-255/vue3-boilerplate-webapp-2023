import { RouteName } from '@/constants/globals'
import { useRouter } from 'vue-router'

export default function useGoBack() {
  const router = useRouter()

  /**
   * Go back if pervious state is part of the app history, otherwise go to Dashboard.
   */
  function onGoBack(): void {
    if (router.options.history.state.back) {
      router.back()
    } else {
      router.push({ name: RouteName.DASHBOARD })
    }
  }

  return { onGoBack }
}
