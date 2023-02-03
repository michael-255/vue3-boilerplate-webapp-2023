import { v4 as uuidv4 } from 'uuid'
import * as slug from 'slugify'
import { DateTime } from 'luxon'
import { Milliseconds } from '@/constants/globals'

/**
 * Generates a random id using the UUID package.
 * @returns Random 36 (including dashes) character id
 */
export function uuid(): string {
  return uuidv4()
}

/**
 * Slugify a string so it can be used as a URL.
 * @param str
 * @returns Slugified string
 */
export function slugify(str: string): string {
  return slug.default(str, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: 'en',
    trim: true,
  })
}

/**
 * Generates a custom id based on parameters.
 * @param obj.segmentLengths Array of segment lengths (recommend 1-8 each)
 * @param obj.delimiter Single string character delimiter for id segments
 * @returns Custom random id
 */
export function customId({
  segmentLengths = [4, 4, 4],
  delimiter = '-',
}: { segmentLengths?: number[]; delimiter?: string } = {}): string {
  if (segmentLengths.length < 1) {
    throw new Error('segmentLengths parameter must have at least one element')
  } else if (segmentLengths.some((el) => typeof el !== 'number' || el < 1)) {
    throw new Error('segmentLengths elements must be positive numbers')
  } else if (typeof delimiter !== 'string' || delimiter.length > 1) {
    throw new Error('delimiter must be a string of length 1 or an empty string')
  }

  const createIdSegment = (len: number): string => {
    // Note: Math.random only consistently produces 8 unique base 36 characters
    return Math.random()
      .toString(36)
      .substring(2, len + 2) // Adjusted to account for 2 trimmed characters
      .padEnd(len, 'X') // Ensures length is always reached with filler X's
  }

  let idStr = ''

  segmentLengths.forEach((segLen: number) => {
    idStr += `${createIdSegment(Math.floor(segLen))}${delimiter}`
  })

  if (delimiter) {
    idStr = idStr.slice(0, -1) // remove last delimitter
  }

  return idStr.toUpperCase()
}

/**
 * Truncates a string if it exceeds the provided length.
 * @param str String to be truncated
 * @param len Max length of truncated string
 * @returns Truncated string with a '...' at the end
 */
export function truncateString(
  str: string | null | undefined,
  len = 40,
  ending: '...' | '*' = '...'
): string {
  if (str) {
    if (str.length <= len) {
      return str
    } else {
      return str.slice(0, len) + ending
    }
  }
  return '-'
}

/**
 * Converts timestamp to a human readable local date string.
 * @param timestamp
 * @returns Example: Sun Jun 6 2022 1:30:45 PM EDT
 */
export function getDateFromTimestamp(timestamp?: number): string | undefined {
  if (!timestamp) {
    return undefined
  }

  const luxonDate = DateTime.fromMillis(timestamp).toFormat('ccc LLL d yyyy ttt')

  if (!luxonDate || luxonDate === 'Invalid DateTime') {
    return undefined
  } else {
    return luxonDate
  }
}

/**
 * Converts milliseconds into a time duration string.
 * @param milliseconds
 * @returns Example: 1d 14h 6m 33s
 */
export function getDurationFromMilliseconds(milliseconds?: number): string | undefined {
  if (!milliseconds || milliseconds < 1000) {
    return undefined
  }

  const seconds = Math.floor((milliseconds / Milliseconds.PER_SECOND) % 60)
  const minutes = Math.floor((milliseconds / Milliseconds.PER_MINUTE) % 60)
  const hours = Math.floor((milliseconds / Milliseconds.PER_HOUR) % 24)
  const days = Math.floor(milliseconds / Milliseconds.PER_DAY)

  const daysStr = days > 0 ? `${days}d ` : ''
  const hoursStr = hours > 0 ? `${hours}h ` : ''
  const minutesStr = minutes > 0 ? `${minutes}m ` : ''
  const secondsStr = seconds > 0 ? `${seconds}s` : ''

  return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`
}
