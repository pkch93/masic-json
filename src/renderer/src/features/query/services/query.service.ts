import { JSONPath } from 'jsonpath-plus'
import type { QueryResult } from '../models/query.model'

type JsonValue = string | number | boolean | object | null | JsonValue[]

export function evaluateJsonPath(json: string, expression: string): QueryResult {
  if (!expression.trim()) return { values: [], paths: [], error: null }

  let data: JsonValue
  try {
    data = JSON.parse(json) as JsonValue
  } catch (e) {
    return { values: [], paths: [], error: `Invalid JSON: ${(e as Error).message}` }
  }

  try {
    const results = JSONPath({
      path: expression,
      json: data,
      resultType: 'all'
    }) as Array<{ value: unknown; path: string }>

    return {
      values: results.map((r) => r.value),
      paths: results.map((r) => r.path),
      error: null
    }
  } catch (e) {
    return { values: [], paths: [], error: `Invalid JSONPath: ${(e as Error).message}` }
  }
}
