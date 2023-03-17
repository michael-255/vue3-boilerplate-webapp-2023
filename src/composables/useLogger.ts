import { Icon } from '@/types/icons'
import { SettingId, Severity } from '@/types/database'
import { logger } from '@/services/PrettyLogger'
import useNotifications from '@/composables/useNotifications'
import useDatabase from '@/composables/useDatabase'

/**
 * Utilities for logging that include notifications and database entries.
 */
export default function useLogger() {
  const { notify } = useNotifications()
  const { getSetting, addLog } = useDatabase()

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
    debug: async (label: string, details?: any) => {
      if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
        logger.debug(`[${Severity.DEBUG}]`, label, details)
      }

      if (await getSetting(SettingId.SHOW_DEBUG_MESSAGES)) {
        notify(label, Icon.DEBUG, 'accent')
      }
    },
    /**
     * INFO
     * - Suppressable console logs
     * - Suppressable notifications
     */
    info: async (label: string, details?: any) => {
      const severity = Severity.INFO

      if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
        logger.info(`[${severity}]`, label, details)
      }

      await addLog(severity, label, details)

      if (await getSetting(SettingId.SHOW_INFO_MESSAGES)) {
        notify(label, Icon.INFO, 'info')
      }
    },
    /**
     * WARN
     * - Suppressable console logs
     * - Cannot suppress notifications
     */
    warn: async (label: string, details?: any) => {
      const severity = Severity.WARN

      if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
        logger.warn(`[${severity}]`, label, details)
      }

      await addLog(severity, label, details)

      notify(label, Icon.WARN, 'warning')
    },
    /**
     * ERROR
     * - Suppressable console logs
     * - Cannot suppress notifications
     */
    error: async (label: string, details?: any) => {
      const severity = Severity.ERROR

      if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
        logger.error(`[${severity}]`, label, details)
      }

      await addLog(severity, label, details)

      notify(label, Icon.ERROR, 'negative')
    },
  }

  /**
   * Simple console log for testing.
   * @param message
   * @param args
   */
  function consoleLog(message: any, ...args: any) {
    logger.log(message, ...args)
  }

  /**
   * Simple console debug that only displays if consoling logging is on.
   * @param message
   * @param args
   */
  async function consoleDebug(message: any, ...args: any) {
    if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
      logger.debug(message, ...args)
    }
  }

  return {
    log,
    consoleLog,
    consoleDebug,
  }
}
