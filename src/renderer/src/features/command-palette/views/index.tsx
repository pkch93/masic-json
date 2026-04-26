import { useRef, useEffect } from 'react'
import { useCommandPaletteViewModel } from '../viewmodels/useCommandPaletteViewModel'
import type { PaletteAction } from '../models/command-palette.model'
import './style.css'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  actions: PaletteAction[]
}

export function CommandPalette({ open, onClose, actions }: CommandPaletteProps): React.JSX.Element | null {
  const inputRef = useRef<HTMLInputElement>(null)
  const { query, setQuery, activeIndex, setActiveIndex, filtered, handleKeyDown } =
    useCommandPaletteViewModel(actions, open, onClose)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  if (!open) return null

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div
        className="cmd-panel"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="cmd-search">
          <span className="material-symbols-outlined cmd-search__icon">search</span>
          <input
            ref={inputRef}
            className="cmd-search__input"
            placeholder="Search actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="cmd-search__hints">
            <kbd className="cmd-kbd">shift</kbd>
            <kbd className="cmd-kbd">shift</kbd>
          </div>
        </div>

        <div className="cmd-list">
          {filtered.map((action, i) => (
            <div
              key={action.id}
              className={`cmd-item ${i === activeIndex ? 'cmd-item--active' : ''}`}
              onClick={() => {
                action.onExecute()
                onClose()
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="material-symbols-outlined cmd-item__icon">{action.icon}</span>
              <span className="cmd-item__label">{action.label}</span>
              {i === activeIndex && (
                <span
                  className="material-symbols-outlined cmd-item__check"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="cmd-empty">No results found</div>
          )}
        </div>

        <div className="cmd-footer">
          <span className="cmd-footer__count">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="cmd-footer__hints">
            <span>↵ Select</span>
            <span>↑↓ Navigate</span>
            <span>Esc Close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
