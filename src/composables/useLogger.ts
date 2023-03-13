import { Icon } from '@/constants/icons'
import { SettingId, Severity } from '@/constants/database'
import { logger } from '@/services/PrettyLogger'
import useNotifications from '@/use/useNotifications'
import useSettingsStore from '@/stores/settings'
import useDatabase from '@/use/useDatabase'

/**
 * Utilities for logging that include notifications and database entries.
 * Never awaiting for any logging calls. Don't want to slow down the UI.
 */
export default function useLogger() {
  const settingsStore = useSettingsStore()
  const { notify } = useNotifications()
  const { addLog } = useDatabase()

  /**
   * Log object with common logger functions.
   * - debug
   * - info
   * - warn
   * - error
   */
  const log = {
    /**
     * DEBUG
     * - Suppressable console logs
     * - Never saved in DB
     * - Suppressable notifications
     */
    debug: (label: string, details?: any) => {
      if (settingsStore[SettingId.SHOW_CONSOLE_LOGS]) {
        logger.debug(`[${Severity.DEBUG}]`, label, details)
      }

      if (settingsStore[SettingId.SHOW_DEBUG_MESSAGES]) {
        notify(label, Icon.DEBUG, 'accent')
      }
    },
    /**
     * INFO
     * - Suppressable console logs
     * - Suppressable notifications
     */
    info: (label: string, details?: any) => {
      const severity = Severity.INFO

      if (settingsStore[SettingId.SHOW_CONSOLE_LOGS]) {
        logger.info(`[${severity}]`, label, details)
      }

      addLog(severity, label, details)

      if (settingsStore[SettingId.SHOW_INFO_MESSAGES]) {
        notify(label, Icon.INFO, 'info')
      }
    },
    /**
     * WARN
     * - Suppressable console logs
     * - Cannot suppress notifications
     */
    warn: (label: string, details?: any) => {
      const severity = Severity.WARN

      if (settingsStore[SettingId.SHOW_CONSOLE_LOGS]) {
        logger.warn(`[${severity}]`, label, details)
      }

      addLog(severity, label, details)

      notify(label, Icon.WARN, 'warning')
    },
    /**
     * ERROR
     * - Suppressable console logs
     * - Cannot suppress notifications
     */
    error: (label: string, details?: any) => {
      const severity = Severity.ERROR

      if (settingsStore[SettingId.SHOW_CONSOLE_LOGS]) {
        logger.error(`[${severity}]`, label, details)
      }

      addLog(severity, label, details)

      notify(label, Icon.ERROR, 'negative')
    },
  }

  /**
   * Simple console log for testing.
   * @param message
   * @param args
   */
  function consoleLog(message: any, ...args: any): void {
    logger.log(message, ...args)
  }

  /**
   * Simple console debug that only displays if consoling logging is on.
   * @param message
   * @param args
   */
  function consoleDebug(message: any, ...args: any): void {
    if (settingsStore[SettingId.SHOW_CONSOLE_LOGS]) {
      logger.debug(message, ...args)
    }
  }

  return {
    log,
    consoleLog,
    consoleDebug,
  }
}
