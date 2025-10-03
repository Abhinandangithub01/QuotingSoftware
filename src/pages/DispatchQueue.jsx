import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Printer, CheckCircle, Eye, Package } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { toast } from 'sonner'

const statusColors = {
  Ready: 'default',
  Released: 'success',
  Pending: 'warning',
}

export function DispatchQueue() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSlips, setSelectedSlips] = useState([])
  const navigate = useNavigate()
  
  // Get invoices from Zoho Books (paid invoices become packing slips)
  const invoices = useStore((state) => state.invoices)
  const fetchInvoices = useStore((state) => state.fetchInvoices)

  useEffect(() => {
    const hasZohoToken = localStorage.getItem('zoho_access_token')
    if (hasZohoToken) {
      fetchInvoices()
    }
  }, [fetchInvoices])
  
  // Convert paid invoices to packing slips
  const slips = invoices
    .filter(inv => inv.status === 'paid')
    .map(inv => ({
      id: inv.id,
      slipNumber: `PS-${inv.invoiceNumber}`,
      invoiceNumber: inv.invoiceNumber,
      client: inv.customer?.name || 'N/A',
      project: inv.projectName || 'N/A',
      dispatchDate: inv.date,
      status: 'Ready'
    }))

  const filteredSlips = slips.filter(slip => {
    const matchesSearch = search === '' || 
      slip.slipNumber.toLowerCase().includes(search.toLowerCase()) ||
      slip.client.toLowerCase().includes(search.toLowerCase()) ||
      slip.project.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || slip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSlips(filteredSlips.map(s => s.id))
    } else {
      setSelectedSlips([])
    }
  }

  const handleSelectSlip = (id, checked) => {
    if (checked) {
      setSelectedSlips([...selectedSlips, id])
    } else {
      setSelectedSlips(selectedSlips.filter(s => s !== id))
    }
  }

  const handleBatchPrint = () => {
    if (selectedSlips.length === 0) {
      toast.error('Please select slips to print')
      return
    }
    toast.success(`Printing ${selectedSlips.length} packing slips...`)
  }

  const handleMarkReleased = () => {
    if (selectedSlips.length === 0) {
      toast.error('Please select slips to release')
      return
    }
    setSlips(slips.map(slip => 
      selectedSlips.includes(slip.id) ? { ...slip, status: 'Released' } : slip
    ))
    setSelectedSlips([])
    toast.success(`${selectedSlips.length} slips marked as released`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatch Queue</h1>
          <p className="text-muted-foreground">Manage packing slips ready for dispatch</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleBatchPrint} 
            variant="outline"
            disabled={selectedSlips.length === 0}
          >
            <Printer className="mr-2 h-4 w-4" />
            Batch Print ({selectedSlips.length})
          </Button>
          <Button 
            onClick={handleMarkReleased}
            disabled={selectedSlips.length === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark Released
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search slips..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Released">Released</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSlips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No packing slips</h3>
              <p className="text-muted-foreground">Packing slips will appear here when invoices are paid</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedSlips.length === filteredSlips.length && filteredSlips.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Slip #</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Dispatch Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlips.map((slip) => (
                    <TableRow key={slip.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSlips.includes(slip.id)}
                          onCheckedChange={(checked) => handleSelectSlip(slip.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="font-mono font-medium">{slip.slipNumber}</TableCell>
                      <TableCell className="font-mono">{slip.invoiceNumber}</TableCell>
                      <TableCell>{slip.client}</TableCell>
                      <TableCell>{slip.project}</TableCell>
                      <TableCell>{formatDate(slip.dispatchDate)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[slip.status]}>{slip.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dispatch/${slip.id}`)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toast.success('Printing packing slip...')}
                            title="Print"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
