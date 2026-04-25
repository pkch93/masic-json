import { useState, useCallback, useRef } from 'react'
import type { ActionId, KeyCombo, KeyMappingConfig } from './keymap.model'
import { getDefaultKeymap, loadKeymapConfig, saveKeymapConfig } from './keymap.service'

export interface KeymapViewModel {
  config: KeyMappingConfig
  dirty: boolean
  updateBinding: (action: ActionId, combo: KeyCombo) => void
  save: () => void
  resetDefaults: () => void
}

export function useKeymapViewModel(): KeymapViewModel {
  const [config, setConfig] = useState<KeyMappingConfig>(() => loadKeymapConfig())
  const [dirty, setDirty] = useState(false)
  const configRef = useRef(config)
  configRef.current = config

  const updateBinding = useCallback((action: ActionId, combo: KeyCombo) => {
    setConfig((prev) => ({ ...prev, [action]: combo }))
    setDirty(true)
  }, [])

  const save = useCallback(() => {
    saveKeymapConfig(configRef.current)
    setDirty(false)
  }, [])

  const resetDefaults = useCallback(() => {
    const defaults = getDefaultKeymap()
    setConfig(defaults)
    saveKeymapConfig(defaults)
    setDirty(false)
  }, [])

  return { config, dirty, updateBinding, save, resetDefaults }
}
