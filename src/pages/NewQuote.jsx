import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ItemsTable } from '@/components/ItemsTable'
import { CatalogDrawer } from '@/components/CatalogDrawer'
import { Save, FileText, DollarSign, Info, Package } from 'lucide-react'
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
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Quote</h1>
        <p className="text-muted-foreground">Create a new quote for your customer</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer & Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project">Project Name *</Label>
                  <Input
                    id="project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Kitchen Renovation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dispatch">Dispatch Date</Label>
                  <Input
                    id="dispatch"
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="123 Main St, Boston, MA"
                />
              </div>

              {zohoQuoteNumber && (
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Zoho Quote #:</span>
                    <span className="font-mono text-sm">{zohoQuoteNumber}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Line Items</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Press <kbd className="px-1.5 py-0.5 text-xs border rounded bg-muted">Ctrl+K</kbd> to search products
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">
                        {taxResult.exempt ? 'Tax (Exempt)' : `Tax (${taxResult.totalTaxRate.toFixed(2)}%)`}
                      </span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-4 w-4">
                            <Info className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">US Sales Tax Breakdown</h4>
                            {taxResult.exempt ? (
                              <div className="text-sm">
                                <p className="text-green-600 font-medium">Tax Exempt</p>
                                <p className="text-muted-foreground">{taxResult.exemptReason}</p>
                              </div>
                            ) : (
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">State ({customerState}):</span>
                                  <span>{taxResult.stateTaxRate}% = {formatCurrency(taxResult.stateTax)}</span>
                                </div>
                                {taxResult.localTaxRate > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Local Tax:</span>
                                    <span>{taxResult.localTaxRate}% = {formatCurrency(taxResult.localTax)}</span>
                                  </div>
                                )}
                                <Separator />
                                <div className="flex justify-between font-medium">
                                  <span>Total Tax:</span>
                                  <span>{formatCurrency(tax)}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatTaxBreakdown(taxResult)}
                                </p>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping" className="text-sm text-muted-foreground">Shipping</Label>
                    <div className="flex gap-2">
                      <Select value={shippingMethod} onValueChange={setShippingMethod}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                        className="w-24"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button 
                    onClick={() => handleSave(false)} 
                    className="w-full"
                    size="lg"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Quote
                  </Button>
                  <Button 
                    onClick={() => handleSave(true)} 
                    variant="outline" 
                    className="w-full"
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    onClick={handleConvertToInvoice} 
                    variant="secondary" 
                    className="w-full"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Convert to Invoice
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <p>💡 <kbd className="px-1 py-0.5 border rounded bg-muted">Ctrl+S</kbd> to save</p>
                  <p>💡 <kbd className="px-1 py-0.5 border rounded bg-muted">Ctrl+Enter</kbd> to convert</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 lg:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Grand Total</span>
          <span className="text-xl font-bold">{formatCurrency(grandTotal)}</span>
        </div>
        <Button onClick={() => handleSave(false)} className="w-full" size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save Quote
        </Button>
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
