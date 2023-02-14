import type { IndexableType } from 'dexie'
import { TableName, Field, Severity } from '@/constants/globals'
import { dexieWrapper } from '@/services/DexieWrapper'
import type { Log } from '@/models/models'

export default function useDBLogs() {
  /**
   * Adds a Log to the database.
   * @param severity
   * @param label
   * @param error
   * @param location
   * @returns Id of new Log
   */
  async function addLog(severity: Severity, label: string, details?: any): Promise<IndexableType> {
    const log: Log = {
      [Field.TIMESTAMP]: new Date().getTime(),
      [Field.SEVERITY]: severity,
      [Field.LABEL]: label,
      [Field.DETAILS]: details,
    }

    return await dexieWrapper.table(TableName.LOGS).add(log)
  }

  return { addLog }
}
