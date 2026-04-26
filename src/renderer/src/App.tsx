import { useState, useEffect } from 'react'
import { NavBar } from './shared/design'
import { FormatterView } from './features/formatter/views'
import { useHistoryViewModel } from './features/history/viewmodels/useHistoryViewModel'

function App(): React.JSX.Element {
  const { entries, addEntry, deleteEntry, clearAll } = useHistoryViewModel()
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
      <main style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <FormatterView
          onSave={addEntry}
          historyEntries={entries}
          onDeleteHistory={deleteEntry}
          onClearHistory={clearAll}
        />
      </main>
    </div>
  )
}

export default App
