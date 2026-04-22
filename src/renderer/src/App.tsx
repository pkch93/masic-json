import { useState } from 'react'
import { NavBar, Text } from './shared/design'
import { FormatterView } from './features/formatter/views/FormatterView'

const NAV_TABS = [
  { id: 'editor', label: 'Editor' },
  { id: 'history', label: 'History' },
  { id: 'settings', label: 'Settings' }
] as const

type NavTabId = (typeof NAV_TABS)[number]['id']

function PlaceholderView({ title }: { title: string }): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        color: 'var(--ds-color-on-surface-variant)'
      }}
    >
      <Text variant="body" color="dim">
        {title} — coming soon
      </Text>
    </div>
  )
}

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<NavTabId>('editor')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar
        tabs={[...NAV_TABS]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as NavTabId)}
      />
      <main style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {activeTab === 'editor' && <FormatterView />}
        {activeTab === 'history' && <PlaceholderView title="History" />}
        {activeTab === 'settings' && <PlaceholderView title="Settings" />}
      </main>
    </div>
  )
}

export default App
