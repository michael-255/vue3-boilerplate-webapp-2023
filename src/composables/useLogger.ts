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
    debug: async (name: string, details?: any) => {
      if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
        logger.debug(`[${Severity.DEBUG}]`, name, details)
      }

      if (await getSetting(SettingId.SHOW_DEBUG_MESSAGES)) {
        notify(name, Icon.DEBUG, 'accent')
      }
    },
    /**
     * INFO
     * - Suppressable console logs
     * - Suppressable notifications
     */
    info: async (name: string, details?: any) => {
      const severity = Severity.INFO

      if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
        logger.info(`[${severity}]`, name, details)
      }

      await addLog(severity, name, details)

      if (await getSetting(SettingId.SHOW_INFO_MESSAGES)) {
        notify(name, Icon.INFO, 'info')
      }
    },
    /**
     * WARN
     * - Suppressable console logs
     * - Cannot suppress notifications
     */
    warn: async (name: string, details?: any) => {
      const severity = Severity.WARN

      if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
        logger.warn(`[${severity}]`, name, details)
      }

      await addLog(severity, name, details)

      notify(name, Icon.WARN, 'warning')
    },
    /**
     * ERROR
     * - Suppressable console logs
     * - Cannot suppress notifications
     */
    error: async (name: string, details?: any) => {
      const severity = Severity.ERROR

      if (await getSetting(SettingId.SHOW_CONSOLE_LOGS)) {
        logger.error(`[${severity}]`, name, details)
      }

      await addLog(severity, name, details)

      notify(name, Icon.ERROR, 'negative')
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
