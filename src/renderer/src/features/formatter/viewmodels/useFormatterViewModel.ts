import { useState, useCallback, useMemo } from 'react'
import type { IndentSize, ParseError } from '../models/formatter.model'
import { formatJson, minifyJson } from '../services/formatter.service'

interface FormatterViewModel {
  rawJson: string
  indent: IndentSize
  isValid: boolean
  formatError: ParseError | null
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
  setDoubleQuotes: (v: boolean) => void
  setStrictMode: (v: boolean) => void
  setAllowComments: (v: boolean) => void
  setAutoFix: (v: boolean) => void
  setPreserveOrder: (v: boolean) => void
}

const STORAGE_KEY = 'masic-json:editor-config'

function loadConfig(): { indent: IndentSize; doubleQuotes: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { indent: parsed.indent ?? 2, doubleQuotes: parsed.doubleQuotes ?? true }
    }
  } catch {}
  return { indent: 2, doubleQuotes: true }
}

export function useFormatterViewModel(
  onSave?: (json: string, operation: 'format' | 'minify') => void
): FormatterViewModel {
  const saved = useMemo(loadConfig, [])

  const [rawJson, setRawJson] = useState('')
  const [indent, setIndent] = useState<IndentSize>(saved.indent)
  const [doubleQuotes, setDoubleQuotes] = useState(saved.doubleQuotes)
  const [strictMode, _setStrictMode] = useState(true)
  const [allowComments, _setAllowComments] = useState(false)
  const [autoFix, setAutoFix] = useState(true)
  const [preserveOrder, _setPreserveOrder] = useState(true)
  const [formatError, setFormatError] = useState<ParseError | null>(null)

  const isValid = useMemo(() => {
    if (!rawJson.trim()) return false
    const result = formatJson(rawJson, { indent, sortKeys: false })
    return result.isValid
  }, [rawJson, indent])

  const setPreserveOrder = useCallback((v: boolean) => {
    _setPreserveOrder(v)
  }, [])

  const setStrictMode = useCallback((v: boolean) => {
    _setStrictMode(v)
    if (v) _setAllowComments(false)
  }, [])

  const setAllowComments = useCallback((v: boolean) => {
    _setAllowComments(v)
    if (v) _setStrictMode(false)
  }, [])

  const format = useCallback(() => {
    const result = formatJson(rawJson, { indent, sortKeys: false })
    if (result.formatted !== null) {
      setRawJson(result.formatted)
      setFormatError(null)
      onSave?.(result.formatted, 'format')
    } else {
      setFormatError(result.error)
    }
  }, [rawJson, indent, onSave])

  const minify = useCallback(() => {
    const result = minifyJson(rawJson)
    if (result.formatted !== null) {
      setRawJson(result.formatted)
      setFormatError(null)
      onSave?.(result.formatted, 'minify')
    } else {
      setFormatError(result.error)
    }
  }, [rawJson, onSave])

  const clear = useCallback(() => {
    setRawJson('')
    setFormatError(null)
  }, [])

  const saveConfig = useCallback(() => {
    const config = { indent, doubleQuotes }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    if (rawJson.trim()) {
      const result = formatJson(rawJson, { indent, sortKeys: false })
      if (result.formatted !== null) {
        setRawJson(result.formatted)
        setFormatError(null)
      }
    }
  }, [indent, doubleQuotes, rawJson])

  return {
    rawJson,
    indent,
    isValid,
    formatError,
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
    setDoubleQuotes,
    setStrictMode,
    setAllowComments,
    setAutoFix,
    setPreserveOrder
  }
}
