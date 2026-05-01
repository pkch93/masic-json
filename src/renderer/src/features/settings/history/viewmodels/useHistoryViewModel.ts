import { useState, useCallback } from 'react'
import type { HistoryEntry, HistoryOperation } from '../models/history.model'
import {
  loadEntries,
  saveEntries,
  addEntry as addEntryService,
  removeEntry
} from '../services/history.service'

interface HistoryViewModel {
  entries: HistoryEntry[]
  addEntry: (json: string, operation: HistoryOperation) => void
  deleteEntry: (id: string) => void
  clearAll: () => void
}

export function useHistoryViewModel(): HistoryViewModel {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadEntries())

  const addEntry = useCallback((json: string, operation: HistoryOperation) => {
    setEntries((prev) => {
      const next = addEntryService(prev, json, operation)
      saveEntries(next)
      return next
    })
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = removeEntry(prev, id)
      saveEntries(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setEntries([])
    localStorage.removeItem('masic-json:history')
  }, [])

  return { entries, addEntry, deleteEntry, clearAll }
}
