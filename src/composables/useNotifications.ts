import { useQuasar } from 'quasar'
import { Icon } from '@/types/icons'

export default function useNotifications() {
  const $q = useQuasar()

  /**
   * Customizable Quasar notification.
   * @param message
   * @param icon
   * @param color
   */
  function notify(message: string, icon: Icon = Icon.INFO, color: string = 'info') {
    const textColor = 'white'

    $q.notify({
      message,
      icon,
      color,
      textColor,
      position: 'top',
      multiLine: false,
      timeout: 4000,
      actions: [
        {
          label: 'Dismiss',
          color: textColor,
        },
      ],
    })
  }

  return { notify }
}
