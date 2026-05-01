import { useState, useCallback } from 'react'
import type { SortDirection, SortKey, SortOptions, SortResult } from '../models/sort.model'
import { sortJson } from '../services/sort.service'

interface SortViewModel {
  options: SortOptions
  result: SortResult | null
  addKey: () => void
  removeKey: (index: number) => void
  updateKey: (index: number, patch: Partial<SortKey>) => void
  setPath: (path: string) => void
  setDirection: (index: number, dir: SortDirection) => void
  sort: (json: string) => void
  reset: () => void
}

const DEFAULT_OPTIONS: SortOptions = {
  keys: [{ key: '', direction: 'asc' }],
  path: '$'
}

export function useSortViewModel(): SortViewModel {
  const [options, setOptions] = useState<SortOptions>(DEFAULT_OPTIONS)
  const [result, setResult] = useState<SortResult | null>(null)

  const addKey = useCallback(
    () => setOptions((o) => ({ ...o, keys: [...o.keys, { key: '', direction: 'asc' }] })),
    []
  )

  const removeKey = useCallback(
    (index: number) =>
      setOptions((o) => ({ ...o, keys: o.keys.filter((_, i) => i !== index) })),
    []
  )

  const updateKey = useCallback(
    (index: number, patch: Partial<SortKey>) =>
      setOptions((o) => ({
        ...o,
        keys: o.keys.map((k, i) => (i === index ? { ...k, ...patch } : k))
      })),
    []
  )

  const setPath = useCallback((path: string) => setOptions((o) => ({ ...o, path })), [])

  const setDirection = useCallback(
    (index: number, direction: SortDirection) => updateKey(index, { direction }),
    [updateKey]
  )

  const sort = useCallback(
    (json: string) => {
      if (!json.trim()) { setResult(null); return }
      setResult(sortJson(json, options))
    },
    [options]
  )

  const reset = useCallback(() => {
    setOptions(DEFAULT_OPTIONS)
    setResult(null)
  }, [])

  return { options, result, addKey, removeKey, updateKey, setPath, setDirection, sort, reset }
}
