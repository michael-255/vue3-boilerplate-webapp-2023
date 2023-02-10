import { Icon } from '@/constants/globals'
import { useQuasar } from 'quasar'
import SimpleDialog from '@/components/SimpleDialog.vue'

/**
 * Simple customizable dialogs.
 */
export default function useSimpleDialogs() {
  const $q = useQuasar()

  /**
   * Customizable Quasar dialog (confirm).
   * @param title
   * @param message
   * @param onOkFunc Non-returning function
   * @param icon
   * @param color
   */
  function confirmDialog(
    title: string,
    message: string,
    icon: Icon,
    color: string,
    onOkFunc: () => void
  ): void {
    $q.dialog({
      component: SimpleDialog,
      componentProps: {
        type: 'Confirm',
        icon,
        title,
        message,
        color,
        persistent: false,
      },
    }).onOk(() => {
      onOkFunc()
    })
  }

  /**
   * Customizable Quasar dialog (dismiss).
   * @param title
   * @param message
   * @param icon
   * @param color
   */
  function dismissDialog(
    title: string,
    message: string,
    icon: Icon = Icon.INFO,
    color: string = 'info'
  ): void {
    $q.dialog({
      component: SimpleDialog,
      componentProps: {
        type: 'Dismiss',
        icon,
        title,
        message,
        color,
        persistent: false,
      },
    })
  }

  return {
    confirmDialog,
    dismissDialog,
  }
}
