import { useFormatterViewModel } from '../viewmodels/useFormatterViewModel'

interface FormatterViewProps {
  onFormatted?: (json: string) => void
}

export function FormatterView({ onFormatted }: FormatterViewProps): React.JSX.Element {
  const { document, indent, setRaw, format, minify, setIndent, reset } = useFormatterViewModel()

  return (
    <div>
      <h2>JSON Formatter</h2>
      <textarea onChange={(e) => setRaw(e.target.value)} placeholder="JSON을 붙여넣으세요" />
      <div>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value) as Parameters<typeof setIndent>[0])}
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
        <button onClick={() => { format(); if (document?.formatted) onFormatted?.(document.formatted) }}>Format</button>
        <button onClick={minify}>Minify</button>
        <button onClick={reset}>Reset</button>
      </div>
      {document?.error && <p style={{ color: 'red' }}>{document.error.message}</p>}
      {document?.formatted && <pre>{document.formatted}</pre>}
    </div>
  )
}
