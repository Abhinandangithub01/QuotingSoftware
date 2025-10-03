import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Printer, Download, ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { mockPackingSlips } from '@/lib/mockData'
import { toast } from 'sonner'

export function PackingSlip() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [slip, setSlip] = useState(null)

  useEffect(() => {
    const foundSlip = mockPackingSlips.find(s => s.id === id)
    setSlip(foundSlip)
  }, [id])

  const handlePrint = () => {
    window.print()
    toast.success('Printing packing slip...')
  }

  const handleDownload = () => {
    toast.success('Downloading PDF...')
  }

  if (!slip) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Packing slip not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - Hidden on print */}
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate('/dispatch')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Queue
        </Button>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Packing Slip Content */}
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">PACKING SLIP</h1>
              <p className="text-muted-foreground mt-1">Venezia Kitchen Cabinets & Bath</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Packing Slip #</p>
              <p className="text-xl font-mono font-bold">{slip.slipNumber}</p>
              <p className="text-sm text-muted-foreground mt-2">Invoice #</p>
              <p className="font-mono font-semibold">{slip.invoiceNumber}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{slip.client}</p>
                <p className="text-muted-foreground">{slip.project}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dispatch Information</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dispatch Date:</span>
                  <span className="font-medium">{formatDate(slip.dispatchDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{slip.status}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <h3 className="font-semibold mb-4">Items</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Qty</TableHead>
                  <TableHead className="w-32">Code</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Finish/Color</TableHead>
                  <TableHead>Dimensions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slip.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">{item.qty}</TableCell>
                    <TableCell className="font-mono">{item.code}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.finish}</TableCell>
                    <TableCell className="text-muted-foreground">{item.dimensions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <p>Total Items: {slip.items.reduce((sum, item) => sum + item.qty, 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Prepared by</p>
                <div className="mt-8 border-t border-dashed pt-2">
                  <p className="text-sm">_______________________</p>
                  <p className="text-xs text-muted-foreground mt-1">Signature</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print-specific footer */}
      <div className="hidden print:block text-center text-sm text-muted-foreground mt-8">
        <p>Venezia Kitchen Cabinets & Bath</p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
