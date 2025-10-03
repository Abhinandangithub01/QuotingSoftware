import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  DEFAULT_SHORTCUTS, 
  SHORTCUT_CATEGORIES,
  getShortcutsByCategory,
  formatKeyCombo,
  validateShortcut,
  checkConflicts,
  resetAllShortcuts,
  exportShortcuts,
  importShortcuts
} from '@/lib/shortcuts'
import { 
  Keyboard, 
  RotateCcw, 
  Download, 
  Upload, 
  Search, 
  AlertCircle,
  Check,
  X,
  Edit2,
  Lock
} from 'lucide-react'
import { toast } from 'sonner'

export function ShortcutsCustomizer() {
  const [shortcuts, setShortcuts] = useState(() => {
    const saved = localStorage.getItem('customShortcuts')
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS
  })
  
  const [editingShortcut, setEditingShortcut] = useState(null)
  const [newKey, setNewKey] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [recordingKey, setRecordingKey] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  // Save shortcuts to localStorage
  useEffect(() => {
    localStorage.setItem('customShortcuts', JSON.stringify(shortcuts))
  }, [shortcuts])

  // Record key combination
  useEffect(() => {
    if (!recordingKey) return

    const handleKeyDown = (e) => {
      e.preventDefault()
      
      const parts = []
      if (e.ctrlKey || e.metaKey) parts.push('ctrl')
      if (e.shiftKey) parts.push('shift')
      if (e.altKey) parts.push('alt')
      
      const key = e.key.toLowerCase()
      if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
        parts.push(key)
        setNewKey(parts.join('+'))
        setRecordingKey(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [recordingKey])

  const handleEdit = (shortcut) => {
    if (shortcut.nonCustomizable) {
      toast.error('This shortcut cannot be customized')
      return
    }
    setEditingShortcut(shortcut)
    setNewKey(shortcut.currentKey)
  }

  const handleSave = () => {
    if (!editingShortcut) return

    // Validate
    const validation = validateShortcut(newKey)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    // Check conflicts
    const conflicts = checkConflicts(newKey, editingShortcut.id, shortcuts)
    if (conflicts) {
      toast.error(`Conflict with: ${conflicts[0].name}`)
      return
    }

    // Update shortcut
    setShortcuts(prev => ({
      ...prev,
      [editingShortcut.id]: {
        ...prev[editingShortcut.id],
        currentKey: newKey
      }
    }))

    toast.success('Shortcut updated successfully')
    setEditingShortcut(null)
    setNewKey('')
  }

  const handleReset = (shortcutId) => {
    const shortcut = shortcuts[shortcutId]
    setShortcuts(prev => ({
      ...prev,
      [shortcutId]: {
        ...prev[shortcutId],
        currentKey: shortcut.defaultKey
      }
    }))
    toast.success('Shortcut reset to default')
  }

  const handleResetAll = () => {
    setShortcuts(resetAllShortcuts())
    setShowResetDialog(false)
    toast.success('All shortcuts reset to defaults')
  }

  const handleExport = () => {
    const json = exportShortcuts(shortcuts)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'venezia-shortcuts.json'
    a.click()
    toast.success('Shortcuts exported')
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = importShortcuts(event.target.result)
      if (result.success) {
        setShortcuts(result.shortcuts)
        toast.success('Shortcuts imported successfully')
      } else {
        toast.error(`Import failed: ${result.error}`)
      }
    }
    reader.readAsText(file)
  }

  const groupedShortcuts = getShortcutsByCategory(shortcuts)
  
  const filteredShortcuts = searchQuery
    ? Object.values(shortcuts).filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.currentKey.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </CardTitle>
              <CardDescription>
                Customize keyboard shortcuts to match your workflow
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" asChild>
                <label>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImport}
                  />
                </label>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Shortcuts List */}
          {filteredShortcuts ? (
            // Search results
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Found {filteredShortcuts.length} shortcuts
              </p>
              {filteredShortcuts.map(shortcut => (
                <ShortcutRow
                  key={shortcut.id}
                  shortcut={shortcut}
                  onEdit={handleEdit}
                  onReset={handleReset}
                />
              ))}
            </div>
          ) : (
            // Categorized view
            <Tabs defaultValue={SHORTCUT_CATEGORIES.NAVIGATION} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                {Object.values(SHORTCUT_CATEGORIES).map(category => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <TabsContent key={category} value={category} className="space-y-2 mt-4">
                  {categoryShortcuts.map(shortcut => (
                    <ShortcutRow
                      key={shortcut.id}
                      shortcut={shortcut}
                      onEdit={handleEdit}
                      onReset={handleReset}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingShortcut} onOpenChange={() => setEditingShortcut(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shortcut</DialogTitle>
            <DialogDescription>
              {editingShortcut?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Shortcut</Label>
              <div className="flex items-center gap-2">
                <kbd className="px-3 py-2 text-sm font-mono border rounded bg-muted">
                  {formatKeyCombo(editingShortcut?.currentKey || '')}
                </kbd>
                {editingShortcut?.currentKey !== editingShortcut?.defaultKey && (
                  <Badge variant="secondary">Modified</Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>New Shortcut</Label>
              <div className="flex gap-2">
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Type new shortcut..."
                  className="font-mono"
                />
                <Button
                  variant={recordingKey ? 'destructive' : 'outline'}
                  onClick={() => setRecordingKey(!recordingKey)}
                >
                  {recordingKey ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Keyboard className="h-4 w-4 mr-2" />
                      Record
                    </>
                  )}
                </Button>
              </div>
              {recordingKey && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Press your desired key combination...
                </p>
              )}
              {newKey && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Preview:</span>
                  <kbd className="px-2 py-1 text-xs font-mono border rounded bg-muted">
                    {formatKeyCombo(newKey)}
                  </kbd>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Tips:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use modifier keys (Ctrl, Shift, Alt) for better compatibility</li>
                <li>• Avoid conflicts with browser shortcuts</li>
                <li>• Function keys (F1-F12) can be used alone</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingShortcut(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Shortcut
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset All Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Shortcuts?</DialogTitle>
            <DialogDescription>
              This will reset all keyboard shortcuts to their default values. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetAll}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ShortcutRow({ shortcut, onEdit, onReset }) {
  const isModified = shortcut.currentKey !== shortcut.defaultKey
  const isCustomizable = !shortcut.nonCustomizable

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{shortcut.name}</p>
          {!isCustomizable && (
            <Lock className="h-3 w-3 text-muted-foreground" title="Cannot be customized" />
          )}
          {isModified && (
            <Badge variant="secondary" className="text-xs">Modified</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{shortcut.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <kbd className="px-3 py-1.5 text-sm font-mono border rounded-md bg-muted whitespace-nowrap">
          {formatKeyCombo(shortcut.currentKey)}
        </kbd>
        
        {isCustomizable && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(shortcut)}
              title="Edit shortcut"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            {isModified && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReset(shortcut.id)}
                title="Reset to default"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
