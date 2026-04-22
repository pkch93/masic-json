import { linter, type Diagnostic } from '@codemirror/lint'
import type { EditorView } from '@codemirror/view'

export const jsonLinter = linter((view: EditorView): Diagnostic[] => {
  const text = view.state.doc.toString()
  if (!text.trim()) return []

  try {
    JSON.parse(text)
    return []
  } catch (e) {
    const err = e as Error
    const range = locateError(err.message, text)
    return [
      {
        from: range.from,
        to: range.to,
        severity: 'error',
        message: humanizeMessage(err.message)
      }
    ]
  }
})

function locateError(message: string, text: string): { from: number; to: number } {
  const length = text.length
  const clamp = (n: number): number => Math.max(0, Math.min(n, length))

  const positionMatch = message.match(/at position (\d+)/i)
  if (positionMatch) {
    const pos = clamp(parseInt(positionMatch[1], 10))
    return { from: pos, to: clamp(pos + 1) }
  }

  const lineColMatch = message.match(/line (\d+) column (\d+)/i)
  if (lineColMatch) {
    const line = parseInt(lineColMatch[1], 10)
    const column = parseInt(lineColMatch[2], 10)
    const pos = lineColumnToOffset(text, line, column)
    return { from: pos, to: clamp(pos + 1) }
  }

  return { from: 0, to: length }
}

function lineColumnToOffset(text: string, line: number, column: number): number {
  let currentLine = 1
  let offset = 0
  for (let i = 0; i < text.length && currentLine < line; i++) {
    if (text[i] === '\n') {
      currentLine++
      offset = i + 1
    }
  }
  return Math.min(offset + Math.max(0, column - 1), text.length)
}

function humanizeMessage(message: string): string {
  const cleaned = message.replace(/^JSON\.parse:\s*/i, '').trim()
  return cleaned.length > 0 ? cleaned : message
}
