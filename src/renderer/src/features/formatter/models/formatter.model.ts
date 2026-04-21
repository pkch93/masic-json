export interface JsonDocument {
  raw: string
  formatted: string | null
  isValid: boolean
  error: ParseError | null
}

export interface ParseError {
  message: string
  line?: number
  column?: number
}

export type IndentSize = 2 | 4
