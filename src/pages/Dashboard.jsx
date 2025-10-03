import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { formatCurrency } from '@/lib/utils'
import { 
  DollarSign, 
  FileText, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const quotes = useStore((state) => state.quotes)
  const invoices = useStore((state) => state.invoices)
  const customers = useStore((state) => state.customers)
  const products = useStore((state) => state.products)
  const syncWithZoho = useStore((state) => state.syncWithZoho)
  const loading = useStore((state) => state.loading)

  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingQuotes: 0,
    activeInvoices: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    revenueChange: 0,
    quotesThisMonth: 0,
    invoicesThisMonth: 0
  })

  useEffect(() => {
    calculateStats()
  }, [quotes, invoices, customers, products])

  const calculateStats = () => {
    // Total Revenue (from paid invoices)
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0)

    // Pending Quotes
    const pendingQuotes = quotes.filter(q => q.status === 'draft' || q.status === 'sent').length

    // Active Invoices (unpaid)
    const activeInvoices = invoices.filter(inv => inv.status !== 'paid').length

    // Low Stock Products
    const lowStockProducts = products.filter(p => p.stock <= p.reorderLevel).length

    // This Month Stats
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    const quotesThisMonth = quotes.filter(q => {
      const date = new Date(q.date)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    }).length

    const invoicesThisMonth = invoices.filter(inv => {
      const date = new Date(inv.date)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    }).length

    // Revenue change (mock calculation - compare to last month)
    const revenueChange = 12.5 // Mock percentage

    setStats({
      totalRevenue,
      pendingQuotes,
      activeInvoices,
      totalCustomers: customers.length,
      lowStockProducts,
      revenueChange,
      quotesThisMonth,
      invoicesThisMonth
    })
  }

  const handleRefresh = () => {
    syncWithZoho()
  }

  // Recent Quotes
  const recentQuotes = quotes.slice(0, 5)

  // Recent Invoices
  const recentInvoices = invoices.slice(0, 5)

  // Top Customers by Revenue
  const topCustomers = customers && customers.length > 0
    ? customers
        .map(customer => {
          const customerInvoices = invoices.filter(inv => inv.customer?.id === customer.id)
          const revenue = customerInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
          return { ...customer, revenue }
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <Button onClick={handleRefresh} disabled={loading.quotes || loading.invoices}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading.quotes || loading.invoices ? 'animate-spin' : ''}`} />
          Sync with Zoho
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {stats.revenueChange >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{stats.revenueChange}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">{stats.revenueChange}%</span>
                </>
              )}
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>

        {/* Pending Quotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.quotesThisMonth} created this month
            </p>
          </CardContent>
        </Card>

        {/* Active Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Invoices</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.invoicesThisMonth} created this month
            </p>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {topCustomers.length} active this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertCircle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? 's are' : ' is'} running low on stock. 
              <Link to="/inventory" className="ml-1 underline font-medium">View inventory</Link>
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Quotes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Quotes</CardTitle>
                <CardDescription>Latest quote activity</CardDescription>
              </div>
              <Link to="/quotes">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No quotes yet. Create your first quote!
                </p>
              ) : (
                recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {quote.status === 'accepted' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {quote.status === 'declined' && <XCircle className="h-4 w-4 text-red-500" />}
                      {(quote.status === 'draft' || quote.status === 'sent') && <Clock className="h-4 w-4 text-orange-500" />}
                      <div>
                        <p className="text-sm font-medium">{quote.quoteNumber}</p>
                        <p className="text-xs text-muted-foreground">{quote.customer.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(quote.total)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{quote.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Latest invoice activity</CardDescription>
              </div>
              <Link to="/invoices">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No invoices yet.
                </p>
              ) : (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {invoice.status === 'paid' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {invoice.status === 'overdue' && <XCircle className="h-4 w-4 text-red-500" />}
                      {invoice.status === 'sent' && <Clock className="h-4 w-4 text-orange-500" />}
                      <div>
                        <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">{invoice.customer.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(invoice.total)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{invoice.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>By total revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No customer data yet.
                </p>
              ) : (
                topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{formatCurrency(customer.revenue)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>Products need reordering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.lowStockProducts === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All products are well stocked! ✅
                </p>
              ) : (
                products
                  .filter(p => p.stock <= p.reorderLevel)
                  .slice(0, 5)
                  .map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">{product.stock} left</p>
                        <p className="text-xs text-muted-foreground">Reorder: {product.reorderLevel}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
