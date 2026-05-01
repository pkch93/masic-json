export type HistoryOperation = 'format' | 'minify'

export interface HistoryEntry {
  id: string
  json: string
  label: string
  operation: HistoryOperation
  savedAt: number
  byteSize: number
}
