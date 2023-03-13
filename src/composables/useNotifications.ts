import { useQuasar } from 'quasar'
import { Icon } from '@/constants/icons'

/**
 * Simple customizable notifications.
 */
export default function useNotifications() {
  const $q = useQuasar()

  /**
   * Customizable Quasar notification.
   * @param message
   * @param icon
   * @param color
   * @param multiLine
   * @param position
   * @param timeout
   */
  function notify(
    message: string,
    icon: Icon = Icon.INFO,
    color: string = 'info',
    multiLine = false,
    position:
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'center' = 'top',
    timeout = 4000
  ): void {
    const textColor = 'white'

    $q.notify({
      message,
      icon,
      color,
      textColor,
      position,
      multiLine,
      timeout,
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
