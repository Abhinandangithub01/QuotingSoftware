import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search, Filter, FileText } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatCurrency, formatDateTime } from '@/lib/utils'

const statusColors = {
  Draft: 'secondary',
  Sent: 'default',
  Invoiced: 'warning',
  Paid: 'success',
}

export function QuotesList() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const navigate = useNavigate()
  const quotes = useStore((state) => state.quotes)
  const fetchQuotes = useStore((state) => state.fetchQuotes)

  useEffect(() => {
    // Only load quotes if authenticated with Zoho
    const loadQuotes = async () => {
      const hasZohoToken = localStorage.getItem('zoho_access_token')
      
      if (!hasZohoToken) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        await fetchQuotes()
      } catch (error) {
        console.error('Error loading quotes:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadQuotes()
  }, [fetchQuotes])

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = search === '' || 
      quote.quoteNumber?.toLowerCase().includes(search.toLowerCase()) ||
      quote.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      quote.projectName?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground">Manage and track all your quotes</p>
        </div>
        <Button onClick={() => navigate('/quotes/new')} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Quote
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quotes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Invoiced">Invoiced</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Cabinets">Cabinets</SelectItem>
                  <SelectItem value="Quartz">Quartz</SelectItem>
                  <SelectItem value="Flooring">Flooring</SelectItem>
                  <SelectItem value="Faucets">Faucets</SelectItem>
                  <SelectItem value="Sinks">Sinks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!localStorage.getItem('zoho_access_token') ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connect to Zoho Books</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Zoho Books account to view and manage quotes
              </p>
              <Button onClick={() => navigate('/settings')}>
                Go to Settings
              </Button>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first quote</p>
              <Button onClick={() => navigate('/quotes/new')}>
                <Plus className="mr-2 h-4 w-4" />
                New Quote
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow
                      key={quote.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/quotes/${quote.id}`)}
                    >
                      <TableCell className="font-mono font-medium">{quote.quoteNumber}</TableCell>
                      <TableCell>{quote.customer?.name || 'N/A'}</TableCell>
                      <TableCell>{quote.projectName || 'N/A'}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(quote.total)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[quote.status] || 'default'}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(quote.updatedAt || quote.date)}
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
