import { useState, useRef, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductTypeahead } from '@/components/ProductTypeahead'
import { Trash2, Plus, ChevronUp, ChevronDown, Copy } from 'lucide-react'
import { formatCurrency, parseBulkPaste, calculateArea } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

const finishColors = [
  { value: 'white', label: 'White', color: '#FFFFFF' },
  { value: 'gray', label: 'Gray', color: '#9CA3AF' },
  { value: 'black', label: 'Black', color: '#000000' },
  { value: 'oak', label: 'Oak', color: '#D4A574' },
  { value: 'chrome', label: 'Chrome', color: '#E5E7EB' },
]

export function ItemsTable({ items, onChange, onOpenCatalog }) {
  const [focusedCell, setFocusedCell] = useState({ row: 0, col: 0 })
  const [bulkPasteData, setBulkPasteData] = useState(null)
  const [showBulkPreview, setShowBulkPreview] = useState(false)
  const tableRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K: Focus product search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setFocusedCell({ row: 0, col: 0 })
      }

      // Ctrl + D: Duplicate row
      if (e.ctrlKey && e.key === 'd' && focusedCell.row >= 0) {
        e.preventDefault()
        duplicateRow(focusedCell.row)
      }

      // Alt + Arrow Up/Down: Move row
      if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault()
        if (e.key === 'ArrowUp') moveRowUp(focusedCell.row)
        else moveRowDown(focusedCell.row)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedCell, items])

  const addRow = () => {
    onChange([...items, {
      id: Date.now(),
      product: null,
      finish: '',
      dimensions: { length: '', width: '', height: '' },
      uom: 'piece',
      qty: 1,
      unitPrice: 0,
      discount: 0,
      lineTotal: 0,
    }])
  }

  const updateRow = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto-calculate line total
    if (field === 'qty' || field === 'unitPrice' || field === 'discount') {
      const item = newItems[index]
      const subtotal = item.qty * item.unitPrice
      item.lineTotal = subtotal - (subtotal * (item.discount / 100))
    }

    // Auto-calculate area for Quartz/Flooring
    if (field === 'dimensions' && newItems[index].product?.category in ['Quartz', 'Flooring']) {
      const { length, width } = value
      if (length && width) {
        const { area } = calculateArea(parseFloat(length), parseFloat(width))
        newItems[index].qty = area
      }
    }

    onChange(newItems)
  }

  const deleteRow = (index) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const duplicateRow = (index) => {
    const newItem = { ...items[index], id: Date.now() }
    const newItems = [...items]
    newItems.splice(index + 1, 0, newItem)
    onChange(newItems)
    toast.success('Row duplicated')
  }

  const moveRowUp = (index) => {
    if (index === 0) return
    const newItems = [...items]
    ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
    onChange(newItems)
    setFocusedCell({ ...focusedCell, row: index - 1 })
  }

  const moveRowDown = (index) => {
    if (index === items.length - 1) return
    const newItems = [...items]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    onChange(newItems)
    setFocusedCell({ ...focusedCell, row: index + 1 })
  }

  const handlePaste = (e, index) => {
    const pastedText = e.clipboardData.getData('text')
    if (pastedText.includes('\t') || pastedText.includes(',')) {
      e.preventDefault()
      const parsed = parseBulkPaste(pastedText)
      setBulkPasteData({ items: parsed, startIndex: index })
      setShowBulkPreview(true)
    }
  }

  const confirmBulkPaste = () => {
    if (!bulkPasteData) return
    
    const newItems = [...items]
    bulkPasteData.items.forEach((item, i) => {
      const index = bulkPasteData.startIndex + i
      if (index < newItems.length) {
        newItems[index] = {
          ...newItems[index],
          product: { code: item.code, name: item.name },
          qty: item.qty,
          unitPrice: item.price,
          lineTotal: item.qty * item.price,
        }
      } else {
        newItems.push({
          id: Date.now() + i,
          product: { code: item.code, name: item.name },
          finish: '',
          dimensions: { length: '', width: '', height: '' },
          uom: 'piece',
          qty: item.qty,
          unitPrice: item.price,
          discount: 0,
          lineTotal: item.qty * item.price,
        })
      }
    })
    
    onChange(newItems)
    setShowBulkPreview(false)
    toast.success(`${bulkPasteData.items.length} rows pasted`)
  }

  const handleKeyPress = (e, index, col) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (col === 0) {
        // Product -> Qty
        setFocusedCell({ row: index, col: 4 })
      } else if (col === 4) {
        // Qty -> New row
        if (index === items.length - 1) addRow()
        setFocusedCell({ row: index + 1, col: 0 })
      }
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      if (col === 4 && index > 0) {
        setFocusedCell({ row: index - 1, col: 0 })
      }
    } else if (e.key === 'Backspace' && !items[index].product && col === 0) {
      e.preventDefault()
      deleteRow(index)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead className="w-[150px]">Finish/Color</TableHead>
              <TableHead className="w-[180px]">Dimensions</TableHead>
              <TableHead className="w-[100px]">UoM</TableHead>
              <TableHead className="w-[100px]">Qty</TableHead>
              <TableHead className="w-[120px]">Unit Price</TableHead>
              <TableHead className="w-[100px]">Discount %</TableHead>
              <TableHead className="w-[120px]">Line Total</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell onPaste={(e) => handlePaste(e, index)}>
                  <ProductTypeahead
                    value={item.product}
                    onSelect={(product) => {
                      updateRow(index, 'product', product)
                      updateRow(index, 'unitPrice', product.price)
                      updateRow(index, 'uom', product.uom)
                    }}
                    onOpenCatalog={onOpenCatalog}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={item.finish}
                    onValueChange={(value) => updateRow(index, 'finish', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {finishColors.map((finish) => (
                        <SelectItem key={finish.value} value={finish.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded-full border"
                              style={{ backgroundColor: finish.color }}
                            />
                            {finish.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      placeholder="L"
                      value={item.dimensions.length}
                      onChange={(e) => updateRow(index, 'dimensions', {
                        ...item.dimensions,
                        length: e.target.value
                      })}
                      className="w-16"
                    />
                    <span className="flex items-center">×</span>
                    <Input
                      type="number"
                      placeholder="W"
                      value={item.dimensions.width}
                      onChange={(e) => updateRow(index, 'dimensions', {
                        ...item.dimensions,
                        width: e.target.value
                      })}
                      className="w-16"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={item.uom}
                    onValueChange={(value) => updateRow(index, 'uom', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">piece</SelectItem>
                      <SelectItem value="set">set</SelectItem>
                      <SelectItem value="sq ft">sq ft</SelectItem>
                      <SelectItem value="sq m">sq m</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateRow(index, 'qty', parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyPress(e, index, 4)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateRow(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateRow(index, 'discount', parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(item.lineTotal)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => duplicateRow(index)}
                      title="Duplicate (Ctrl+D)"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRow(index)}
                      title="Delete (Backspace)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={addRow} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Row
      </Button>

      {/* Bulk Paste Preview Dialog */}
      <Dialog open={showBulkPreview} onOpenChange={setShowBulkPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Paste Preview</DialogTitle>
            <DialogDescription>
              Review the parsed data before inserting
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulkPasteData?.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkPreview(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBulkPaste}>
              Insert {bulkPasteData?.items.length} Rows
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
