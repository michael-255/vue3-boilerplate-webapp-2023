/**
 * Type that allows for a value to be null or undefined.
 */
export type Optional<T> = T | null | undefined

/**
 * Generic type for an object with string based properties storing any value.
 */
export type AppObject = { [x: string]: any }

/**
 * Generic strings that are reused throughout the app.
 */
export enum AppText {
  APP_NAME = 'Vue 3 Web App Template',
}

/**
 * Limits for various rules and inputs.
 */
export enum Limit {
  FILESIZE = 100_000_000, // ~100 megabytes
}

/**
 * Milliseconds per time value.
 */
export enum Milliseconds {
  PER_DAY = 86_400_000,
  PER_HOUR = 3_600_000,
  PER_MINUTE = 60_000,
  PER_SECOND = 1_000,
}

/**
 * Log retention duration strings.
 */
export enum LogRetention {
  ONE_WEEK = '1 Week',
  ONE_MONTH = '1 Month',
  THREE_MONTHS = '3 Months',
  SIX_MONTHS = '6 Months',
  ONE_YEAR = '1 Year',
  FOREVER = 'Forever',
}

/**
 * Chart graphing time options.
 */
export enum ChartTime {
  ONE_MONTH = '1 Month',
  THREE_MONTHS = '3 Months',
  SIX_MONTHS = '6 Months',
  ONE_YEAR = '1 Year',
  ALL_TIME = 'All Time',
}
