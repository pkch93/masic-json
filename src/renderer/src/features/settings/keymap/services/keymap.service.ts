import type { KeyCombo, KeyMappingConfig, SingleKeyCombo } from '../models/keymap.model'
import { isDoubleCombo } from '../models/keymap.model'

const STORAGE_KEY = 'masic-json:keymap-config'

export function getIsMac(): boolean {
  return navigator.userAgent.toUpperCase().includes('MAC')
}

export function getDefaultKeymap(): KeyMappingConfig {
  const mac = getIsMac()
  return {
    toggle: { key: 'Shift', double: true, intervalMs: 300 },
    format: { key: 'F', meta: false, ctrl: false, alt: false, shift: true },
    minify: { key: 'm', meta: mac, ctrl: false, alt: !mac, shift: false },
    clear: { key: 'Backspace', meta: mac, ctrl: false, alt: !mac, shift: false },
    find: { key: 'f', meta: mac, ctrl: !mac, alt: false, shift: false },
    focusEditor: { key: 'Enter', meta: false, ctrl: false, alt: false, shift: false },
    focusTree: { key: 'F1', meta: false, ctrl: false, alt: false, shift: false },
    focusQuery: { key: 'F2', meta: false, ctrl: false, alt: false, shift: false },
    focusSort: { key: 'F3', meta: false, ctrl: false, alt: false, shift: false }
  }
}

export function loadKeymapConfig(): KeyMappingConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...getDefaultKeymap(), ...parsed }
    }
  } catch {}
  return getDefaultKeymap()
}

export function saveKeymapConfig(config: KeyMappingConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

const KEY_DISPLAY: Record<string, string> = {
  Enter: '↵',
  Escape: 'Esc',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Backspace: '⌫',
  Delete: 'Del',
  Tab: '⇥',
  ' ': 'Space'
}

function displayKey(key: string): string {
  return KEY_DISPLAY[key] ?? (key.length === 1 ? key.toUpperCase() : key)
}

export function formatKeyCombo(combo: KeyCombo): string {
  if (isDoubleCombo(combo)) return `${combo.key} × 2`
  const mac = getIsMac()
  const parts: string[] = []
  if (combo.meta) parts.push(mac ? '⌘' : 'Meta')
  if (combo.ctrl) parts.push(mac ? '⌃' : 'Ctrl')
  if (combo.alt) parts.push(mac ? '⌥' : 'Alt')
  if (combo.shift) parts.push(mac ? '⇧' : 'Shift')
  parts.push(displayKey(combo.key))
  return parts.join(mac ? '' : '+')
}

export function matchesKeyCombo(e: KeyboardEvent, combo: KeyCombo): boolean {
  if (isDoubleCombo(combo)) return false
  const c = combo as SingleKeyCombo
  return (
    e.key === c.key &&
    e.metaKey === c.meta &&
    e.ctrlKey === c.ctrl &&
    e.altKey === c.alt &&
    e.shiftKey === c.shift
  )
}
