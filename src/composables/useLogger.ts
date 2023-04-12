import { Icon } from '@/types/icons'
import { DatabaseType, SettingId, Severity } from '@/types/database'
import { logger } from '@/services/PrettyLogger'
import useNotifications from '@/composables/useNotifications'
import DB from '@/services/LocalDatabase'

/**
 * Composable with utilities for logging that include notifications and database entries.
 */
export default function useLogger() {
  const { notify } = useNotifications()

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
      if ((await DB.getRecord(DatabaseType.SETTING, SettingId.SHOW_CONSOLE_LOGS))?.value) {
        logger.debug(`[${Severity.DEBUG}]`, name, details)
      }

      if ((await DB.getRecord(DatabaseType.SETTING, SettingId.SHOW_DEBUG_MESSAGES))?.value) {
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

      if ((await DB.getRecord(DatabaseType.SETTING, SettingId.SHOW_CONSOLE_LOGS))?.value) {
        logger.info(`[${severity}]`, name, details)
      }

      await DB.addLog(severity, name, details)

      if ((await DB.getRecord(DatabaseType.SETTING, SettingId.SHOW_INFO_MESSAGES))?.value) {
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

      if ((await DB.getRecord(DatabaseType.SETTING, SettingId.SHOW_CONSOLE_LOGS))?.value) {
        logger.warn(`[${severity}]`, name, details)
      }

      await DB.addLog(severity, name, details)

      notify(name, Icon.WARN, 'warning')
    },
    /**
     * ERROR
     * - Suppressable console logs
     * - Cannot suppress notifications
     */
    error: async (name: string, details?: any) => {
      const severity = Severity.ERROR

      if ((await DB.getRecord(DatabaseType.SETTING, SettingId.SHOW_CONSOLE_LOGS))?.value) {
        logger.error(`[${severity}]`, name, details)
      }

      await DB.addLog(severity, name, details)

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
    if (await DB.getRecord(DatabaseType.SETTING, SettingId.SHOW_CONSOLE_LOGS)) {
      logger.debug(message, ...args)
    }
  }

  return {
    log,
    consoleLog,
    consoleDebug,
  }
}
