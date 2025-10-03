// Keyboard Shortcuts Configuration and Management

export const SHORTCUT_CATEGORIES = {
  NAVIGATION: 'Navigation',
  ACTIONS: 'Quick Actions',
  QUOTE_EDIT: 'Quote Editing',
  TABLE: 'Items Table',
  SEARCH: 'Search & Find',
  VIEW: 'View Controls',
  SYSTEM: 'System',
}

export const DEFAULT_SHORTCUTS = {
  // Navigation - Using Alt+Number to avoid browser conflicts
  'nav_quotes': {
    id: 'nav_quotes',
    name: 'Go to Quotes',
    category: SHORTCUT_CATEGORIES.NAVIGATION,
    defaultKey: 'alt+1',
    currentKey: 'alt+1',
    description: 'Navigate to quotes list',
    action: 'navigate',
    target: '/quotes',
  },
  'nav_new_quote': {
    id: 'nav_new_quote',
    name: 'New Quote',
    category: SHORTCUT_CATEGORIES.NAVIGATION,
    defaultKey: 'alt+2',
    currentKey: 'alt+2',
    description: 'Navigate to new quote page',
    action: 'navigate',
    target: '/quotes/new',
  },
  'nav_dispatch': {
    id: 'nav_dispatch',
    name: 'Go to Dispatch',
    category: SHORTCUT_CATEGORIES.NAVIGATION,
    defaultKey: 'alt+3',
    currentKey: 'alt+3',
    description: 'Navigate to dispatch queue',
    action: 'navigate',
    target: '/dispatch',
  },
  'nav_settings': {
    id: 'nav_settings',
    name: 'Go to Settings',
    category: SHORTCUT_CATEGORIES.NAVIGATION,
    defaultKey: 'alt+4',
    currentKey: 'alt+4',
    description: 'Navigate to settings',
    action: 'navigate',
    target: '/settings',
  },

  // Quick Actions - Using Alt+Shift to avoid browser conflicts
  'action_new_quote': {
    id: 'action_new_quote',
    name: 'Create New Quote',
    category: SHORTCUT_CATEGORIES.ACTIONS,
    defaultKey: 'alt+shift+n',
    currentKey: 'alt+shift+n',
    description: 'Create new quote from anywhere',
    action: 'create_quote',
  },
  'action_save': {
    id: 'action_save',
    name: 'Save',
    category: SHORTCUT_CATEGORIES.ACTIONS,
    defaultKey: 'alt+shift+s',
    currentKey: 'alt+shift+s',
    description: 'Save current quote/form',
    action: 'save',
  },
  'action_convert_invoice': {
    id: 'action_convert_invoice',
    name: 'Convert to Invoice',
    category: SHORTCUT_CATEGORIES.ACTIONS,
    defaultKey: 'alt+shift+i',
    currentKey: 'alt+shift+i',
    description: 'Convert quote to invoice',
    action: 'convert_invoice',
  },
  'action_mark_paid': {
    id: 'action_mark_paid',
    name: 'Mark as Paid',
    category: SHORTCUT_CATEGORIES.ACTIONS,
    defaultKey: 'alt+shift+p',
    currentKey: 'alt+shift+p',
    description: 'Mark invoice as paid and open packing slip',
    action: 'mark_paid',
  },
  'action_sync_zoho': {
    id: 'action_sync_zoho',
    name: 'Sync with Zoho',
    category: SHORTCUT_CATEGORIES.ACTIONS,
    defaultKey: 'alt+shift+z',
    currentKey: 'alt+shift+z',
    description: 'Force sync with Zoho Books',
    action: 'sync_zoho',
  },

  // Quote Editing
  'quote_focus_customer': {
    id: 'quote_focus_customer',
    name: 'Focus Customer Field',
    category: SHORTCUT_CATEGORIES.QUOTE_EDIT,
    defaultKey: 'alt+c',
    currentKey: 'alt+c',
    description: 'Jump to customer selection',
    action: 'focus_customer',
  },
  'quote_focus_project': {
    id: 'quote_focus_project',
    name: 'Focus Project Field',
    category: SHORTCUT_CATEGORIES.QUOTE_EDIT,
    defaultKey: 'alt+r',
    currentKey: 'alt+r',
    description: 'Jump to project name field',
    action: 'focus_project',
  },
  'quote_add_item': {
    id: 'quote_add_item',
    name: 'Add New Item',
    category: SHORTCUT_CATEGORIES.QUOTE_EDIT,
    defaultKey: 'alt+a',
    currentKey: 'alt+a',
    description: 'Add new line item',
    action: 'add_item',
  },

  // Items Table
  'table_focus_product': {
    id: 'table_focus_product',
    name: 'Focus Product Search',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'ctrl+k',
    currentKey: 'ctrl+k',
    description: 'Focus product search field',
    action: 'focus_product',
  },
  'table_next_cell': {
    id: 'table_next_cell',
    name: 'Next Cell',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'tab',
    currentKey: 'tab',
    description: 'Move to next cell',
    action: 'next_cell',
    nonCustomizable: true,
  },
  'table_prev_cell': {
    id: 'table_prev_cell',
    name: 'Previous Cell',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'shift+tab',
    currentKey: 'shift+tab',
    description: 'Move to previous cell',
    action: 'prev_cell',
    nonCustomizable: true,
  },
  'table_next_row': {
    id: 'table_next_row',
    name: 'Next Row',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'enter',
    currentKey: 'enter',
    description: 'Move to next row (Product → Qty → New row)',
    action: 'next_row',
    nonCustomizable: true,
  },
  'table_prev_row': {
    id: 'table_prev_row',
    name: 'Previous Row',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'shift+enter',
    currentKey: 'shift+enter',
    description: 'Move to previous row',
    action: 'prev_row',
    nonCustomizable: true,
  },
  'table_duplicate_row': {
    id: 'table_duplicate_row',
    name: 'Duplicate Row',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'ctrl+d',
    currentKey: 'ctrl+d',
    description: 'Duplicate current row',
    action: 'duplicate_row',
  },
  'table_delete_row': {
    id: 'table_delete_row',
    name: 'Delete Row',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'backspace',
    currentKey: 'backspace',
    description: 'Delete row (when product is empty)',
    action: 'delete_row',
    nonCustomizable: true,
  },
  'table_move_up': {
    id: 'table_move_up',
    name: 'Move Row Up',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'alt+arrowup',
    currentKey: 'alt+arrowup',
    description: 'Move current row up',
    action: 'move_row_up',
  },
  'table_move_down': {
    id: 'table_move_down',
    name: 'Move Row Down',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'alt+arrowdown',
    currentKey: 'alt+arrowdown',
    description: 'Move current row down',
    action: 'move_row_down',
  },
  'table_bulk_paste': {
    id: 'table_bulk_paste',
    name: 'Bulk Paste',
    category: SHORTCUT_CATEGORIES.TABLE,
    defaultKey: 'ctrl+v',
    currentKey: 'ctrl+v',
    description: 'Paste multiple rows from clipboard',
    action: 'bulk_paste',
    nonCustomizable: true,
  },

  // Search & Find - Using Alt+Shift to avoid browser conflicts
  'search_global': {
    id: 'search_global',
    name: 'Global Search',
    category: SHORTCUT_CATEGORIES.SEARCH,
    defaultKey: 'alt+shift+f',
    currentKey: 'alt+shift+f',
    description: 'Open global search',
    action: 'global_search',
  },
  'search_quick_switch': {
    id: 'search_quick_switch',
    name: 'Quick Switcher',
    category: SHORTCUT_CATEGORIES.SEARCH,
    defaultKey: 'alt+shift+q',
    currentKey: 'alt+shift+q',
    description: 'Quick jump to any quote/invoice',
    action: 'quick_switch',
  },
  'search_command_palette': {
    id: 'search_command_palette',
    name: 'Command Palette',
    category: SHORTCUT_CATEGORIES.SEARCH,
    defaultKey: 'alt+shift+k',
    currentKey: 'alt+shift+k',
    description: 'Open command palette',
    action: 'command_palette',
  },
  'search_customer': {
    id: 'search_customer',
    name: 'Search Customer',
    category: SHORTCUT_CATEGORIES.SEARCH,
    defaultKey: 'alt+shift+c',
    currentKey: 'alt+shift+c',
    description: 'Quick customer search',
    action: 'search_customer',
  },

  // View Controls - Using Alt+Shift
  'view_toggle_sidebar': {
    id: 'view_toggle_sidebar',
    name: 'Toggle Sidebar',
    category: SHORTCUT_CATEGORIES.VIEW,
    defaultKey: 'alt+shift+b',
    currentKey: 'alt+shift+b',
    description: 'Show/hide sidebar',
    action: 'toggle_sidebar',
  },
  'view_toggle_theme': {
    id: 'view_toggle_theme',
    name: 'Toggle Dark Mode',
    category: SHORTCUT_CATEGORIES.VIEW,
    defaultKey: 'alt+shift+d',
    currentKey: 'alt+shift+d',
    description: 'Switch between light and dark mode',
    action: 'toggle_theme',
  },
  'view_refresh': {
    id: 'view_refresh',
    name: 'Refresh Data',
    category: SHORTCUT_CATEGORIES.VIEW,
    defaultKey: 'f5',
    currentKey: 'f5',
    description: 'Refresh current view data',
    action: 'refresh',
  },
  'view_zoom_in': {
    id: 'view_zoom_in',
    name: 'Zoom In',
    category: SHORTCUT_CATEGORIES.VIEW,
    defaultKey: 'ctrl+=',
    currentKey: 'ctrl+=',
    description: 'Increase zoom level',
    action: 'zoom_in',
  },
  'view_zoom_out': {
    id: 'view_zoom_out',
    name: 'Zoom Out',
    category: SHORTCUT_CATEGORIES.VIEW,
    defaultKey: 'ctrl+-',
    currentKey: 'ctrl+-',
    description: 'Decrease zoom level',
    action: 'zoom_out',
  },

  // System
  'system_help': {
    id: 'system_help',
    name: 'Show Help',
    category: SHORTCUT_CATEGORIES.SYSTEM,
    defaultKey: '?',
    currentKey: '?',
    description: 'Show keyboard shortcuts panel',
    action: 'show_help',
    nonCustomizable: true,
  },
  'system_help_alt': {
    id: 'system_help_alt',
    name: 'Show Help (Alt)',
    category: SHORTCUT_CATEGORIES.SYSTEM,
    defaultKey: 'f1',
    currentKey: 'f1',
    description: 'Show keyboard shortcuts panel',
    action: 'show_help',
    nonCustomizable: true,
  },
  'system_close': {
    id: 'system_close',
    name: 'Close/Cancel',
    category: SHORTCUT_CATEGORIES.SYSTEM,
    defaultKey: 'escape',
    currentKey: 'escape',
    description: 'Close modal/drawer/cancel action',
    action: 'close',
    nonCustomizable: true,
  },
  'system_settings': {
    id: 'system_settings',
    name: 'Open Settings',
    category: SHORTCUT_CATEGORIES.SYSTEM,
    defaultKey: 'ctrl+,',
    currentKey: 'ctrl+,',
    description: 'Open settings page',
    action: 'open_settings',
  },
}

// Parse key combination string to object
export function parseKeyCombo(keyString) {
  const parts = keyString.toLowerCase().split('+')
  return {
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd'),
    key: parts[parts.length - 1],
  }
}

// Format key combo for display
export function formatKeyCombo(keyString) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  
  return keyString
    .split('+')
    .map(key => {
      switch (key.toLowerCase()) {
        case 'ctrl': return isMac ? '⌃' : 'Ctrl'
        case 'shift': return isMac ? '⇧' : 'Shift'
        case 'alt': return isMac ? '⌥' : 'Alt'
        case 'meta':
        case 'cmd': return isMac ? '⌘' : 'Win'
        case 'enter': return '↵'
        case 'escape': return 'Esc'
        case 'backspace': return '⌫'
        case 'arrowup': return '↑'
        case 'arrowdown': return '↓'
        case 'arrowleft': return '←'
        case 'arrowright': return '→'
        default: return key.charAt(0).toUpperCase() + key.slice(1)
      }
    })
    .join(isMac ? '' : ' + ')
}

// Check if key event matches shortcut
export function matchesShortcut(event, shortcut) {
  const combo = parseKeyCombo(shortcut.currentKey)
  
  const ctrlMatch = combo.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
  const shiftMatch = combo.shift ? event.shiftKey : !event.shiftKey
  const altMatch = combo.alt ? event.altKey : !event.altKey
  
  const keyMatch = event.key.toLowerCase() === combo.key.toLowerCase()
  
  return ctrlMatch && shiftMatch && altMatch && keyMatch
}

// Validate shortcut key combination
export function validateShortcut(keyString) {
  if (!keyString || keyString.trim() === '') {
    return { valid: false, error: 'Shortcut cannot be empty' }
  }

  const parts = keyString.toLowerCase().split('+')
  const key = parts[parts.length - 1]

  // Reserved keys that shouldn't be customized
  const reserved = ['tab', 'enter', 'escape', 'backspace']
  if (reserved.includes(key) && parts.length === 1) {
    return { valid: false, error: 'This key is reserved for system use' }
  }

  // Must have at least one modifier for most keys
  const hasModifier = parts.some(p => ['ctrl', 'shift', 'alt', 'meta', 'cmd'].includes(p))
  const singleKeyAllowed = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', '?']
  
  if (!hasModifier && !singleKeyAllowed.includes(key)) {
    return { valid: false, error: 'Shortcut must include a modifier key (Ctrl, Shift, Alt)' }
  }

  return { valid: true }
}

// Check for conflicts with existing shortcuts
export function checkConflicts(newKey, currentShortcutId, allShortcuts) {
  const conflicts = Object.values(allShortcuts).filter(
    shortcut => shortcut.id !== currentShortcutId && shortcut.currentKey === newKey
  )
  
  return conflicts.length > 0 ? conflicts : null
}

// Get shortcuts by category
export function getShortcutsByCategory(shortcuts) {
  const grouped = {}
  
  Object.values(shortcuts).forEach(shortcut => {
    if (!grouped[shortcut.category]) {
      grouped[shortcut.category] = []
    }
    grouped[shortcut.category].push(shortcut)
  })
  
  return grouped
}

// Reset all shortcuts to defaults
export function resetAllShortcuts() {
  const reset = {}
  Object.entries(DEFAULT_SHORTCUTS).forEach(([key, shortcut]) => {
    reset[key] = { ...shortcut, currentKey: shortcut.defaultKey }
  })
  return reset
}

// Export shortcuts as JSON
export function exportShortcuts(shortcuts) {
  return JSON.stringify(shortcuts, null, 2)
}

// Import shortcuts from JSON
export function importShortcuts(jsonString) {
  try {
    const imported = JSON.parse(jsonString)
    // Validate structure
    if (typeof imported !== 'object') {
      throw new Error('Invalid format')
    }
    return { success: true, shortcuts: imported }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
