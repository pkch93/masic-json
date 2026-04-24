import { Button } from '../../../shared/design'
import type { HistoryEntry } from '../models/history.model'
import { formatRelativeTime, formatByteSize } from '../services/history.service'
import './HistoryView.css'

interface HistoryViewProps {
  entries: HistoryEntry[]
  onLoad: (json: string) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function HistoryView({
  entries,
  onLoad,
  onDelete,
  onClearAll
}: HistoryViewProps): React.JSX.Element {
  return (
    <div className="history-layout">
      <div className="history-header">
        <span className="history-header__label">History</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          disabled={entries.length === 0}
        >
          Clear All
        </Button>
      </div>

      <div className="history-list">
        {entries.length === 0 ? (
          <div className="history-empty">
            No history yet — format or minify JSON to save an entry
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="history-entry"
              onClick={() => onLoad(entry.json)}
            >
              <div className="history-entry__top">
                <span className="history-entry__label">{entry.label}</span>
                <button
                  className="history-entry__delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(entry.id)
                  }}
                  title="Delete"
                >
                  ×
                </button>
              </div>
              <div className="history-entry__meta">
                <span className={`history-badge history-badge--${entry.operation}`}>
                  {entry.operation}
                </span>
                <span className="history-entry__time">
                  {formatRelativeTime(entry.savedAt)}
                </span>
                <span className="history-entry__size">
                  {formatByteSize(entry.byteSize)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
