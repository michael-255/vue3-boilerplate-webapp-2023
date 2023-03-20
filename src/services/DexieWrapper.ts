import Dexie, { type Table } from 'dexie'
import type { DatabaseRecord } from '@/types/models'
import { DatabaseField } from '@/types/database'
import { AppText } from '@/types/misc'
import { DatabaseTable } from '@/types/database'

export class DexieWrapper extends Dexie {
  [DatabaseTable.RECORDS]!: Table<DatabaseRecord>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      [DatabaseTable.RECORDS]: `&[${DatabaseField.TYPE}+${DatabaseField.ID}], [${DatabaseField.TYPE}+${DatabaseField.PARENT_ID}]`,
    })
  }
}

/**
 * Preconfigured DexieWrapper
 */
export const dexieWrapper = new DexieWrapper(AppText.APP_NAME)
