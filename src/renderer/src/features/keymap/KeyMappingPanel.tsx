import { useState, useEffect, useCallback } from 'react'
import type { ActionId, KeyCombo, KeyMappingConfig } from './keymap.model'
import { ACTION_LABELS, ACTION_ORDER } from './keymap.model'
import { formatKeyCombo } from './keymap.service'
import './KeyMappingPanel.css'

interface KeyMappingPanelProps {
  config: KeyMappingConfig
  dirty: boolean
  onUpdate: (action: ActionId, combo: KeyCombo) => void
  onSave: () => void
  onReset: () => void
}

export function KeyMappingPanel({
  config,
  dirty,
  onUpdate,
  onSave,
  onReset
}: KeyMappingPanelProps): React.JSX.Element {
  const [capturing, setCapturing] = useState<ActionId | null>(null)

  const startCapture = useCallback((action: ActionId) => setCapturing(action), [])
  const cancelCapture = useCallback(() => setCapturing(null), [])

  useEffect(() => {
    if (!capturing) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      e.preventDefault()
      e.stopPropagation()

      if (e.key === 'Escape') {
        setCapturing(null)
        return
      }

      if (['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) return

      const combo: KeyCombo = {
        key: e.key,
        meta: e.metaKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey
      }

      onUpdate(capturing, combo)
      setCapturing(null)
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [capturing, onUpdate])

  return (
    <div className="keymap-panel">
      <div className="keymap-list">
        {ACTION_ORDER.map((actionId) => {
          const combo = config[actionId]
          const isCapturing = capturing === actionId

          return (
            <div key={actionId} className="keymap-row">
              <span className="keymap-row__label">{ACTION_LABELS[actionId]}</span>
              <button
                className={`keymap-row__key ${isCapturing ? 'keymap-row__key--capturing' : ''}`}
                onClick={() => (isCapturing ? cancelCapture() : startCapture(actionId))}
                title={isCapturing ? 'Press a key — Esc to cancel' : 'Click to rebind'}
              >
                {isCapturing ? (
                  <span className="keymap-capture-label">Press a key</span>
                ) : (
                  <kbd className="keymap-kbd">{formatKeyCombo(combo)}</kbd>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {capturing && (
        <p className="keymap-esc-hint">Esc to cancel</p>
      )}

      <div className="keymap-footer">
        <button className="keymap-btn keymap-btn--ghost" onClick={onReset}>
          Reset
        </button>
        <button className="keymap-btn keymap-btn--primary" onClick={onSave} disabled={!dirty}>
          Save
        </button>
      </div>
    </div>
  )
}
