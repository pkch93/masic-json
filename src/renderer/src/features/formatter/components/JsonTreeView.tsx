import './JsonTreeView.css'

interface JsonTreeViewProps {
  value: string
}

interface TreeNode {
  key: string
  type: string
  preview: string
}

function extractTopLevel(value: string): TreeNode[] {
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

export function JsonTreeView({ value }: JsonTreeViewProps): React.JSX.Element {
  if (!value.trim()) {
    return <div className="json-tree-empty">—</div>
  }

  const nodes = extractTopLevel(value)

  if (nodes.length === 0) {
    return <div className="json-tree-empty">—</div>
  }

  return (
    <div className="json-tree">
      {nodes.map(({ key, type, preview }) => (
        <div key={key} className="json-tree__row">
          <span className="json-tree__key">{key}</span>
          <span className="json-tree__colon">:</span>
          <span className={`json-tree__value json-tree__value--${type}`}>{preview}</span>
        </div>
      ))}
    </div>
  )
}
