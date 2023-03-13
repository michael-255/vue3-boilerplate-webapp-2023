import Dexie, { type Table } from 'dexie'
import { DatabaseField, type DatabaseRecord } from '@/constants/database'
import { AppText } from '@/constants/misc'

export class DexieWrapper extends Dexie {
  Records!: Table<DatabaseRecord>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      Records: `&[${DatabaseField.TYPE}+${DatabaseField.ID}], ${DatabaseField.PARENT_ID}}`,
    })
  }
}

/**
 * Preconfigured DexieWrapper
 */
export const dexieWrapper = new DexieWrapper(AppText.APP_NAME)
