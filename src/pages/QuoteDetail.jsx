import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Edit, MoreVertical, FileText, DollarSign, CheckCircle, Printer, Download, Clock } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { toast } from 'sonner'

const statusColors = {
  Draft: 'secondary',
  Sent: 'default',
  Invoiced: 'warning',
  Paid: 'success',
}

export function QuoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const quotes = useStore((state) => state.quotes)
  const updateQuote = useStore((state) => state.updateQuote)
  const [quote, setQuote] = useState(null)
  const [packingSlipOpen, setPackingSlipOpen] = useState(false)

  useEffect(() => {
    const foundQuote = quotes.find(q => q.id === id)
    setQuote(foundQuote)
  }, [id, quotes])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + P: Mark Paid
      if (e.altKey && e.key === 'p' && quote?.status === 'Invoiced') {
        e.preventDefault()
        handleMarkPaid()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [quote])

  const handleConvertToInvoice = () => {
    updateQuote(id, { status: 'Invoiced' })
    setQuote({ ...quote, status: 'Invoiced' })
    toast.success('Quote converted to invoice')
  }

  const handleMarkPaid = () => {
    updateQuote(id, { status: 'Paid' })
    setQuote({ ...quote, status: 'Paid' })
    toast.success('Invoice marked as paid')
    setPackingSlipOpen(true)
  }

  if (!quote) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Quote not found</p>
      </div>
    )
  }

  const subtotal = quote.items?.reduce((sum, item) => sum + item.lineTotal, 0) || 0
  const tax = subtotal * 0.0625
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{quote.project}</h1>
            <Badge variant={statusColors[quote.status]}>{quote.status}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="font-mono">{quote.quoteNumber}</span>
            {quote.zohoQuoteNumber && (
              <>
                <span>•</span>
                <span>Zoho: {quote.zohoQuoteNumber}</span>
              </>
            )}
            <span>•</span>
            <span>Updated {formatDateTime(quote.updatedAt)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => navigate(`/quotes/${id}/edit`)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {quote.status === 'Draft' && (
            <Button onClick={handleConvertToInvoice}>
              <FileText className="mr-2 h-4 w-4" />
              Convert to Invoice
            </Button>
          )}
          {quote.status === 'Invoiced' && (
            <Button onClick={handleMarkPaid}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Paid
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{quote.client}</p>
              </div>
              {quote.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{quote.location}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quote.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name || 'Product'}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.qty} × {formatCurrency(item.unitPrice)}
                        {item.discount > 0 && ` (${item.discount}% off)`}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.lineTotal)}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Quote Created</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(quote.createdAt)}</p>
                  </div>
                </div>

                {quote.status !== 'Draft' && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Quote Sent</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(quote.updatedAt)}</p>
                    </div>
                  </div>
                )}

                {(quote.status === 'Invoiced' || quote.status === 'Paid') && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10">
                      <DollarSign className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Converted to Invoice</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(quote.updatedAt)}</p>
                    </div>
                  </div>
                )}

                {quote.status === 'Paid' && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(quote.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              {quote.status === 'Invoiced' && (
                <div className="mt-6 p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Keyboard Shortcut</p>
                  <p className="text-sm">
                    Press <kbd className="px-1.5 py-0.5 text-xs border rounded bg-background">Alt+P</kbd> to mark as paid
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Packing Slip Modal */}
      <Dialog open={packingSlipOpen} onOpenChange={setPackingSlipOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Packing Slip Generated</DialogTitle>
            <DialogDescription>
              A packing slip has been created for this invoice
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Packing Slip #</p>
                  <p className="font-mono font-semibold">PS-{quote.id.slice(-3)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice #</p>
                  <p className="font-mono font-semibold">INV-{quote.id}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <p className="font-medium">{quote.client}</p>
                <p className="text-sm text-muted-foreground">{quote.project}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/dispatch')} className="flex-1">
                View in Dispatch Queue
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
