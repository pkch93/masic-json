import type { JsonDocument, IndentSize } from '../models/formatter.model'

export function formatJson(raw: string, indent: IndentSize = 2): JsonDocument {
  try {
    const parsed = JSON.parse(raw)
    return {
      raw,
      formatted: JSON.stringify(parsed, null, indent),
      isValid: true,
      error: null
    }
  } catch (e) {
    const err = e as SyntaxError
    return {
      raw,
      formatted: null,
      isValid: false,
      error: { message: err.message }
    }
  }
}

export function minifyJson(raw: string): JsonDocument {
  try {
    const parsed = JSON.parse(raw)
    return {
      raw,
      formatted: JSON.stringify(parsed),
      isValid: true,
      error: null
    }
  } catch (e) {
    const err = e as SyntaxError
    return {
      raw,
      formatted: null,
      isValid: false,
      error: { message: err.message }
    }
  }
}
