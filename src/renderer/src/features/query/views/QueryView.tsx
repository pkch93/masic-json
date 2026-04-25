import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { Button } from '../../../shared/design'
import { useQueryViewModel } from '../viewmodels/useQueryViewModel'
import './QueryView.css'

interface QueryViewProps {
  json: string
}

export interface QueryViewHandle {
  focus: () => void
}

export const QueryView = forwardRef<QueryViewHandle, QueryViewProps>(function QueryView(
  { json },
  ref
): React.JSX.Element {
  const { query, result, setExpression, evaluate, reset } = useQueryViewModel()
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }))

  const hasJson = json.trim().length > 0
  const hasExpression = query.expression.trim().length > 0

  useEffect(() => {
    if (hasExpression && hasJson) evaluate(json)
  }, [json, query.expression, hasExpression, hasJson, evaluate])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') evaluate(json)
    if (e.key === 'Escape') reset()
  }

  const resultCount = result?.values.length ?? 0
  const showResults = result !== null && !result.error

  return (
    <div className="query-layout">
      {/* LEFT: output */}
      <div className="query-output">
        {!hasJson && (
          <div className="query-output__empty">JSON 에디터에 데이터를 입력하면 쿼리를 실행할 수 있습니다.</div>
        )}
        {hasJson && !hasExpression && !result && (
          <div className="query-output__empty">오른쪽에 JSONPath 표현식을 입력해주세요.</div>
        )}
        {result?.error && (
          <div className="query-output__error">
            <span className="query-output__error-icon">!</span>
            <span>{result.error}</span>
          </div>
        )}
        {showResults && (
          <>
            <div className="query-output__meta">
              <span className="query-output__count">
                {resultCount === 0 ? '결과 없음' : `${resultCount}개 결과`}
              </span>
              {resultCount > 0 && (
                <span className="query-output__paths">
                  {result.paths.slice(0, 3).join(' · ')}
                  {result.paths.length > 3 && ` +${result.paths.length - 3}`}
                </span>
              )}
            </div>
            {resultCount > 0 && (
              <pre className="query-output__json">
                {JSON.stringify(resultCount === 1 ? result.values[0] : result.values, null, 2)}
              </pre>
            )}
          </>
        )}
      </div>

      {/* RIGHT: controls sidebar */}
      <div className="query-sidebar">
        <div className="query-sidebar__header">JSON PATH</div>

        <div className="query-sidebar__body">
          <div className="query-input-wrapper">
            <span className="query-input-prefix">$</span>
            <input
              ref={inputRef}
              className="query-input"
              value={query.expression.startsWith('$') ? query.expression.slice(1) : query.expression}
              onChange={(e) => setExpression('$' + e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=".store.book[*].title"
              spellCheck={false}
            />
            {hasExpression && (
              <button className="query-clear-btn" onClick={reset} title="Clear">×</button>
            )}
          </div>

          {!hasExpression && (
            <div className="query-examples">
              <span className="query-examples-label">예시</span>
              {[
                { expr: '$.*', label: '루트 값 전체' },
                { expr: '$..name', label: '모든 name' },
                { expr: '$[0]', label: '첫 번째 요소' },
                { expr: '$[?(@.price<10)]', label: '조건 필터' },
              ].map(({ expr, label }) => (
                <button key={expr} className="query-example-chip" onClick={() => setExpression(expr)}>
                  <code>{expr}</code>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="query-sidebar__footer">
          <Button
            variant="primary"
            size="sm"
            onClick={() => evaluate(json)}
            disabled={!hasJson || !hasExpression}
          >
            Run
          </Button>
        </div>
      </div>
    </div>
  )
})
