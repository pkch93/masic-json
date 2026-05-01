import { useState, useCallback } from 'react'
import type { JsonPathQuery, QueryResult } from '../models/query.model'
import { evaluateJsonPath } from '../services/query.service'
import { inferPlaceholderFromJson } from '../services/query.utils'

interface QueryViewModel {
  query: JsonPathQuery
  displayExpression: string
  expressionPlaceholder: string
  result: QueryResult | null
  setSuffix: (suffix: string) => void
  evaluate: (json: string) => void
  reset: () => void
}

export function useQueryViewModel(json: string): QueryViewModel {
  const [query, setQuery] = useState<JsonPathQuery>({ expression: '' })
  const [result, setResult] = useState<QueryResult | null>(null)

  const displayExpression = query.expression.startsWith('$')
    ? query.expression.slice(1)
    : query.expression

  const expressionPlaceholder = json.trim() ? inferPlaceholderFromJson(json) : '.store.book[*].title'

  const setSuffix = useCallback((suffix: string) => {
    setQuery({ expression: '$' + suffix })
  }, [])

  const evaluate = useCallback(
    (jsonStr: string) => {
      if (!jsonStr.trim()) {
        setResult(null)
        return
      }
      setResult(evaluateJsonPath(jsonStr, query.expression))
    },
    [query.expression]
  )

  const reset = useCallback(() => {
    setQuery({ expression: '' })
    setResult(null)
  }, [])

  return { query, displayExpression, expressionPlaceholder, result, setSuffix, evaluate, reset }
}
