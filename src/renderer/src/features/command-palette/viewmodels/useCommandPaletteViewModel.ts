import { useState, useEffect, useCallback } from 'react'
import type { PaletteAction } from '../models/command-palette.model'

export function useCommandPaletteViewModel(
  actions: PaletteAction[],
  open: boolean,
  onClose: () => void
) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const action = filtered[activeIndex]
        if (action) {
          action.onExecute()
          onClose()
        }
      }
    },
    [filtered, activeIndex, onClose]
  )

  return { query, setQuery, activeIndex, setActiveIndex, filtered, handleKeyDown }
}
