import type { QueryResult } from '../models/query.model'

export function evaluateJsonPath(json: string, expression: string): QueryResult {
  // jsonpath-plus 패키지 연동 예정
  void json
  void expression
  return { values: [], error: null }
}
