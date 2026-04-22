import { Button, Toggle, Stepper } from '../../../shared/design'
import { JsonEditor } from '../components/JsonEditor'
import { JsonTreeView } from '../components/JsonTreeView'
import { useFormatterViewModel } from '../viewmodels/useFormatterViewModel'
import type { IndentSize } from '../models/formatter.model'
import './FormatterView.css'

export function FormatterView(): React.JSX.Element {
  const {
    rawJson,
    indent,
    isValid,
    sortKeys,
    doubleQuotes,
    strictMode,
    allowComments,
    autoFix,
    preserveOrder,
    setRawJson,
    format,
    minify,
    clear,
    saveConfig,
    setIndent,
    setSortKeys,
    setDoubleQuotes,
    setStrictMode,
    setAllowComments,
    setAutoFix,
    setPreserveOrder
  } = useFormatterViewModel()

  const hasTrimmedValue = rawJson.trim().length > 0

  return (
    <div className="formatter-layout">
      <div className="formatter-main">
        {/* Editor panel */}
        <div className="formatter-editor-panel">
          <div className="formatter-file-tab">
            <div className="formatter-file-tab__info">
              <span className="formatter-file-tab__icon" />
              <span className="formatter-file-tab__name">payload.json</span>
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
            <JsonEditor value={rawJson} onChange={setRawJson} placeholder='{"key": "value"}' />
          </div>
        </div>

        {/* Settings sidebar */}
        <aside className="formatter-sidebar">
          <div className="formatter-sidebar__header">
            <span className="formatter-sidebar__label">Editor Settings</span>
          </div>

          <nav className="formatter-sidebar__nav">
            <button className="formatter-sidebar__nav-item formatter-sidebar__nav-item--active">
              Editor Config
            </button>
            <button className="formatter-sidebar__nav-item" disabled>Key Mapping</button>
            <button className="formatter-sidebar__nav-item" disabled>Themes</button>
            <button className="formatter-sidebar__nav-item" disabled>Plugins</button>
          </nav>

          <div className="formatter-sidebar__settings">
            <div className="formatter-setting-row">
              <span className="formatter-setting-label">Indent Size</span>
              <Stepper
                value={indent}
                min={2}
                max={4}
                step={2}
                onChange={(v) => setIndent(v as IndentSize)}
              />
            </div>
            <div className="formatter-setting-row">
              <span className="formatter-setting-label">Double Quotes</span>
              <Toggle checked={doubleQuotes} onChange={setDoubleQuotes} />
            </div>
            <div className="formatter-setting-row">
              <span className="formatter-setting-label">Sort Keys</span>
              <Toggle checked={sortKeys} onChange={setSortKeys} />
            </div>
          </div>

          <div className="formatter-sidebar__footer">
            <Button
              variant="primary"
              size="sm"
              onClick={saveConfig}
              className="formatter-sidebar__save-btn"
            >
              Save Config
            </Button>
          </div>
        </aside>
      </div>

      {/* Bottom panel */}
      <div className="formatter-bottom">
        <div className="formatter-bottom__section">
          <span className="formatter-section-label">Parsing Options</span>
          <div className="formatter-parsing-grid">
            <Toggle label="Strict Mode" checked={strictMode} onChange={setStrictMode} row />
            <Toggle label="Allow Comments" checked={allowComments} onChange={setAllowComments} row />
            <Toggle label="Auto-Fix Errors" checked={autoFix} onChange={setAutoFix} row />
            <Toggle label="Preserve Order" checked={preserveOrder} onChange={setPreserveOrder} row />
          </div>
        </div>
        <div className="formatter-bottom__section">
          <span className="formatter-section-label">JSON Tree View</span>
          <JsonTreeView value={rawJson} />
        </div>
      </div>
    </div>
  )
}
