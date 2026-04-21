export interface JsonPathQuery {
  expression: string
}

export interface QueryResult {
  values: unknown[]
  error: string | null
}
