import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

const shortcuts = [
  { key: 'Enter', description: 'Product → Qty → New row' },
  { key: 'Shift + Enter', description: 'Reverse focus' },
  { key: 'Tab / Shift + Tab', description: 'Next/Previous cell' },
  { key: 'Ctrl/Cmd + K', description: 'Focus product search' },
  { key: 'Ctrl + S', description: 'Save quote' },
  { key: 'Ctrl + Enter', description: 'Convert to Invoice' },
  { key: 'Alt + P', description: 'Mark Paid + open Packing Slip' },
  { key: 'Ctrl + D', description: 'Duplicate row' },
  { key: 'Alt + ↑ / Alt + ↓', description: 'Move row up/down' },
  { key: 'Backspace', description: 'Delete row (on empty Product)' },
  { key: 'Ctrl + V', description: 'Bulk paste rows' },
  { key: 'Esc', description: 'Close modal/drawer' },
  { key: '? or F1', description: 'Show this panel' },
]

export function KeyboardShortcuts({ open, onOpenChange }) {
  const copyCheatsheet = () => {
    const text = shortcuts.map(s => `${s.key}: ${s.description}`).join('\n')
    navigator.clipboard.writeText(text)
    toast.success('Shortcuts copied to clipboard!')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Master these shortcuts to speed up your workflow
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  <kbd className="pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                    {shortcut.key}
                  </kbd>
                </div>
                {index < shortcuts.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={copyCheatsheet} variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Copy Cheatsheet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
