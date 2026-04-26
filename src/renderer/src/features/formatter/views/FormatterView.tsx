import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Toggle, Stepper } from '../../../shared/design'
import { JsonEditor } from '../components/JsonEditor'
import type { JsonEditorHandle } from '../components/JsonEditor'
import { JsonTreeView } from '../components/JsonTreeView'
import { CommandPalette } from '../components/CommandPalette'
import type { PaletteAction } from '../components/CommandPalette'
import { QueryView } from '../../query/views/QueryView'
import type { QueryViewHandle } from '../../query/views/QueryView'
import { SortView } from '../../sort/views/SortView'
import type { SortViewHandle } from '../../sort/views/SortView'
import { useFormatterViewModel } from '../viewmodels/useFormatterViewModel'
import { useGlobalKeyBindings } from '../viewmodels/useGlobalKeyBindings'
import { useKeymapViewModel } from '../keymap/useKeymapViewModel'
import { KeyMappingPanel } from '../keymap/KeyMappingPanel'
import type { IndentSize } from '../models/formatter.model'
import type { HistoryEntry, HistoryOperation } from '../../history/models/history.model'
import { formatRelativeTime, formatByteSize } from '../../history/services/history.service'
import './FormatterView.css'

type BottomTab = 'tree' | 'query' | 'sort'
type SidebarTab = 'config' | 'history'
type ConfigNav = 'editor' | 'keymap'

interface FormatterViewProps {
  onSave?: (json: string, operation: HistoryOperation) => void
  pendingLoad?: string | null
  onLoadConsumed?: () => void
  historyEntries?: HistoryEntry[]
  onDeleteHistory?: (id: string) => void
  onClearHistory?: () => void
}

const MIN_BOTTOM_HEIGHT = 160
const MAX_BOTTOM_HEIGHT = 640
const DEFAULT_BOTTOM_HEIGHT = 300

export function FormatterView({
  onSave,
  pendingLoad,
  onLoadConsumed,
  historyEntries = [],
  onDeleteHistory,
  onClearHistory
}: FormatterViewProps): React.JSX.Element {
  const {
    rawJson,
    indent,
    isValid,
    doubleQuotes,
    setRawJson,
    format,
    minify,
    clear,
    saveConfig,
    setIndent,
    setDoubleQuotes
  } = useFormatterViewModel(onSave)

  const keymapVM = useKeymapViewModel()

  const [bottomTab, setBottomTab] = useState<BottomTab>('tree')
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('config')
  const [configNav, setConfigNav] = useState<ConfigNav>('editor')
  const [bottomCollapsed, setBottomCollapsed] = useState(false)
  const [bottomHeight, setBottomHeight] = useState(DEFAULT_BOTTOM_HEIGHT)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const editorRef = useRef<JsonEditorHandle>(null)
  const queryRef = useRef<QueryViewHandle>(null)
  const sortRef = useRef<SortViewHandle>(null)

  const focusBottomTab = useCallback((tab: BottomTab) => {
    setBottomCollapsed(false)
    setBottomTab(tab)
    if (tab === 'query') {
      setTimeout(() => queryRef.current?.focus(), 50)
    } else if (tab === 'sort') {
      setTimeout(() => sortRef.current?.focus(), 50)
    }
  }, [])

  useGlobalKeyBindings(keymapVM.config, {
    toggle: () => setPaletteOpen((prev) => !prev),
    format,
    minify,
    clear,
    focusEditor: () => editorRef.current?.focus(),
    focusTree: () => focusBottomTab('tree'),
    focusQuery: () => focusBottomTab('query'),
    focusSort: () => focusBottomTab('sort')
  })

  const paletteActions: PaletteAction[] = [
    { id: 'format', label: 'Format JSON', icon: 'format_align_left', onExecute: format },
    { id: 'minify', label: 'Minify JSON', icon: 'compress', onExecute: minify },
    {
      id: 'copy',
      label: 'Copy Content',
      icon: 'content_copy',
      onExecute: () => navigator.clipboard.writeText(rawJson)
    },
    { id: 'clear', label: 'Clear All', icon: 'delete_sweep', onExecute: clear }
  ]

  useEffect(() => {
    if (pendingLoad != null) {
      setRawJson(pendingLoad)
      onLoadConsumed?.()
    }
  }, [pendingLoad])

  const hasTrimmedValue = rawJson.trim().length > 0

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = bottomHeight

    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'

    const onMove = (ev: MouseEvent) => {
      const delta = startY - ev.clientY
      setBottomHeight(Math.max(MIN_BOTTOM_HEIGHT, Math.min(MAX_BOTTOM_HEIGHT, startHeight + delta)))
    }

    const onUp = () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div className="formatter-layout">
      <div className="formatter-main">
        {/* Editor panel */}
        <div className="formatter-editor-panel">
          <div className="formatter-file-tab">
            <div className="formatter-file-tab__info">
              <span className="formatter-file-tab__icon" />
              <span className="formatter-file-tab__name">json</span>
            </div>
            <div className="formatter-file-tab__actions">
              {hasTrimmedValue && (
                <span className={`formatter-badge formatter-badge--${isValid ? 'valid' : 'error'}`}>
                  ● {isValid ? 'Valid' : 'Invalid'} JSON
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={format}>Format</Button>
              <Button variant="ghost" size="sm" onClick={minify}>Minify</Button>
              <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
            </div>
          </div>
          <div className="formatter-editor-area">
            <JsonEditor ref={editorRef} value={rawJson} onChange={setRawJson} placeholder='{"key": "value"}' />
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="formatter-sidebar">
          <div className="formatter-sidebar__toggle">
            <button
              className={`formatter-sidebar__toggle-btn ${sidebarTab === 'config' ? 'formatter-sidebar__toggle-btn--active' : ''}`}
              onClick={() => setSidebarTab('config')}
            >
              Config
            </button>
            <button
              className={`formatter-sidebar__toggle-btn ${sidebarTab === 'history' ? 'formatter-sidebar__toggle-btn--active' : ''}`}
              onClick={() => setSidebarTab('history')}
            >
              History
              {historyEntries.length > 0 && (
                <span className="formatter-sidebar__badge">{historyEntries.length}</span>
              )}
            </button>
          </div>

          {sidebarTab === 'config' && (
            <>
              <nav className="formatter-sidebar__nav">
                <button
                  className={`formatter-sidebar__nav-item ${configNav === 'editor' ? 'formatter-sidebar__nav-item--active' : ''}`}
                  onClick={() => setConfigNav('editor')}
                >
                  Editor Config
                </button>
                <button
                  className={`formatter-sidebar__nav-item ${configNav === 'keymap' ? 'formatter-sidebar__nav-item--active' : ''}`}
                  onClick={() => setConfigNav('keymap')}
                >
                  Key Mapping
                </button>
              </nav>

              {configNav === 'editor' && (
                <>
                  <div className="formatter-sidebar__settings">
                    <div className="formatter-setting-row">
                      <span className="formatter-setting-label">Indent Size</span>
                      <Stepper value={indent} min={2} max={4} step={2} onChange={(v) => setIndent(v as IndentSize)} />
                    </div>
                    <div className="formatter-setting-row">
                      <span className="formatter-setting-label">Double Quotes</span>
                      <Toggle checked={doubleQuotes} onChange={setDoubleQuotes} />
                    </div>
                  </div>
                  <div className="formatter-sidebar__footer">
                    <Button variant="primary" size="sm" onClick={saveConfig} className="formatter-sidebar__save-btn">
                      Save Config
                    </Button>
                  </div>
                </>
              )}

              {configNav === 'keymap' && (
                <KeyMappingPanel
                  config={keymapVM.config}
                  dirty={keymapVM.dirty}
                  onUpdate={keymapVM.updateBinding}
                  onSave={keymapVM.save}
                  onReset={keymapVM.resetDefaults}
                />
              )}
            </>
          )}

          {sidebarTab === 'history' && (
            <div className="formatter-sidebar__history">
              <div className="formatter-history-header">
                <span className="formatter-history-count">
                  {historyEntries.length === 0 ? 'No entries' : `${historyEntries.length} entries`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearHistory}
                  disabled={historyEntries.length === 0}
                >
                  Clear
                </Button>
              </div>
              {historyEntries.length === 0 ? (
                <div className="formatter-history-empty">
                  Format or minify JSON to save an entry
                </div>
              ) : (
                <div className="formatter-history-list">
                  {historyEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="formatter-history-entry"
                      onClick={() => setRawJson(entry.json)}
                      title="Click to load"
                    >
                      <div className="formatter-history-entry__top">
                        <span className="formatter-history-entry__label">{entry.label}</span>
                        <button
                          className="formatter-history-entry__delete"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteHistory?.(entry.id)
                          }}
                          title="Delete"
                        >
                          ×
                        </button>
                      </div>
                      <div className="formatter-history-entry__meta">
                        <span className={`formatter-history-badge formatter-history-badge--${entry.operation}`}>
                          {entry.operation}
                        </span>
                        <span className="formatter-history-entry__time">
                          {formatRelativeTime(entry.savedAt)}
                        </span>
                        <span className="formatter-history-entry__size">
                          {formatByteSize(entry.byteSize)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Bottom panel */}
      <div
        className={`formatter-bottom ${bottomCollapsed ? 'formatter-bottom--collapsed' : ''}`}
        style={!bottomCollapsed ? { height: bottomHeight } : undefined}
      >
        {!bottomCollapsed && (
          <div className="formatter-resize-handle" onMouseDown={handleResizeStart} />
        )}

        <div className="formatter-bottom-tabs">
          {!bottomCollapsed && (['tree', 'query', 'sort'] as BottomTab[]).map((tab) => (
            <button
              key={tab}
              className={`formatter-bottom-tab ${bottomTab === tab ? 'formatter-bottom-tab--active' : ''}`}
              onClick={() => setBottomTab(tab)}
            >
              {tab === 'tree' ? 'Tree View' : tab === 'query' ? 'JSON Path' : 'Sort'}
            </button>
          ))}
          <button
            className="formatter-bottom-collapse-btn"
            onClick={() => setBottomCollapsed(!bottomCollapsed)}
            title={bottomCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {bottomCollapsed ? '▲' : '▼'}
          </button>
        </div>

        {!bottomCollapsed && (
          <div className="formatter-bottom-content">
            {bottomTab === 'tree' && (
              <div className="formatter-tree-wrapper">
                <JsonTreeView value={rawJson} />
              </div>
            )}
            {bottomTab === 'query' && <QueryView ref={queryRef} json={rawJson} />}
            {bottomTab === 'sort' && <SortView ref={sortRef} json={rawJson} />}
          </div>
        )}
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        actions={paletteActions}
      />
    </div>
  )
}
