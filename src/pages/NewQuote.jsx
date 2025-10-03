import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ItemsTable } from '@/components/ItemsTable'
import { CatalogDrawer } from '@/components/CatalogDrawer'
import { Save, FileText, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { calculateUSTax, formatTaxBreakdown } from '@/lib/usTaxSystem'
import { useStore } from '@/store/useStore'
import { toast } from 'sonner'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

export function NewQuote() {
  const navigate = useNavigate()
  const addQuote = useStore((state) => state.addQuote)
  const customers = useStore((state) => state.customers)
  const products = useStore((state) => state.products)
  const fetchCustomers = useStore((state) => state.fetchCustomers)
  const fetchProducts = useStore((state) => state.fetchProducts)
  
  const [customer, setCustomer] = useState(null)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [location, setLocation] = useState('')
  const [dispatchDate, setDispatchDate] = useState('')
  const [items, setItems] = useState([{
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
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [shippingCost, setShippingCost] = useState(0)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [zohoQuoteNumber, setZohoQuoteNumber] = useState('')

  // Load customers and products from Zoho on mount (only if authenticated)
  useEffect(() => {
    const hasZohoToken = localStorage.getItem('zoho_access_token')
    
    console.log('NewQuote: hasZohoToken:', !!hasZohoToken)
    console.log('NewQuote: customers.length:', customers.length)
    console.log('NewQuote: products.length:', products.length)
    
    if (hasZohoToken) {
      // Always fetch to ensure we have latest data
      fetchCustomers()
      fetchProducts()
    }
  }, [fetchCustomers, fetchProducts])

  // Listen for global shortcut events
  useEffect(() => {
    const handleSaveEvent = () => {
      if (customer && projectName) {
        handleSave()
      }
    }

    const handleConvertEvent = () => {
      if (customer && projectName && items.length > 0) {
        handleConvertToInvoice()
      }
    }

    window.addEventListener('app:save', handleSaveEvent)
    window.addEventListener('app:convert_invoice', handleConvertEvent)

    return () => {
      window.removeEventListener('app:save', handleSaveEvent)
      window.removeEventListener('app:convert_invoice', handleConvertEvent)
    }
  }, [customer, projectName, items])

  // US Tax Calculation
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  // Get customer's state and ZIP for tax calculation
  const customerState = customer?.state || 'CA' // Default to CA
  const customerZip = customer?.zipCode || null
  
  // Calculate tax using US tax system
  const taxResult = useMemo(() => {
    if (!subtotal) return { totalTax: 0, totalTaxRate: 0, exempt: false }
    
    return calculateUSTax(subtotal, customerState, customerZip, {
      taxExemptCertificate: customer?.taxExemptCertificate,
      customerType: customer?.customerType || 'retail',
    })
  }, [subtotal, customerState, customerZip, customer])
  
  const tax = taxResult.totalTax
  const grandTotal = subtotal + tax + shippingCost

  const handleSave = (isDraft = false) => {
    if (!customer || !projectName) {
      toast.error('Please fill in customer and project name')
      return
    }

    const quote = {
      id: `Q-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      quoteNumber: `Q-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      zohoQuoteNumber: `ZQ-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      client: customer.name,
      project: projectName,
      location,
      total: grandTotal,
      status: isDraft ? 'Draft' : 'Sent',
      category: items[0]?.product?.category || 'General',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      items,
    }

    setZohoQuoteNumber(quote.zohoQuoteNumber)
    addQuote(quote)
    toast.success(isDraft ? 'Quote saved as draft' : 'Quote saved successfully')
    
    if (!isDraft) {
      setTimeout(() => navigate('/quotes'), 1000)
    }
  }

  const handleConvertToInvoice = () => {
    handleSave(false)
    toast.success('Quote converted to invoice')
  }

  return (
    <div className="pb-20">
      {/* Fixed Top Summary Bar */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-md">
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">New Quote</h1>
            <p className="text-xs text-muted-foreground">Create a new quote for your customer</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="text-base font-semibold">{formatCurrency(subtotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Tax ({taxResult.totalTaxRate.toFixed(2)}%)</p>
              <p className="text-base font-semibold">{formatCurrency(tax)}</p>
            </div>
            <div className="text-right border-l pl-4">
              <p className="text-xs text-muted-foreground">Grand Total</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(grandTotal)}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleSave(false)}>
                <Save className="mr-2 h-4 w-4" />
                Save Quote
              </Button>
              <Button onClick={() => handleSave(true)} variant="outline">
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Content */}
      <div className="p-6 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Customer & Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-start"
                    >
                      {customer ? customer.name : 'Select customer...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search customers..." />
                      <CommandList>
                        <CommandEmpty>
                          {customers.length === 0 
                            ? 'No customers loaded. Please sync in Settings.' 
                            : 'No customer found.'}
                        </CommandEmpty>
                        <CommandGroup>
                          {customers.map((c) => (
                            <CommandItem
                              key={c.id}
                              value={c.name}
                              onSelect={() => {
                                setCustomer(c)
                                setCustomerOpen(false)
                              }}
                            >
                              <div>
                                <p className="font-medium">{c.name}</p>
                                <p className="text-xs text-muted-foreground">{c.email}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-3 grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="project" className="text-sm">Project Name *</Label>
                  <Input
                    id="project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Kitchen Renovation"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dispatch" className="text-sm">Dispatch Date</Label>
                  <Input
                    id="dispatch"
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-sm">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="123 Main St, Boston, MA"
                    className="h-9"
                  />
                </div>
              </div>

              {zohoQuoteNumber && (
                <div className="rounded-md bg-muted p-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Zoho Quote #:</span>
                    <span className="font-mono text-xs">{zohoQuoteNumber}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Line Items</CardTitle>
                <div className="text-xs text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">Ctrl+K</kbd> to search products
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No items yet</h3>
                  <p className="text-muted-foreground mb-4">Start typing to search products</p>
                </div>
              ) : (
                <ItemsTable
                  items={items}
                  onChange={setItems}
                  onOpenCatalog={() => setCatalogOpen(true)}
                />
              )}
            </CardContent>
          </Card>

          {/* Shipping Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="shipping" className="text-sm">Shipping Method</Label>
                  <Select value={shippingMethod} onValueChange={setShippingMethod}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shippingCost" className="text-sm">Shipping Cost</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      <CatalogDrawer
        open={catalogOpen}
        onOpenChange={setCatalogOpen}
        onSelectProduct={(product) => {
          // Add to first empty row or create new row
          const emptyRowIndex = items.findIndex(item => !item.product)
          if (emptyRowIndex >= 0) {
            const newItems = [...items]
            newItems[emptyRowIndex] = {
              ...newItems[emptyRowIndex],
              product,
              unitPrice: product.price,
              uom: product.uom,
            }
            setItems(newItems)
          }
        }}
      />
    </div>
  )
}
