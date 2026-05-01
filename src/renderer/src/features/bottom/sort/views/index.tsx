import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { Button } from '../../../../shared/design'
import { useSortViewModel } from '../viewmodels/useSortViewModel'
import './style.css'

interface SortViewProps {
  json: string
}

export interface SortViewHandle {
  focus: () => void
}

export const SortView = forwardRef<SortViewHandle, SortViewProps>(function SortView(
  { json },
  ref
): React.JSX.Element {
  const { options, result, addKey, removeKey, updateKey, setPath, setDirection, sort, reset } =
    useSortViewModel()
  const [showPath, setShowPath] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => firstInputRef.current?.focus()
  }))

  const hasJson = json.trim().length > 0
  const hasAnyKey = options.keys.some((k) => k.key.trim().length > 0)

  useEffect(() => {
    if (hasJson && hasAnyKey) sort(json)
  }, [json, options, hasJson, hasAnyKey, sort])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') sort(json)
  }

  const showResults = result !== null && !result.error && result.sorted !== null
  const metaLabel = options.keys
    .filter((k) => k.key.trim())
    .map((k) => `${k.key} ${k.direction === 'asc' ? '↑' : '↓'}`)
    .join(', ')

  return (
    <div className="sort-layout">
      {/* LEFT: output */}
      <div className="sort-output">
        {!hasJson && (
          <div className="sort-output__empty">JSON 에디터에 배열 데이터를 입력하면 정렬을 실행할 수 있습니다.</div>
        )}
        {hasJson && !hasAnyKey && !result && (
          <div className="sort-output__empty">오른쪽에 정렬 기준 키를 입력해주세요.</div>
        )}
        {result?.error && (
          <div className="sort-output__error">
            <span className="sort-output__error-icon">!</span>
            <span>{result.error}</span>
          </div>
        )}
        {showResults && (
          <>
            <div className="sort-output__meta">
              <span className="sort-output__count">{result.count}개 항목</span>
              <span className="sort-output__label">{metaLabel}</span>
            </div>
            <pre className="sort-output__json">{JSON.stringify(result.sorted, null, 2)}</pre>
          </>
        )}
      </div>

      {/* RIGHT: controls sidebar */}
      <div className="sort-sidebar">
        <div className="sort-sidebar__header">SORT</div>

        <div className="sort-sidebar__body">
          {options.keys.map((sortKey, index) => (
            <div key={index} className="sort-key-row">
              <span className="sort-key-priority">{index + 1}</span>
              <input
                ref={index === 0 ? firstInputRef : undefined}
                className="sort-key-input"
                value={sortKey.key}
                onChange={(e) => updateKey(index, { key: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder={index === 0 ? 'price, name …' : '두 번째 기준 …'}
                spellCheck={false}
              />
              <div className="sort-direction">
                <button
                  className={`sort-dir-btn ${sortKey.direction === 'asc' ? 'sort-dir-btn--active' : ''}`}
                  onClick={() => setDirection(index, 'asc')}
                >↑</button>
                <button
                  className={`sort-dir-btn ${sortKey.direction === 'desc' ? 'sort-dir-btn--active' : ''}`}
                  onClick={() => setDirection(index, 'desc')}
                >↓</button>
              </div>
              {options.keys.length > 1 && (
                <button className="sort-remove-btn" onClick={() => removeKey(index)}>×</button>
              )}
            </div>
          ))}

          <button className="sort-add-btn" onClick={addKey}>+ 기준 추가</button>

          <div className="sort-path-row">
            <button className="sort-path-toggle" onClick={() => setShowPath((v) => !v)}>
              {showPath ? '▾' : '▸'} Path
            </button>
            {showPath ? (
              <input
                className="sort-path-input"
                value={options.path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="$ (기본값: 루트)"
                spellCheck={false}
              />
            ) : (
              <span className="sort-path-hint">{options.path || '$'}</span>
            )}
          </div>
        </div>

        <div className="sort-sidebar__footer">
          {hasAnyKey && (
            <button className="sort-reset-link" onClick={reset}>초기화</button>
          )}
          <Button variant="primary" size="sm" onClick={() => sort(json)} disabled={!hasJson || !hasAnyKey}>
            Sort
          </Button>
        </div>
      </div>
    </div>
  )
})
