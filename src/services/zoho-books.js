/**
 * Zoho Books API Client
 * Complete integration with Zoho Books API
 */

import { zohoAuth } from './zoho-auth'

const API_BASE_URL = import.meta.env.VITE_ZOHO_API_DOMAIN || 'https://books.zoho.com'
const API_VERSION = 'v3'
const ORGANIZATION_ID = import.meta.env.VITE_ZOHO_ORGANIZATION_ID

class ZohoBooksAPI {
  constructor() {
    this.proxyURL = 'http://localhost:3001/api/zoho/books'
    this.organizationId = ORGANIZATION_ID
  }

  /**
   * Make API request through proxy server (avoids CORS)
   */
  async request(method, endpoint, data = null, params = {}) {
    try {
      // Check if authenticated first (silent fail)
      if (!localStorage.getItem('zoho_access_token')) {
        return null
      }
      
      // Get valid access token
      const token = await zohoAuth.getValidAccessToken()

      // Build URL with query params
      const url = new URL(`${this.proxyURL}${endpoint}`)
      url.searchParams.append('organization_id', this.organizationId)
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, value)
        }
      })

      // Make request through proxy
      const options = {
        method,
        headers: {
          'Authorization': `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json'
        }
      }

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(url.toString(), options)

      // Handle token expiration
      if (response.status === 401) {
        await zohoAuth.refreshAccessToken()
        return this.request(method, endpoint, data, params)
      }
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'API request failed')
      }

      // Parse and return the actual response data
      const responseData = await response.json()
      console.log(`✅ Success: ${method} ${endpoint}`)
      return responseData
    } catch (error) {
      // Only log if authenticated (silent fail for unauthenticated)
      if (localStorage.getItem('zoho_access_token')) {
        console.error(`Zoho API Error [${method} ${endpoint}]:`, error)
      }
      return null
    }
  }

  // ==================== ESTIMATES (QUOTES) ====================

  /**
   * Get all estimates
   */
  async getEstimates(params = {}) {
    return this.request('GET', '/estimates', null, params)
  }

  /**
   * Get estimate by ID
   */
  async getEstimate(estimateId) {
    return this.request('GET', `/estimates/${estimateId}`)
  }

  /**
   * Create new estimate
   */
  async createEstimate(data) {
    return this.request('POST', '/estimates', data)
  }

  /**
   * Update estimate
   */
  async updateEstimate(estimateId, data) {
    return this.request('PUT', `/estimates/${estimateId}`, data)
  }

  /**
   * Delete estimate
   */
  async deleteEstimate(estimateId) {
    return this.request('DELETE', `/estimates/${estimateId}`)
  }

  /**
   * Mark estimate as accepted
   */
  async acceptEstimate(estimateId) {
    return this.request('POST', `/estimates/${estimateId}/status/accepted`)
  }

  /**
   * Mark estimate as declined
   */
  async declineEstimate(estimateId) {
    return this.request('POST', `/estimates/${estimateId}/status/declined`)
  }

  /**
   * Convert estimate to invoice
   */
  async convertEstimateToInvoice(estimateId) {
    return this.request('POST', `/estimates/${estimateId}/converttoInvoice`)
  }

  /**
   * Email estimate to customer
   */
  async emailEstimate(estimateId, emailData) {
    return this.request('POST', `/estimates/${estimateId}/email`, emailData)
  }

  // ==================== INVOICES ====================

  /**
   * Get all invoices
   */
  async getInvoices(params = {}) {
    return this.request('GET', '/invoices', null, params)
  }

  /**
   * Get invoice by ID
   */
  async getInvoice(invoiceId) {
    return this.request('GET', `/invoices/${invoiceId}`)
  }

  /**
   * Create new invoice
   */
  async createInvoice(data) {
    return this.request('POST', '/invoices', data)
  }

  /**
   * Update invoice
   */
  async updateInvoice(invoiceId, data) {
    return this.request('PUT', `/invoices/${invoiceId}`, data)
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(invoiceId) {
    return this.request('DELETE', `/invoices/${invoiceId}`)
  }

  /**
   * Mark invoice as sent
   */
  async markInvoiceAsSent(invoiceId) {
    return this.request('POST', `/invoices/${invoiceId}/status/sent`)
  }

  /**
   * Void invoice
   */
  async voidInvoice(invoiceId) {
    return this.request('POST', `/invoices/${invoiceId}/status/void`)
  }

  /**
   * Email invoice
   */
  async emailInvoice(invoiceId, emailData) {
    return this.request('POST', `/invoices/${invoiceId}/email`, emailData)
  }

  // ==================== CUSTOMERS (CONTACTS) ====================

  /**
   * Get all customers
   */
  async getCustomers(params = {}) {
    return this.request('GET', '/contacts', null, params)
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId) {
    return this.request('GET', `/contacts/${customerId}`)
  }

  /**
   * Create new customer
   */
  async createCustomer(data) {
    return this.request('POST', '/contacts', data)
  }

  /**
   * Update customer
   */
  async updateCustomer(customerId, data) {
    return this.request('PUT', `/contacts/${customerId}`, data)
  }

  /**
   * Delete customer
   */
  async deleteCustomer(customerId) {
    return this.request('DELETE', `/contacts/${customerId}`)
  }

  // ==================== ITEMS (PRODUCTS) ====================

  /**
   * Get all items
   */
  async getItems(params = {}) {
    return this.request('GET', '/items', null, params)
  }

  /**
   * Get item by ID
   */
  async getItem(itemId) {
    return this.request('GET', `/items/${itemId}`)
  }

  /**
   * Create new item
   */
  async createItem(data) {
    return this.request('POST', '/items', data)
  }

  /**
   * Update item
   */
  async updateItem(itemId, data) {
    return this.request('PUT', `/items/${itemId}`, data)
  }

  /**
   * Delete item
   */
  async deleteItem(itemId) {
    return this.request('DELETE', `/items/${itemId}`)
  }

  /**
   * Adjust item stock
   */
  async adjustItemStock(itemId, data) {
    return this.request('POST', `/items/${itemId}/adjuststock`, data)
  }

  // ==================== PAYMENTS ====================

  /**
   * Get all customer payments
   */
  async getPayments(params = {}) {
    return this.request('GET', '/customerpayments', null, params)
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId) {
    return this.request('GET', `/customerpayments/${paymentId}`)
  }

  /**
   * Record payment for invoice
   */
  async recordPayment(data) {
    return this.request('POST', '/customerpayments', data)
  }

  /**
   * Update payment
   */
  async updatePayment(paymentId, data) {
    return this.request('PUT', `/customerpayments/${paymentId}`, data)
  }

  /**
   * Delete payment
   */
  async deletePayment(paymentId) {
    return this.request('DELETE', `/customerpayments/${paymentId}`)
  }

  // ==================== TAXES ====================

  /**
   * Get all taxes
   */
  async getTaxes(params = {}) {
    return this.request('GET', '/settings/taxes', null, params)
  }

  /**
   * Get tax by ID
   */
  async getTax(taxId) {
    return this.request('GET', `/settings/taxes/${taxId}`)
  }

  /**
   * Create tax
   */
  async createTax(data) {
    return this.request('POST', '/settings/taxes', data)
  }

  // ==================== ORGANIZATIONS ====================

  /**
   * Get organization details
   */
  async getOrganization() {
    return this.request('GET', '/organizations')
  }

  // ==================== PACKING SLIPS ====================

  /**
   * Get packing slips for invoice
   */
  async getPackingSlips(invoiceId) {
    return this.request('GET', `/invoices/${invoiceId}/packingslips`)
  }

  /**
   * Create packing slip
   */
  async createPackingSlip(invoiceId, data) {
    return this.request('POST', `/invoices/${invoiceId}/packingslips`, data)
  }

  // ==================== REPORTS ====================

  /**
   * Get sales by customer report
   */
  async getSalesByCustomer(params = {}) {
    return this.request('GET', '/reports/salesbycustomer', null, params)
  }

  /**
   * Get sales by item report
   */
  async getSalesByItem(params = {}) {
    return this.request('GET', '/reports/salesbyitem', null, params)
  }

  /**
   * Get profit and loss report
   */
  async getProfitAndLoss(params = {}) {
    return this.request('GET', '/reports/profitandloss', null, params)
  }

  // ==================== HELPER METHODS ====================

  /**
   * Search customers by name
   */
  async searchCustomers(query) {
    return this.getCustomers({ 
      search_text: query,
      sort_column: 'contact_name'
    })
  }

  /**
   * Search items by name or SKU
   */
  async searchItems(query) {
    return this.getItems({ 
      search_text: query,
      sort_column: 'name'
    })
  }

  /**
   * Get customer outstanding balance
   */
  async getCustomerBalance(customerId) {
    const customer = await this.getCustomer(customerId)
    return customer.contact.outstanding_receivable_amount || 0
  }

  /**
   * Check if customer has exceeded credit limit
   */
  async checkCreditLimit(customerId, amount) {
    const customer = await this.getCustomer(customerId)
    const creditLimit = customer.contact.credit_limit || 0
    const outstanding = customer.contact.outstanding_receivable_amount || 0
    const available = creditLimit - outstanding
    
    return {
      creditLimit,
      outstanding,
      available,
      exceeded: (outstanding + amount) > creditLimit
    }
  }
}

// Export singleton instance
export const zohoBooksAPI = new ZohoBooksAPI()
export default zohoBooksAPI
