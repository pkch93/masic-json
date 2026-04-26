import type { TreeNode } from '../models/json-tree-view.model'

export function extractTopLevel(value: string): TreeNode[] {
  try {
    const parsed = JSON.parse(value)
    if (typeof parsed !== 'object' || parsed === null) return []

    const entries = Array.isArray(parsed)
      ? parsed.slice(0, 20).map((v, i) => [String(i), v] as [string, unknown])
      : (Object.entries(parsed).slice(0, 20) as [string, unknown][])

    return entries.map(([key, val]) => {
      if (val === null) return { key, type: 'null', preview: 'null' }
      if (Array.isArray(val)) return { key, type: 'array', preview: `Array(${val.length})` }
      if (typeof val === 'object') return { key, type: 'object', preview: 'Object' }
      if (typeof val === 'string') {
        const str = val.length > 24 ? val.slice(0, 24) + '…' : val
        return { key, type: 'string', preview: `"${str}"` }
      }
      return { key, type: typeof val, preview: String(val) }
    })
  } catch {
    return []
  }
}
