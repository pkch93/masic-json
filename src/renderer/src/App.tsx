import { useState, useEffect, useRef, useMemo } from 'react'
import { NavBar } from './shared/design'
import { FormatterView } from './features/formatter/views'
import type { FormatterViewHandle } from './features/formatter/views'
import { useHistoryViewModel } from './features/settings/history/viewmodels/useHistoryViewModel'
import { useKeymapViewModel } from './features/settings/keymap/viewmodels/useKeymapViewModel'
import { useGlobalKeyBindings } from './features/settings/keymap/viewmodels/useGlobalKeyBindings'
import { CommandPalette } from './features/command-palette/views'
import type { PaletteAction } from './features/command-palette/models/command-palette.model'

function App(): React.JSX.Element {
  const { entries, addEntry, deleteEntry, clearAll } = useHistoryViewModel()
  const keymapVM = useKeymapViewModel()
  const formatterRef = useRef<FormatterViewHandle>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const paletteActions = useMemo<PaletteAction[]>(() => [
    { id: 'format', label: 'Format JSON', icon: 'format_align_left', onExecute: () => formatterRef.current?.format() },
    { id: 'minify', label: 'Minify JSON', icon: 'compress', onExecute: () => formatterRef.current?.minify() },
    {
      id: 'copy',
      label: 'Copy Content',
      icon: 'content_copy',
      onExecute: () => {
        const json = formatterRef.current?.getRawJson()
        if (json) navigator.clipboard.writeText(json)
      }
    },
    { id: 'clear', label: 'Clear All', icon: 'delete_sweep', onExecute: () => formatterRef.current?.clear() }
  ], [])

  useGlobalKeyBindings(keymapVM.config, {
    toggle: () => setPaletteOpen((prev) => !prev),
    format: () => formatterRef.current?.format(),
    minify: () => formatterRef.current?.minify(),
    clear: () => formatterRef.current?.clear(),
    focusEditor: () => formatterRef.current?.focusEditor(),
    focusTree: () => formatterRef.current?.focusTree(),
    focusQuery: () => formatterRef.current?.focusQuery(),
    focusSort: () => formatterRef.current?.focusSort()
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onClose={() => window.electron.ipcRenderer.send('window-close')}
        onMinimize={() => window.electron.ipcRenderer.send('window-minimize')}
      />
      <main style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <FormatterView
          ref={formatterRef}
          keymapVM={keymapVM}
          onSave={addEntry}
          historyEntries={entries}
          onDeleteHistory={deleteEntry}
          onClearHistory={clearAll}
        />
      </main>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        actions={paletteActions}
      />
    </div>
  )
}

export default App
