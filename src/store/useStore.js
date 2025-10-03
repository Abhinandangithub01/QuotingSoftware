import { create } from 'zustand'
import { zohoBooksAPI } from '@/services/zoho-books'
import { toast } from 'sonner'

export const useStore = create((set, get) => ({
  // Theme
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newTheme)
    set({ theme: newTheme })
  },
  
  // User
  user: null,
  setUser: (user) => set({ user }),
  
  // Loading states
  loading: {
    quotes: false,
    customers: false,
    products: false,
    invoices: false,
  },
  setLoading: (key, value) => set((state) => ({
    loading: { ...state.loading, [key]: value }
  })),
  
  // Customers (from Zoho Contacts)
  customers: [],
  setCustomers: (customers) => set({ customers }),
  fetchCustomers: async () => {
    const { setLoading } = get()
    
    // Check if authenticated
    if (!localStorage.getItem('zoho_access_token')) {
      return
    }
    
    try {
      setLoading('customers', true)
      const response = await zohoBooksAPI.getCustomers()
      
      if (!response) {
        toast.error('Unable to connect to Zoho Books. Please check your connection and try again.')
        return
      }
      
      if (!response.contacts) {
        toast.warning('No customers found in your Zoho Books account.')
        return
      }
      
      const customers = response.contacts.map(contact => ({
        id: contact.contact_id,
        name: contact.contact_name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company_name,
        address: {
          street: contact.billing_address?.street || '',
          city: contact.billing_address?.city || '',
          state: contact.billing_address?.state || '',
          zip: contact.billing_address?.zip || '',
        },
        creditLimit: contact.credit_limit || 0,
        balance: contact.outstanding_receivable_amount || 0,
        availableCredit: (contact.credit_limit || 0) - (contact.outstanding_receivable_amount || 0),
        paymentTerms: contact.payment_terms || 'Net 30',
        taxExempt: contact.is_taxable === false,
      }))
      set({ customers })
    } catch (error) {
      console.error('Error fetching customers:', error)
      if (localStorage.getItem('zoho_access_token')) {
        toast.error('Could not load customers. Please reconnect to Zoho Books in Settings.')
      }
    } finally {
      setLoading('customers', false)
    }
  },
  
  // Products (from Zoho Items)
  products: [],
  setProducts: (products) => set({ products }),
  fetchProducts: async () => {
    // Check if authenticated
    if (!localStorage.getItem('zoho_access_token')) {
      return
    }
    
    try {
      set((state) => ({ loading: { ...state.loading, products: true } }))
      const response = await zohoBooksAPI.getItems()
      if (!response || !response.items) {
        set((state) => ({ loading: { ...state.loading, products: false } }))
        return []
      }
      
      const products = response.items.map(item => ({
        id: item.item_id,
        item_id: item.item_id,
        code: item.sku || item.item_id,
        name: item.name,
        description: item.description || '',
        price: parseFloat(item.rate) || 0,
        rate: parseFloat(item.rate) || 0,
        uom: item.unit || 'piece',
        category: item.item_type || 'goods',
        stock: item.stock_on_hand || 0,
        stockOnHand: item.stock_on_hand || 0,
        reserved: item.reserved_stock || 0,
        available: (item.stock_on_hand || 0) - (item.reserved_stock || 0),
        reorderLevel: item.reorder_level || 10,
        taxId: item.tax_id || null,
        taxName: item.tax_name || '',
        taxPercentage: item.tax_percentage || 0,
        image: item.image_url || null,
        isActive: item.status === 'active'
      }))
      set({ products })
      set((state) => ({ loading: { ...state.loading, products: false } }))
      return products
    } catch (error) {
      console.error('Error fetching products:', error)
      if (localStorage.getItem('zoho_access_token')) {
        toast.error('Could not load products. Please reconnect to Zoho Books in Settings.')
      }
      set((state) => ({ loading: { ...state.loading, products: false } }))
      return []
    }
  },
  recentProducts: [],
  addRecentProduct: (product) => set((state) => ({
    recentProducts: [product, ...state.recentProducts.filter(p => p.id !== product.id)].slice(0, 5)
  })),
  
  // Quotes (from Zoho Estimates)
  quotes: [],
  setQuotes: (quotes) => set({ quotes }),
  fetchQuotes: async () => {
    // Check if authenticated
    if (!localStorage.getItem('zoho_access_token')) {
      return
    }
    
    try {
      set((state) => ({ loading: { ...state.loading, quotes: true } }))
      const response = await zohoBooksAPI.getEstimates()
      if (!response || !response.estimates) {
        set((state) => ({ loading: { ...state.loading, quotes: false } }))
        return []
      }
      
      const quotes = response.estimates.map(estimate => ({
        id: estimate.estimate_id,
        estimate_id: estimate.estimate_id,
        quoteNumber: estimate.estimate_number,
        date: estimate.date,
        customer: {
          id: estimate.customer_id,
          name: estimate.customer_name,
          email: estimate.email
        },
        projectName: estimate.reference_number || 'Project',
        status: estimate.status.toLowerCase(),
        items: estimate.line_items.map(item => ({
          id: item.line_item_id,
          product: {
            id: item.item_id,
            code: item.sku,
            name: item.name,
            price: parseFloat(item.rate)
          },
          qty: item.quantity,
          unitPrice: parseFloat(item.rate),
          discount: parseFloat(item.discount_amount) || 0,
          lineTotal: parseFloat(item.item_total)
        })),
        subtotal: parseFloat(estimate.sub_total),
        tax: parseFloat(estimate.tax_total),
        total: parseFloat(estimate.total),
        notes: estimate.notes || '',
        createdAt: estimate.created_time,
        updatedAt: estimate.last_modified_time
      }))
      set({ quotes })
      set((state) => ({ loading: { ...state.loading, quotes: false } }))
      return quotes
    } catch (error) {
      console.error('Error fetching quotes:', error)
      if (localStorage.getItem('zoho_access_token')) {
        toast.error('Failed to load quotes from Zoho Books')
      }
      set((state) => ({ loading: { ...state.loading, quotes: false } }))
      return []
    }
  },
  addQuote: async (quoteData) => {
    try {
      // Create estimate in Zoho Books
      const estimateData = {
        customer_id: quoteData.customer.id || quoteData.customer.contact_id,
        estimate_number: quoteData.quoteNumber,
        reference_number: quoteData.projectName,
        date: quoteData.date || new Date().toISOString().split('T')[0],
        line_items: quoteData.items.map(item => ({
          item_id: item.product.item_id || item.product.id,
          name: item.product.name,
          description: item.product.description || '',
          quantity: item.qty,
          rate: item.unitPrice,
          discount: item.discount || 0
        })),
        notes: quoteData.notes || '',
        terms: quoteData.terms || ''
      }
      
      const response = await zohoBooksAPI.createEstimate(estimateData)
      const newQuote = {
        id: response.estimate.estimate_id,
        estimate_id: response.estimate.estimate_id,
        ...quoteData,
        status: 'draft'
      }
      
      set((state) => ({ quotes: [...state.quotes, newQuote] }))
      toast.success('Quote created in Zoho Books!')
      return newQuote
    } catch (error) {
      console.error('Error creating quote:', error)
      toast.error('Failed to create quote in Zoho Books')
      throw error
    }
  },
  updateQuote: async (id, updates) => {
    try {
      // Update estimate in Zoho Books
      await zohoBooksAPI.updateEstimate(id, updates)
      set((state) => ({
        quotes: state.quotes.map(q => q.id === id ? { ...q, ...updates } : q)
      }))
      toast.success('Quote updated in Zoho Books')
    } catch (error) {
      console.error('Error updating quote:', error)
      toast.error('Failed to update quote in Zoho Books')
      throw error
    }
  },
  convertToInvoice: async (estimateId) => {
    try {
      await zohoBooksAPI.convertEstimateToInvoice(estimateId)
      set((state) => ({
        quotes: state.quotes.map(q => 
          q.estimate_id === estimateId ? { ...q, status: 'invoiced' } : q
        )
      }))
      toast.success('Quote converted to invoice in Zoho Books!')
      // Refresh invoices
      get().fetchInvoices()
    } catch (error) {
      console.error('Error converting to invoice:', error)
      toast.error('Failed to convert quote to invoice')
      throw error
    }
  },
  
  // Invoices (from Zoho Invoices)
  invoices: [],
  setInvoices: (invoices) => set({ invoices }),
  fetchInvoices: async () => {
    // Check if authenticated
    if (!localStorage.getItem('zoho_access_token')) {
      return
    }
    
    try {
      set((state) => ({ loading: { ...state.loading, invoices: true } }))
      const response = await zohoBooksAPI.getInvoices()
      if (!response || !response.invoices) {
        set((state) => ({ loading: { ...state.loading, invoices: false } }))
        return []
      }
      
      const invoices = response.invoices.map(invoice => ({
        id: invoice.invoice_id,
        invoice_id: invoice.invoice_id,
        invoiceNumber: invoice.invoice_number,
        date: invoice.date,
        dueDate: invoice.due_date,
        customer: {
          id: invoice.customer_id,
          name: invoice.customer_name,
          email: invoice.email
        },
        status: invoice.status.toLowerCase(),
        subtotal: parseFloat(invoice.sub_total),
        tax: parseFloat(invoice.tax_total),
        total: parseFloat(invoice.total),
        balance: parseFloat(invoice.balance),
        paid: parseFloat(invoice.total) - parseFloat(invoice.balance),
        items: invoice.line_items || [],
        createdAt: invoice.created_time
      }))
      set({ invoices })
      set((state) => ({ loading: { ...state.loading, invoices: false } }))
      return invoices
    } catch (error) {
      console.error('Error fetching invoices:', error)
      if (localStorage.getItem('zoho_access_token')) {
        toast.error('Failed to load invoices from Zoho Books')
      }
      set((state) => ({ loading: { ...state.loading, invoices: false } }))
      return []
    }
  },
  recordPayment: async (invoiceId, paymentData) => {
    try {
      const payment = {
        customer_id: paymentData.customerId,
        payment_mode: paymentData.paymentMode || 'cash',
        amount: paymentData.amount,
        date: paymentData.date || new Date().toISOString().split('T')[0],
        reference_number: paymentData.referenceNumber || '',
        invoices: [
          {
            invoice_id: invoiceId,
            amount_applied: paymentData.amount
          }
        ]
      }
      
      await zohoBooksAPI.recordPayment(payment)
      toast.success('Payment recorded in Zoho Books!')
      // Refresh invoices
      get().fetchInvoices()
    } catch (error) {
      console.error('Error recording payment:', error)
      if (localStorage.getItem('zoho_access_token')) {
        toast.error('Failed to record payment in Zoho Books')
      }
      throw error
    }
  },
  
  // Taxes (from Zoho Taxes)
  taxes: [],
  setTaxes: (taxes) => set({ taxes }),
  fetchTaxes: async () => {
    // Check if authenticated
    if (!localStorage.getItem('zoho_access_token')) {
      return
    }
    
    try {
      const response = await zohoBooksAPI.getTaxes()
      if (!response) return
      
      const taxes = response.taxes.map(tax => ({
        id: tax.tax_id,
        tax_id: tax.tax_id,
        name: tax.tax_name,
        percentage: parseFloat(tax.tax_percentage),
        type: tax.tax_type
      }))
      set({ taxes })
      return taxes
    } catch (error) {
      console.error('Error fetching taxes:', error)
      if (localStorage.getItem('zoho_access_token')) {
        toast.error('Failed to load taxes from Zoho Books')
      }
      return []
    }
  },
  
  // Sync all data from Zoho Books
  syncWithZoho: async () => {
    if (!localStorage.getItem('zoho_access_token')) {
      toast.error('Not connected to Zoho Books. Please connect in Settings first.')
      return
    }
    
    try {
      toast.info('Syncing with Zoho Books...')
      await Promise.all([
        get().fetchCustomers(),
        get().fetchProducts(),
        get().fetchQuotes(),
        get().fetchInvoices(),
        get().fetchTaxes()
      ])
      
      // Check if data was actually loaded
      const state = get()
      if (state.customers.length === 0 && state.products.length === 0) {
        toast.warning('Sync completed, but no data was loaded. Please check your Zoho Books connection.')
      } else {
        toast.success(`Synced successfully! Loaded ${state.customers.length} customers and ${state.products.length} products.`)
      }
    } catch (error) {
      console.error('Error syncing with Zoho:', error)
      toast.error('Sync failed. Please try disconnecting and reconnecting to Zoho Books.')
    }
  },
  
  // Settings
  settings: {
    dispatchTimeField: 'Dispatch Time',
    customerNameField: 'Customer Name',
    keyboardShortcutsEnabled: true,
  },
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),
}))
