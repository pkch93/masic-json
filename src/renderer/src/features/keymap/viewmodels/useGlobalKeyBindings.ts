import { useEffect, useRef } from 'react'
import type { KeyMappingConfig } from '../models/keymap.model'
import { isDoubleCombo } from '../models/keymap.model'
import { matchesKeyCombo } from '../services/keymap.service'

export interface GlobalKeyActions {
  toggle: () => void
  format: () => void
  minify: () => void
  clear: () => void
  focusEditor: () => void
  focusTree: () => void
  focusQuery: () => void
  focusSort: () => void
}

export function useGlobalKeyBindings(config: KeyMappingConfig, actions: GlobalKeyActions): void {
  const configRef = useRef(config)
  const actionsRef = useRef(actions)
  configRef.current = config
  actionsRef.current = actions

  useEffect(() => {
    let lastPress: { key: string; time: number } | null = null

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.repeat) return

      const cfg = configRef.current
      const acts = actionsRef.current
      const toggleCombo = cfg.toggle

      if (isDoubleCombo(toggleCombo)) {
        if (e.key === toggleCombo.key) {
          const now = Date.now()
          if (lastPress?.key === toggleCombo.key && now - lastPress.time < toggleCombo.intervalMs) {
            acts.toggle()
            lastPress = null
          } else {
            lastPress = { key: toggleCombo.key, time: now }
          }
          return
        }
      } else if (matchesKeyCombo(e, toggleCombo)) {
        e.preventDefault()
        acts.toggle()
        return
      }

      if (lastPress && e.key !== lastPress.key) lastPress = null

      const target = e.target as HTMLElement
      const isInteractive =
        ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName) ||
        target.isContentEditable

      if (isInteractive) return

      if (matchesKeyCombo(e, cfg.format)) {
        e.preventDefault()
        acts.format()
        return
      }

      if (matchesKeyCombo(e, cfg.minify)) {
        e.preventDefault()
        acts.minify()
        return
      }

      if (matchesKeyCombo(e, cfg.clear)) {
        e.preventDefault()
        acts.clear()
        return
      }

      if (matchesKeyCombo(e, cfg.focusTree)) {
        e.preventDefault()
        acts.focusTree()
        return
      }

      if (matchesKeyCombo(e, cfg.focusQuery)) {
        e.preventDefault()
        acts.focusQuery()
        return
      }

      if (matchesKeyCombo(e, cfg.focusSort)) {
        e.preventDefault()
        acts.focusSort()
        return
      }

      if (matchesKeyCombo(e, cfg.focusEditor)) {
        e.preventDefault()
        acts.focusEditor()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
