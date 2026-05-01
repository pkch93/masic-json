import { extractTopLevel } from '../services/json-tree-view.service'
import './style.css'

interface JsonTreeViewProps {
  value: string
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
