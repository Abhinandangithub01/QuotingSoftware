import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Global Keyboard Shortcuts Hook
 * Prevents browser default actions and handles app-specific shortcuts
 */
export function useGlobalShortcuts(options = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { enabled = true, onShortcut } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e) => {
      // Get the shortcut combination
      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const alt = e.altKey

      // Don't intercept if user is typing in input/textarea
      const target = e.target
      const isInput = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.isContentEditable

      // Build shortcut string
      let shortcut = ''
      if (ctrl) shortcut += 'ctrl+'
      if (shift) shortcut += 'shift+'
      if (alt) shortcut += 'alt+'
      shortcut += key

      // Define all shortcuts with their handlers
      const shortcuts = {
        // Navigation - Using Alt instead of Ctrl to avoid browser conflicts
        'alt+1': () => {
          e.preventDefault()
          navigate('/quotes')
        },
        'alt+2': () => {
          e.preventDefault()
          navigate('/quotes/new')
        },
        'alt+3': () => {
          e.preventDefault()
          navigate('/dispatch')
        },
        'alt+4': () => {
          e.preventDefault()
          navigate('/settings')
        },

        // Quick Actions - Using Alt+Shift to avoid conflicts
        'alt+shift+n': () => {
          e.preventDefault()
          navigate('/quotes/new')
          if (onShortcut) onShortcut('new_quote')
        },
        'alt+shift+s': () => {
          if (!isInput) {
            e.preventDefault()
            // Trigger save event
            const saveEvent = new CustomEvent('app:save')
            window.dispatchEvent(saveEvent)
            if (onShortcut) onShortcut('save')
          }
        },
        'alt+shift+i': () => {
          e.preventDefault()
          // Trigger convert to invoice
          const convertEvent = new CustomEvent('app:convert_invoice')
          window.dispatchEvent(convertEvent)
          if (onShortcut) onShortcut('convert_invoice')
        },
        'alt+shift+p': () => {
          e.preventDefault()
          // Trigger mark paid
          const paidEvent = new CustomEvent('app:mark_paid')
          window.dispatchEvent(paidEvent)
          if (onShortcut) onShortcut('mark_paid')
        },

        // Search & Find - Using Alt+Shift
        'alt+shift+f': () => {
          e.preventDefault()
          // Open global search
          const searchEvent = new CustomEvent('app:global_search')
          window.dispatchEvent(searchEvent)
          if (onShortcut) onShortcut('global_search')
        },
        'alt+shift+k': () => {
          e.preventDefault()
          // Open command palette
          const paletteEvent = new CustomEvent('app:command_palette')
          window.dispatchEvent(paletteEvent)
          if (onShortcut) onShortcut('command_palette')
        },
        'alt+shift+c': () => {
          e.preventDefault()
          // Open customer search
          const customerEvent = new CustomEvent('app:customer_search')
          window.dispatchEvent(customerEvent)
          if (onShortcut) onShortcut('customer_search')
        },

        // View Controls
        'alt+shift+b': () => {
          e.preventDefault()
          // Toggle sidebar
          const sidebarEvent = new CustomEvent('app:toggle_sidebar')
          window.dispatchEvent(sidebarEvent)
          if (onShortcut) onShortcut('toggle_sidebar')
        },
        'alt+shift+d': () => {
          e.preventDefault()
          // Toggle dark mode
          const themeEvent = new CustomEvent('app:toggle_theme')
          window.dispatchEvent(themeEvent)
          if (onShortcut) onShortcut('toggle_theme')
        },

        // Help
        '?': () => {
          if (!isInput) {
            e.preventDefault()
            const helpEvent = new CustomEvent('app:show_help')
            window.dispatchEvent(helpEvent)
            if (onShortcut) onShortcut('show_help')
          }
        },
        'f1': () => {
          e.preventDefault()
          const helpEvent = new CustomEvent('app:show_help')
          window.dispatchEvent(helpEvent)
          if (onShortcut) onShortcut('show_help')
        },

        // Close/Cancel
        'escape': () => {
          // Don't prevent default for escape - let it bubble
          const closeEvent = new CustomEvent('app:close')
          window.dispatchEvent(closeEvent)
          if (onShortcut) onShortcut('close')
        },
      }

      // Execute shortcut if it exists
      if (shortcuts[shortcut]) {
        shortcuts[shortcut]()
      }
    }

    // Prevent specific browser shortcuts
    const preventBrowserShortcuts = (e) => {
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const key = e.key.toLowerCase()

      // Prevent Ctrl+N (new window)
      if (ctrl && !shift && key === 'n') {
        e.preventDefault()
      }
      // Prevent Ctrl+T (new tab)
      if (ctrl && !shift && key === 't') {
        e.preventDefault()
      }
      // Prevent Ctrl+W (close tab) - be careful with this
      // if (ctrl && !shift && key === 'w') {
      //   e.preventDefault()
      // }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keydown', preventBrowserShortcuts, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keydown', preventBrowserShortcuts, true)
    }
  }, [enabled, navigate, location, onShortcut])
}

/**
 * Hook for page-specific shortcuts
 */
export function usePageShortcuts(shortcuts, deps = []) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const alt = e.altKey

      // Don't intercept if user is typing
      const target = e.target
      const isInput = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.isContentEditable

      // Build shortcut string
      let shortcut = ''
      if (ctrl) shortcut += 'ctrl+'
      if (shift) shortcut += 'shift+'
      if (alt) shortcut += 'alt+'
      shortcut += key

      // Execute if shortcut exists
      if (shortcuts[shortcut]) {
        const shouldPrevent = shortcuts[shortcut](e, isInput)
        if (shouldPrevent !== false) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, deps)
}

/**
 * Hook for table/form navigation shortcuts
 */
export function useTableShortcuts(options = {}) {
  const {
    onEnter,
    onShiftEnter,
    onTab,
    onShiftTab,
    onArrowUp,
    onArrowDown,
    onDuplicate,
    onDelete,
    enabled = true,
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const alt = e.altKey

      // Table-specific shortcuts
      if (key === 'enter' && !ctrl && !alt) {
        if (shift && onShiftEnter) {
          e.preventDefault()
          onShiftEnter(e)
        } else if (onEnter) {
          e.preventDefault()
          onEnter(e)
        }
      }

      if (key === 'tab') {
        if (shift && onShiftTab) {
          e.preventDefault()
          onShiftTab(e)
        } else if (onTab) {
          e.preventDefault()
          onTab(e)
        }
      }

      if (key === 'arrowup' && alt && onArrowUp) {
        e.preventDefault()
        onArrowUp(e)
      }

      if (key === 'arrowdown' && alt && onArrowDown) {
        e.preventDefault()
        onArrowDown(e)
      }

      if (key === 'd' && ctrl && !shift && onDuplicate) {
        e.preventDefault()
        onDuplicate(e)
      }

      if (key === 'backspace' && !ctrl && !shift && onDelete) {
        const target = e.target
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
        const isEmpty = isInput && target.value === ''
        
        if (isEmpty || !isInput) {
          e.preventDefault()
          onDelete(e)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onEnter, onShiftEnter, onTab, onShiftTab, onArrowUp, onArrowDown, onDuplicate, onDelete])
}
