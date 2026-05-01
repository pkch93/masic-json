import { JSONPath } from 'jsonpath-plus'
import type { SortOptions, SortResult } from '../models/sort.model'

type JsonValue = string | number | boolean | object | null | JsonValue[]

function getNestedValue(obj: unknown, key: string): unknown {
  const parts = key.split('.')
  let cur: unknown = obj
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[part]
  }
  return cur
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'string' && typeof b === 'string')
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  return String(a).localeCompare(String(b))
}

export function sortJson(json: string, options: SortOptions): SortResult {
  if (!json.trim()) return { sorted: null, count: 0, error: null }

  const activeKeys = options.keys.filter((k) => k.key.trim())
  if (activeKeys.length === 0) return { sorted: null, count: 0, error: null }

  let data: JsonValue
  try {
    data = JSON.parse(json) as JsonValue
  } catch (e) {
    return { sorted: null, count: 0, error: `Invalid JSON: ${(e as Error).message}` }
  }

  const targetPath = options.path.trim() || '$'
  let arr: unknown[]

  try {
    const matches = JSONPath({ path: targetPath, json: data }) as unknown[]
    if (!matches || matches.length === 0)
      return { sorted: null, count: 0, error: '경로에 해당하는 값이 없습니다.' }
    const match = matches[0]
    if (!Array.isArray(match))
      return { sorted: null, count: 0, error: '대상이 배열이 아닙니다.' }
    arr = match
  } catch (e) {
    return { sorted: null, count: 0, error: `잘못된 경로: ${(e as Error).message}` }
  }

  const sorted = [...arr].sort((a, b) => {
    for (const { key, direction } of activeKeys) {
      const va = getNestedValue(a, key)
      const vb = getNestedValue(b, key)
      const cmp = compareValues(va, vb)
      if (cmp !== 0) return direction === 'desc' ? -cmp : cmp
    }
    return 0
  })

  return { sorted, count: sorted.length, error: null }
}
