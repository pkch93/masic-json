export type SortDirection = 'asc' | 'desc'

export interface SortKey {
  key: string
  direction: SortDirection
}

export interface SortOptions {
  keys: SortKey[]
  path: string
}

export interface SortResult {
  sorted: unknown[] | null
  count: number
  error: string | null
}
