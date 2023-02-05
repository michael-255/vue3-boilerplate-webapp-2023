import type { IndexableType } from 'dexie'
import { TableName, Field, Severity } from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import type { IDBLog } from '@/models/core'

export default function useDatabaseLogs() {
  /**
   * Adds a Log to the database.
   * @param severity
   * @param label
   * @param error
   * @param location
   * @returns Id of new Log
   */
  async function addLog(severity: Severity, label: string, details?: any): Promise<IndexableType> {
    const log: IDBLog = {
      [Field.CREATED_TIMESTAMP]: new Date().getTime(),
      [Field.SEVERITY]: severity,
      [Field.LABEL]: label,
      [Field.DETAILS]: details,
    }

    return await dexieWrapper.table(TableName.LOGS).add(log)
  }

  return { addLog }
}
