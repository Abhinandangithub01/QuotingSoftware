# ⌨️ Keyboard Shortcuts - Complete Guide

## Overview

The Venezia Quoting System includes a comprehensive **keyboard shortcuts system** with **30+ customizable shortcuts** to maximize productivity.

---

## 🎯 Features

### ✅ What's Included

1. **30+ Shortcuts** - Covering all major actions
2. **Full Customization** - Change any shortcut to your preference
3. **Category Organization** - Grouped by function
4. **Conflict Detection** - Prevents duplicate shortcuts
5. **Import/Export** - Share shortcuts with team
6. **Visual Editor** - Easy-to-use interface
7. **Key Recording** - Press keys to set shortcuts
8. **Reset Options** - Individual or bulk reset

---

## 📋 Default Shortcuts

### Navigation (Ctrl+Number)
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+1` | Go to Quotes | Navigate to quotes list |
| `Ctrl+2` | New Quote | Navigate to new quote page |
| `Ctrl+3` | Go to Dispatch | Navigate to dispatch queue |
| `Ctrl+4` | Go to Settings | Navigate to settings |

### Quick Actions
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+N` | Create New Quote | Create quote from anywhere |
| `Ctrl+S` | Save | Save current quote/form |
| `Ctrl+Enter` | Convert to Invoice | Convert quote to invoice |
| `Alt+P` | Mark as Paid | Mark invoice paid + open packing slip |
| `Ctrl+Shift+S` | Sync with Zoho | Force sync with Zoho Books |

### Quote Editing
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Alt+C` | Focus Customer | Jump to customer selection |
| `Alt+R` | Focus Project | Jump to project name field |
| `Alt+A` | Add New Item | Add new line item |

### Items Table
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+K` | Focus Product Search | Focus product search field |
| `Tab` | Next Cell | Move to next cell |
| `Shift+Tab` | Previous Cell | Move to previous cell |
| `Enter` | Next Row | Product → Qty → New row |
| `Shift+Enter` | Previous Row | Move to previous row |
| `Ctrl+D` | Duplicate Row | Duplicate current row |
| `Backspace` | Delete Row | Delete row (when product empty) |
| `Alt+↑` | Move Row Up | Move current row up |
| `Alt+↓` | Move Row Down | Move current row down |
| `Ctrl+V` | Bulk Paste | Paste multiple rows |

### Search & Find
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+F` | Global Search | Open global search |
| `Ctrl+P` | Quick Switcher | Jump to any quote/invoice |
| `Ctrl+Shift+P` | Command Palette | Open command palette |
| `Ctrl+Shift+C` | Search Customer | Quick customer search |

### View Controls
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+B` | Toggle Sidebar | Show/hide sidebar |
| `Ctrl+Shift+D` | Toggle Dark Mode | Switch theme |
| `F5` | Refresh Data | Refresh current view |
| `Ctrl+=` | Zoom In | Increase zoom level |
| `Ctrl+-` | Zoom Out | Decrease zoom level |

### System
| Shortcut | Action | Description |
|----------|--------|-------------|
| `?` or `F1` | Show Help | Show shortcuts panel |
| `Escape` | Close/Cancel | Close modal/drawer |
| `Ctrl+,` | Open Settings | Open settings page |

---

## 🛠️ Customizing Shortcuts

### Access Shortcuts Settings

1. Go to **Settings** (Ctrl+4 or Ctrl+,)
2. Click **"Shortcuts"** tab
3. Browse or search for shortcuts

### Edit a Shortcut

**Method 1: Type the Shortcut**
1. Click **Edit** (pencil icon) next to any shortcut
2. Type your desired key combination (e.g., `ctrl+shift+q`)
3. Click **Save Shortcut**

**Method 2: Record Keys**
1. Click **Edit** next to any shortcut
2. Click **Record** button
3. Press your desired key combination
4. Click **Save Shortcut**

### Shortcut Rules

✅ **Allowed:**
- Modifier keys: `Ctrl`, `Shift`, `Alt`
- Letters: `A-Z`
- Numbers: `0-9`
- Function keys: `F1-F12` (can be used alone)
- Special keys: `?` (can be used alone)

❌ **Not Allowed:**
- Single letters without modifiers (e.g., just `A`)
- Reserved keys: `Tab`, `Enter`, `Escape` (system use)
- Browser shortcuts (may conflict)

### Best Practices

1. **Use Modifiers** - Always include Ctrl, Shift, or Alt
2. **Avoid Conflicts** - System warns if shortcut exists
3. **Be Consistent** - Use similar patterns for related actions
4. **Test First** - Try shortcut before saving
5. **Document Changes** - Export for team sharing

---

## 📁 Import/Export Shortcuts

### Export Shortcuts

1. Go to **Settings → Shortcuts**
2. Click **Export** button
3. Save `venezia-shortcuts.json` file
4. Share with team members

### Import Shortcuts

1. Go to **Settings → Shortcuts**
2. Click **Import** button
3. Select `.json` file
4. Shortcuts are applied immediately

### Share with Team

```bash
# Export from one computer
Settings → Shortcuts → Export → venezia-shortcuts.json

# Import on another computer
Settings → Shortcuts → Import → Select file
```

---

## 🔄 Reset Shortcuts

### Reset Individual Shortcut

1. Find the shortcut you want to reset
2. Click the **Reset** icon (circular arrow)
3. Shortcut returns to default

### Reset All Shortcuts

1. Go to **Settings → Shortcuts**
2. Click **Reset All** button
3. Confirm the action
4. All shortcuts return to defaults

---

## 🔍 Search Shortcuts

Use the search bar to quickly find shortcuts:

**Search by:**
- Action name (e.g., "save")
- Description (e.g., "invoice")
- Key combination (e.g., "ctrl+s")

**Example:**
```
Search: "customer"
Results:
- Focus Customer Field (Alt+C)
- Search Customer (Ctrl+Shift+C)
```

---

## 📊 Shortcuts by Category

### Navigation (4 shortcuts)
Quick access to main pages

### Quick Actions (5 shortcuts)
Common operations from anywhere

### Quote Editing (3 shortcuts)
Focus specific fields quickly

### Items Table (10 shortcuts)
Efficient data entry

### Search & Find (4 shortcuts)
Find anything fast

### View Controls (5 shortcuts)
Adjust display settings

### System (3 shortcuts)
Help and settings

---

## 🎨 Customization Examples

### Example 1: VS Code Style
```
Ctrl+P → Quick Switcher
Ctrl+Shift+P → Command Palette
Ctrl+B → Toggle Sidebar
Ctrl+, → Settings
```

### Example 2: Excel Style
```
Ctrl+N → New Quote
Ctrl+S → Save
Ctrl+F → Find
F5 → Refresh
```

### Example 3: Custom Workflow
```
Ctrl+Q → Go to Quotes
Ctrl+W → New Quote
Ctrl+E → Edit Quote
Ctrl+R → Refresh
```

---

## 🚨 Troubleshooting

### Shortcut Not Working

**Check:**
1. ✅ Shortcuts are enabled (Settings → General)
2. ✅ No browser extension conflicts
3. ✅ Correct modifier keys pressed
4. ✅ Focus is in correct area

### Conflict with Browser

Some shortcuts may conflict with browser:
- `Ctrl+N` - New window (browser)
- `Ctrl+T` - New tab (browser)
- `Ctrl+W` - Close tab (browser)

**Solution:** Use different combinations like:
- `Ctrl+Shift+N` instead of `Ctrl+N`
- `Alt+N` instead of `Ctrl+N`

### Shortcut Doesn't Save

**Reasons:**
1. Invalid key combination
2. Conflicts with existing shortcut
3. Reserved system key

**Fix:**
- Add modifier key (Ctrl, Shift, Alt)
- Choose different combination
- Check for conflicts

---

## 💡 Pro Tips

### 1. Muscle Memory
Learn shortcuts in groups:
- Week 1: Navigation (Ctrl+1-4)
- Week 2: Actions (Ctrl+N, S, Enter)
- Week 3: Table (Ctrl+K, D, Alt+arrows)

### 2. Cheat Sheet
Print the shortcuts panel:
1. Press `?` or `F1`
2. Click **Copy Cheatsheet**
3. Print or save

### 3. Team Consistency
Share shortcuts file with team:
```
1. One person customizes
2. Export shortcuts.json
3. Team imports same file
4. Everyone has same shortcuts
```

### 4. Context-Aware
Shortcuts work differently based on context:
- `Ctrl+S` in quote → Save quote
- `Ctrl+S` in settings → Save settings
- `Enter` in table → Next row
- `Enter` in dialog → Confirm

### 5. Combine with Mouse
- Use shortcuts for speed
- Use mouse for precision
- Best of both worlds

---

## 📈 Productivity Gains

### Time Saved per Action

| Action | Mouse | Keyboard | Saved |
|--------|-------|----------|-------|
| Navigate to Quotes | 3s | 0.5s | 2.5s |
| Create New Quote | 4s | 0.5s | 3.5s |
| Save Quote | 2s | 0.5s | 1.5s |
| Add Item | 3s | 0.5s | 2.5s |
| Duplicate Row | 5s | 0.5s | 4.5s |

### Daily Impact

**Assuming 50 quotes/day:**
- 50 navigations × 2.5s = **2 minutes saved**
- 50 saves × 1.5s = **1.25 minutes saved**
- 200 items × 2.5s = **8 minutes saved**
- 50 duplicates × 4.5s = **3.75 minutes saved**

**Total: ~15 minutes saved per day**
**Per month: ~6 hours saved**
**Per year: ~75 hours saved**

---

## 🔧 Technical Details

### Storage
Shortcuts are stored in:
```javascript
localStorage.setItem('customShortcuts', JSON.stringify(shortcuts))
```

### File Format
Export file structure:
```json
{
  "nav_quotes": {
    "id": "nav_quotes",
    "name": "Go to Quotes",
    "category": "Navigation",
    "defaultKey": "ctrl+1",
    "currentKey": "ctrl+1",
    "description": "Navigate to quotes list"
  },
  // ... more shortcuts
}
```

### Integration
Shortcuts integrate with:
- React Router (navigation)
- Form handlers (save, submit)
- Table components (row operations)
- Modal/Dialog (close, confirm)

---

## 📚 Related Documentation

- **QUICKSTART.md** - Basic shortcuts overview
- **FEATURES.md** - All features including shortcuts
- **SETUP.md** - Initial configuration

---

## ✅ Shortcuts Checklist

### Getting Started
- [ ] Review default shortcuts
- [ ] Try 5 most-used shortcuts
- [ ] Customize if needed
- [ ] Enable in settings

### Customization
- [ ] Edit shortcuts to preference
- [ ] Test for conflicts
- [ ] Export for backup
- [ ] Share with team

### Mastery
- [ ] Learn all navigation shortcuts
- [ ] Master table shortcuts
- [ ] Use command palette
- [ ] Achieve <1s per action

---

## 🎯 Quick Reference Card

```
┌─────────────────────────────────────┐
│     VENEZIA KEYBOARD SHORTCUTS      │
├─────────────────────────────────────┤
│ NAVIGATION                          │
│ Ctrl+1-4    Pages                   │
│                                     │
│ ACTIONS                             │
│ Ctrl+N      New Quote               │
│ Ctrl+S      Save                    │
│ Ctrl+Enter  Convert to Invoice      │
│ Alt+P       Mark Paid               │
│                                     │
│ TABLE                               │
│ Ctrl+K      Product Search          │
│ Ctrl+D      Duplicate Row           │
│ Alt+↑/↓     Move Row                │
│ Enter       Next Row                │
│                                     │
│ SEARCH                              │
│ Ctrl+F      Global Search           │
│ Ctrl+P      Quick Switcher          │
│                                     │
│ SYSTEM                              │
│ ?/F1        Show Help               │
│ Esc         Close                   │
│ Ctrl+,      Settings                │
└─────────────────────────────────────┘
```

---

**Master these shortcuts and become a power user!** ⚡

For questions or custom shortcuts, visit Settings → Shortcuts
