import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { json } from '@codemirror/lang-json'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { basicSetup } from 'codemirror'
import { jsonLinter } from '../services/jsonLinter.service'
import './JsonEditor.css'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const highlightStyle = HighlightStyle.define([
  { tag: t.string, color: 'var(--ds-color-secondary)' },
  { tag: t.number, color: 'var(--ds-color-tertiary)' },
  { tag: [t.bool, t.null], color: 'var(--ds-color-primary)' },
  { tag: t.propertyName, color: 'var(--ds-color-primary)', fontWeight: '500' },
  { tag: t.punctuation, color: 'var(--ds-color-on-surface-variant)' },
  { tag: t.brace, color: 'var(--ds-color-on-surface)' },
  { tag: t.bracket, color: 'var(--ds-color-on-surface)' }
])

const editorTheme = EditorView.theme(
  {
    '&': {
      height: '100%',
      color: 'var(--ds-color-on-surface)',
      backgroundColor: 'var(--ds-color-surface-container)'
    },
    '.cm-content': {
      caretColor: 'var(--ds-color-primary)',
      fontFamily: 'var(--ds-font-code)'
    },
    '.cm-scroller': { fontFamily: 'var(--ds-font-code)' },
    '.cm-gutters': {
      backgroundColor: 'var(--ds-color-surface-container-low)',
      color: 'var(--ds-color-on-surface-variant)',
      border: 'none',
      borderRight: '1px solid var(--ds-color-outline-variant)'
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--ds-color-surface-container-high)',
      color: 'var(--ds-color-on-surface)'
    },
    '.cm-activeLine': { backgroundColor: 'rgba(184, 159, 255, 0.06)' },
    '.cm-tooltip': {
      backgroundColor: 'var(--ds-color-surface-container-highest)',
      color: 'var(--ds-color-on-surface)',
      border: '1px solid var(--ds-color-outline-variant)',
      borderRadius: 'var(--ds-radius-md)',
      fontFamily: 'var(--ds-font-body)',
      fontSize: 'var(--ds-font-size-body-md)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      maxWidth: '420px',
      overflow: 'hidden'
    },
    '.cm-tooltip.cm-tooltip-hover': {
      pointerEvents: 'auto'
    },
    '.cm-diagnostic': {
      borderLeft: '3px solid var(--ds-color-error)',
      padding: 'var(--ds-spacing-2) var(--ds-spacing-3)',
      color: 'var(--ds-color-on-surface)'
    },
    '.cm-diagnostic-error': { borderLeftColor: 'var(--ds-color-error)' },
    '.cm-lintRange-error': {
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'><path d='M0 3 L3 0 L6 3' fill='none' stroke='%23ff6e84' stroke-width='1'/></svg>\")",
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'bottom left',
      paddingBottom: '2px'
    }
  },
  { dark: true }
)

export function JsonEditor({ value, onChange, placeholder }: JsonEditorProps): React.JSX.Element {
  const hostRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!hostRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString())
      }
    })

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        json(),
        jsonLinter,
        syntaxHighlighting(highlightStyle),
        editorTheme,
        EditorView.lineWrapping,
        updateListener,
        EditorView.contentAttributes.of({
          'data-placeholder': placeholder ?? ''
        })
      ]
    })

    const view = new EditorView({ state, parent: hostRef.current })
    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value }
      })
    }
  }, [value])

  return <div ref={hostRef} className="ds-json-editor" />
}
