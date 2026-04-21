import { useState } from 'react'
import { Text, Button, Card, Input } from './shared/design'

function App(): React.JSX.Element {
  const [jsonInput, setJsonInput] = useState('')

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '800px' }}>
      <header>
        <Text variant="display" color="primary">Magic JSON</Text>
        <br />
        <Text variant="headline" color="dim">The Synthetic Luminal Design System</Text>
      </header>

      <Card variant="base">
        <Text variant="title">Editor Layout Concept</Text>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="JSON Source" 
            placeholder='{"key": "value"}' 
            value={jsonInput} 
            onChange={(e) => setJsonInput(e.target.value)} 
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="primary">Format JSON</Button>
            <Button variant="secondary">Copy to Clipboard</Button>
            <Button variant="ghost">Reset</Button>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card variant="high">
          <Text variant="label" color="secondary">Layer: High</Text>
          <p style={{ marginTop: '8px' }}>
            <Text variant="body">This surface uses surface-container-high background.</Text>
          </p>
        </Card>
        <Card variant="glass">
          <Text variant="label" color="tertiary" style={{ color: 'var(--ds-color-tertiary)' }}>Layer: Glass</Text>
          <p style={{ marginTop: '8px' }}>
            <Text variant="body">This surface uses backdrop-blur and transparency.</Text>
          </p>
        </Card>
      </div>

      <footer>
        <Text variant="label" color="dim">© 2024 masic-json design system</Text>
      </footer>
    </div>
  )
}

export default App

