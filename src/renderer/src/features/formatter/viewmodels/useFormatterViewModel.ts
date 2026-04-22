import { useState, useCallback, useMemo } from 'react'
import type { IndentSize, ParseError } from '../models/formatter.model'
import { formatJson, minifyJson } from '../services/formatter.service'

interface FormatterViewModel {
  rawJson: string
  indent: IndentSize
  isValid: boolean
  formatError: ParseError | null
  sortKeys: boolean
  doubleQuotes: boolean
  strictMode: boolean
  allowComments: boolean
  autoFix: boolean
  preserveOrder: boolean
  setRawJson: (value: string) => void
  format: () => void
  minify: () => void
  clear: () => void
  saveConfig: () => void
  setIndent: (indent: IndentSize) => void
  setSortKeys: (v: boolean) => void
  setDoubleQuotes: (v: boolean) => void
  setStrictMode: (v: boolean) => void
  setAllowComments: (v: boolean) => void
  setAutoFix: (v: boolean) => void
  setPreserveOrder: (v: boolean) => void
}

const STORAGE_KEY = 'masic-json:editor-config'

function loadConfig(): { indent: IndentSize; sortKeys: boolean; doubleQuotes: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { indent: 2, sortKeys: false, doubleQuotes: true }
}

export function useFormatterViewModel(): FormatterViewModel {
  const saved = useMemo(loadConfig, [])

  const [rawJson, setRawJson] = useState('')
  const [indent, setIndent] = useState<IndentSize>(saved.indent)
  const [sortKeys, _setSortKeys] = useState(saved.sortKeys)
  const [doubleQuotes, setDoubleQuotes] = useState(saved.doubleQuotes)
  const [strictMode, _setStrictMode] = useState(true)
  const [allowComments, _setAllowComments] = useState(false)
  const [autoFix, setAutoFix] = useState(true)
  const [preserveOrder, _setPreserveOrder] = useState(true)
  const [formatError, setFormatError] = useState<ParseError | null>(null)

  // Derive isValid from the same service path used at format time
  const isValid = useMemo(() => {
    if (!rawJson.trim()) return false
    const result = formatJson(rawJson, { indent, sortKeys })
    return result.isValid
  }, [rawJson, indent, sortKeys])

  // Mutual exclusion: Sort Keys ↔ Preserve Order
  const setSortKeys = useCallback((v: boolean) => {
    _setSortKeys(v)
    if (v) _setPreserveOrder(false)
  }, [])

  const setPreserveOrder = useCallback((v: boolean) => {
    _setPreserveOrder(v)
    if (v) _setSortKeys(false)
  }, [])

  // Mutual exclusion: Strict Mode ↔ Allow Comments
  const setStrictMode = useCallback((v: boolean) => {
    _setStrictMode(v)
    if (v) _setAllowComments(false)
  }, [])

  const setAllowComments = useCallback((v: boolean) => {
    _setAllowComments(v)
    if (v) _setStrictMode(false)
  }, [])

  const format = useCallback(() => {
    const result = formatJson(rawJson, { indent, sortKeys })
    if (result.formatted !== null) {
      setRawJson(result.formatted)
      setFormatError(null)
    } else {
      setFormatError(result.error)
    }
  }, [rawJson, indent, sortKeys])

  const minify = useCallback(() => {
    const result = minifyJson(rawJson)
    if (result.formatted !== null) {
      setRawJson(result.formatted)
      setFormatError(null)
    } else {
      setFormatError(result.error)
    }
  }, [rawJson])

  const clear = useCallback(() => {
    setRawJson('')
    setFormatError(null)
  }, [])

  const saveConfig = useCallback(() => {
    const config = { indent, sortKeys, doubleQuotes }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    // Reformat with current config if document is valid
    if (rawJson.trim()) {
      const result = formatJson(rawJson, { indent, sortKeys })
      if (result.formatted !== null) {
        setRawJson(result.formatted)
        setFormatError(null)
      }
    }
  }, [indent, sortKeys, doubleQuotes, rawJson])

  return {
    rawJson,
    indent,
    isValid,
    formatError,
    sortKeys,
    doubleQuotes,
    strictMode,
    allowComments,
    autoFix,
    preserveOrder,
    setRawJson,
    format,
    minify,
    clear,
    saveConfig,
    setIndent,
    setSortKeys,
    setDoubleQuotes,
    setStrictMode,
    setAllowComments,
    setAutoFix,
    setPreserveOrder
  }
}
