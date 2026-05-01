const FALLBACK = '.store.book[*].title'

function isNonNullObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function inferFromObject(obj: Record<string, unknown>): string | null {
  const firstKey = Object.keys(obj)[0]
  if (!firstKey) return null
  const nested = obj[firstKey]
  if (isNonNullObject(nested)) {
    const secondKey = Object.keys(nested)[0]
    if (secondKey) return `.${firstKey}.${secondKey}`
  }
  if (Array.isArray(nested) && nested.length > 0 && isNonNullObject(nested[0])) {
    const itemKey = Object.keys(nested[0])[0]
    if (itemKey) return `.${firstKey}[*].${itemKey}`
  }
  return `.${firstKey}`
}

export function inferPlaceholderFromJson(json: string): string {
  try {
    const parsed = JSON.parse(json)
    if (Array.isArray(parsed) && parsed.length > 0 && isNonNullObject(parsed[0])) {
      const firstKey = Object.keys(parsed[0])[0]
      if (firstKey) return `[*].${firstKey}`
    }
    if (isNonNullObject(parsed)) {
      return inferFromObject(parsed) ?? FALLBACK
    }
  } catch {
    // invalid JSON
  }
  return FALLBACK
}
