import { useState, useCallback } from 'react'
import type { JsonDocument, IndentSize } from '../models/formatter.model'
import { formatJson, minifyJson } from '../services/formatter.service'

interface FormatterViewModel {
  document: JsonDocument | null
  indent: IndentSize
  setRaw: (raw: string) => void
  format: () => void
  minify: () => void
  setIndent: (indent: IndentSize) => void
  reset: () => void
}

export function useFormatterViewModel(): FormatterViewModel {
  const [raw, setRawState] = useState('')
  const [document, setDocument] = useState<JsonDocument | null>(null)
  const [indent, setIndent] = useState<IndentSize>(2)

  const setRaw = useCallback((value: string) => {
    setRawState(value)
    setDocument(null)
  }, [])

  const format = useCallback(() => {
    setDocument(formatJson(raw, indent))
  }, [raw, indent])

  const minify = useCallback(() => {
    setDocument(minifyJson(raw))
  }, [raw])

  const reset = useCallback(() => {
    setRawState('')
    setDocument(null)
  }, [])

  return { document, indent, setRaw, format, minify, setIndent, reset }
}
