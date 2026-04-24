export interface JsonPathQuery {
  expression: string
}

export interface QueryResult {
  values: unknown[]
  paths: string[]
  error: string | null
}
