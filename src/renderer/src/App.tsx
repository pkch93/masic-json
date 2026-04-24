import { NavBar } from './shared/design'
import { FormatterView } from './features/formatter/views/FormatterView'
import { useHistoryViewModel } from './features/history/viewmodels/useHistoryViewModel'

function App(): React.JSX.Element {
  const { entries, addEntry, deleteEntry, clearAll } = useHistoryViewModel()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar />
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
