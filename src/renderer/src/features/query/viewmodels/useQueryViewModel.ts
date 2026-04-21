import { useState, useCallback } from 'react'
import type { JsonPathQuery, QueryResult } from '../models/query.model'
import { evaluateJsonPath } from '../services/query.service'

interface QueryViewModel {
  query: JsonPathQuery
  result: QueryResult | null
  setExpression: (expression: string) => void
  evaluate: (json: string) => void
  reset: () => void
}

export function useQueryViewModel(): QueryViewModel {
  const [query, setQuery] = useState<JsonPathQuery>({ expression: '' })
  const [result, setResult] = useState<QueryResult | null>(null)

  const setExpression = useCallback((expression: string) => {
    setQuery({ expression })
    setResult(null)
  }, [])

  const evaluate = useCallback(
    (json: string) => {
      setResult(evaluateJsonPath(json, query.expression))
    },
    [query.expression]
  )

  const reset = useCallback(() => {
    setQuery({ expression: '' })
    setResult(null)
  }, [])

  return { query, result, setExpression, evaluate, reset }
}
