import type { HistoryEntry, HistoryOperation } from '../models/history.model'

const STORAGE_KEY = 'masic-json:history'
const MAX_ENTRIES = 50

export function loadEntries(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return []
}

export function saveEntries(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function addEntry(
  entries: HistoryEntry[],
  json: string,
  operation: HistoryOperation
): HistoryEntry[] {
  if (entries[0]?.json === json) return entries

  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    json,
    label: generateLabel(json),
    operation,
    savedAt: Date.now(),
    byteSize: json.length
  }

  return [entry, ...entries].slice(0, MAX_ENTRIES)
}

export function removeEntry(entries: HistoryEntry[], id: string): HistoryEntry[] {
  return entries.filter((e) => e.id !== id)
}

export function generateLabel(json: string): string {
  try {
    const parsed = JSON.parse(json)
    if (Array.isArray(parsed)) return `Array [${parsed.length} items]`
    const keys = Object.keys(parsed)
    if (keys.length === 0) return 'Empty object'
    if (keys.length === 1) return `{ "${keys[0]}" }`
    return `{ "${keys[0]}", "${keys[1]}"${keys.length > 2 ? ', …' : ''} }`
  } catch {
    return json.slice(0, 40).replace(/\s+/g, ' ').trim()
  }
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hours ago`
  if (diff < 172_800_000) return 'yesterday'
  return new Date(ts).toLocaleDateString()
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}
