export interface SingleKeyCombo {
  key: string
  meta: boolean
  ctrl: boolean
  alt: boolean
  shift: boolean
}

export interface DoubleKeyCombo {
  key: string
  double: true
  intervalMs: number
}

export type KeyCombo = SingleKeyCombo | DoubleKeyCombo

export function isDoubleCombo(combo: KeyCombo): combo is DoubleKeyCombo {
  return 'double' in combo && (combo as DoubleKeyCombo).double === true
}

export type ActionId =
  | 'toggle'
  | 'format'
  | 'minify'
  | 'clear'
  | 'find'
  | 'focusEditor'
  | 'focusTree'
  | 'focusQuery'
  | 'focusSort'

export type KeyMappingConfig = Record<ActionId, KeyCombo>

export const ACTION_LABELS: Record<ActionId, string> = {
  toggle: 'Toggle Palette',
  format: 'Format JSON',
  minify: 'Minify JSON',
  clear: 'Clear',
  find: 'Find in Editor',
  focusEditor: 'Focus Editor',
  focusTree: 'Tree View',
  focusQuery: 'JSON Path',
  focusSort: 'Sort'
}

export const ACTION_ORDER: ActionId[] = [
  'toggle',
  'format',
  'minify',
  'clear',
  'find',
  'focusEditor',
  'focusTree',
  'focusQuery',
  'focusSort'
]
