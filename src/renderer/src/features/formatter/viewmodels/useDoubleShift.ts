import { useEffect, useRef } from 'react'

const DOUBLE_PRESS_MS = 300

export function useDoubleShift(callback: () => void): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    let lastShift = 0

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Shift' && !e.repeat) {
        const now = Date.now()
        if (now - lastShift < DOUBLE_PRESS_MS) {
          callbackRef.current()
          lastShift = 0
        } else {
          lastShift = now
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
