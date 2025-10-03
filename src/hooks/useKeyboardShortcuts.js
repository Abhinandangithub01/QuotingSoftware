import { useEffect } from 'react'

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      shortcuts.forEach(({ key, ctrl, alt, shift, meta, callback }) => {
        const ctrlMatch = ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey
        const altMatch = alt ? e.altKey : !e.altKey
        const shiftMatch = shift ? e.shiftKey : !e.shiftKey
        const metaMatch = meta ? e.metaKey : !e.metaKey

        if (e.key === key && ctrlMatch && altMatch && shiftMatch) {
          e.preventDefault()
          callback(e)
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
