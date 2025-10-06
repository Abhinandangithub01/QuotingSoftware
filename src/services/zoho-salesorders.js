/**
 * Zoho Books Sales Orders API Service
 * Scope: ZohoBooks.salesorders.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoSalesOrdersService {
  constructor() {
    this.baseURL = '/api/zoho/books'
  }

  getOrganizationId() {
    return localStorage.getItem('zoho_organization_id')
  }

  async makeRequest(endpoint, options = {}) {
    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}${endpoint}`)
    url.searchParams.append('organization_id', organizationId)
    
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  /**
   * List all sales orders
   */
  async listSalesOrders(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/salesorders?${queryParams}`)
  }

  /**
   * Get sales order by ID
   */
  async getSalesOrder(salesOrderId) {
    return this.makeRequest(`/salesorders/${salesOrderId}`)
  }

  /**
   * Create new sales order
   */
  async createSalesOrder(salesOrderData) {
    return this.makeRequest('/salesorders', {
      method: 'POST',
      body: JSON.stringify(salesOrderData)
    })
  }

  /**
   * Update sales order
   */
  async updateSalesOrder(salesOrderId, salesOrderData) {
    return this.makeRequest(`/salesorders/${salesOrderId}`, {
      method: 'PUT',
      body: JSON.stringify(salesOrderData)
    })
  }

  /**
   * Delete sales order
   */
  async deleteSalesOrder(salesOrderId) {
    return this.makeRequest(`/salesorders/${salesOrderId}`, {
      method: 'DELETE'
    })
  }

  /**
   * Mark sales order as open
   */
  async markAsOpen(salesOrderId) {
    return this.makeRequest(`/salesorders/${salesOrderId}/status/open`, {
      method: 'POST'
    })
  }

  /**
   * Mark sales order as void
   */
  async markAsVoid(salesOrderId) {
    return this.makeRequest(`/salesorders/${salesOrderId}/status/void`, {
      method: 'POST'
    })
  }

  /**
   * Email sales order to customer
   */
  async emailSalesOrder(salesOrderId, emailData = {}) {
    return this.makeRequest(`/salesorders/${salesOrderId}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  }

  /**
   * Get sales order PDF
   */
  async getPDF(salesOrderId) {
    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}/salesorders/${salesOrderId}`)
    url.searchParams.append('organization_id', organizationId)
    url.searchParams.append('accept', 'pdf')
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get PDF')
    }

    return response.blob()
  }

  /**
   * Convert sales order to invoice
   */
  async convertToInvoice(salesOrderId) {
    return this.makeRequest(`/salesorders/${salesOrderId}/converttoInvoice`, {
      method: 'POST'
    })
  }

  /**
   * Update billing address
   */
  async updateBillingAddress(salesOrderId, addressData) {
    return this.makeRequest(`/salesorders/${salesOrderId}/address/billing`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    })
  }

  /**
   * Update shipping address
   */
  async updateShippingAddress(salesOrderId, addressData) {
    return this.makeRequest(`/salesorders/${salesOrderId}/address/shipping`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    })
  }

  /**
   * List sales order templates
   */
  async listTemplates() {
    return this.makeRequest('/salesorders/templates')
  }

  /**
   * Add comment to sales order
   */
  async addComment(salesOrderId, commentData) {
    return this.makeRequest(`/salesorders/${salesOrderId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    })
  }

  /**
   * List sales order comments
   */
  async listComments(salesOrderId) {
    return this.makeRequest(`/salesorders/${salesOrderId}/comments`)
  }

  /**
   * Delete comment
   */
  async deleteComment(salesOrderId, commentId) {
    return this.makeRequest(`/salesorders/${salesOrderId}/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

export const zohoSalesOrders = new ZohoSalesOrdersService()
