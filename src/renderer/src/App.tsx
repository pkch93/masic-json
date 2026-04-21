import { FormatterView } from './features/formatter/views/FormatterView'
import { QueryView } from './features/query/views/QueryView'
import { useState } from 'react'

function App(): React.JSX.Element {
  const [formattedJson, setFormattedJson] = useState('')

  return (
    <div>
      <h1>Magic JSON</h1>
      <FormatterView onFormatted={setFormattedJson} />
      <QueryView json={formattedJson} />
    </div>
  )
}

export default App
