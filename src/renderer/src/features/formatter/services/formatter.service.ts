import type { JsonDocument, ParseError, IndentSize } from '../models/formatter.model'

export interface FormatOptions {
  indent: IndentSize
  sortKeys?: boolean
}

function parseRaw(raw: string): { value: unknown } | { error: ParseError } {
  try {
    return { value: JSON.parse(raw) }
  } catch (e) {
    return { error: { message: e instanceof Error ? e.message : 'Parse error' } }
  }
}

function sortedReplacer(_key: string, val: unknown): unknown {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return Object.fromEntries(
      Object.entries(val as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b))
    )
  }
  return val
}

export function formatJson(raw: string, options: FormatOptions = { indent: 2 }): JsonDocument {
  const parsed = parseRaw(raw)
  if ('error' in parsed) return { raw, formatted: null, isValid: false, error: parsed.error }

  const replacer = options.sortKeys ? sortedReplacer : undefined
  return {
    raw,
    formatted: JSON.stringify(parsed.value, replacer, options.indent),
    isValid: true,
    error: null
  }
}

export function minifyJson(raw: string): JsonDocument {
  const parsed = parseRaw(raw)
  if ('error' in parsed) return { raw, formatted: null, isValid: false, error: parsed.error }
  return { raw, formatted: JSON.stringify(parsed.value), isValid: true, error: null }
}
