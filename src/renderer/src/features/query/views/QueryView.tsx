import { useQueryViewModel } from '../viewmodels/useQueryViewModel'

interface QueryViewProps {
  json: string
}

export function QueryView({ json }: QueryViewProps): React.JSX.Element {
  const { query, result, setExpression, evaluate, reset } = useQueryViewModel()

  return (
    <div>
      <h2>JSONPath Query</h2>
      <input
        value={query.expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="$.store.book[*].title"
      />
      <button onClick={() => evaluate(json)}>실행</button>
      <button onClick={reset}>초기화</button>
      {result?.error && <p style={{ color: 'red' }}>{result.error}</p>}
      {result?.values && <pre>{JSON.stringify(result.values, null, 2)}</pre>}
    </div>
  )
}
