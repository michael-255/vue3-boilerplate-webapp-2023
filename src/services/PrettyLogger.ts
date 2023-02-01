import { AppString, AppColor } from '@/constants/globals'
import { colors } from 'quasar'

const { getPaletteColor } = colors

/**
 * PrettyLogger adds some style to your console.
 * @param name Logger name appearing in the console
 */
export class PrettyLogger {
  private name: string
  private style: {
    log: string
    debug: string
    info: string
    warn: string
    error: string
    critical: string
  }

  constructor(name = 'Logger') {
    this.name = `%c${name}`

    const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white;'
    this.style = {
      log: `${baseStyle} background-color: ${getPaletteColor(AppColor.LOG)};`,
      debug: `${baseStyle} background-color: ${getPaletteColor(AppColor.DEBUG)};`,
      info: `${baseStyle} background-color: ${getPaletteColor(AppColor.INFO)};`,
      warn: `${baseStyle} background-color: ${getPaletteColor(AppColor.WARN)};`,
      error: `${baseStyle} background-color: ${getPaletteColor(AppColor.ERROR)};`,
      critical: `${baseStyle} background-color: ${getPaletteColor(AppColor.CRITICAL)};`,
    }
  }

  log(message: any, ...args: any): void {
    console.log(this.name, this.style.log, message, ...args)
  }

  debug(message: any, ...args: any): void {
    console.log(this.name, this.style.debug, message, ...args)
  }

  info(message: any, ...args: any): void {
    console.log(this.name, this.style.info, message, ...args)
  }

  warn(message: any, ...args: any): void {
    console.warn(this.name, this.style.warn, message, ...args)
  }

  error(message: any, ...args: any): void {
    console.error(this.name, this.style.error, message, ...args)
  }

  critical(message: any, ...args: any): void {
    console.error(this.name, this.style.critical, message, ...args)
  }

  trace(message: any, ...args: any): void {
    console.trace(this.name, this.style.log, message, ...args)
  }

  // Only appears as a table if you pass an iterable as the first argument
  table(...args: any): void {
    console.table(...args)
  }
}

/**
 * Preconfigured logger
 */
export const logger = new PrettyLogger(AppString.APP_NAME)
