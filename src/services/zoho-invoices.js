/**
 * Zoho Books Invoices API Service
 * Scope: ZohoBooks.invoices.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoInvoicesService {
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
   * List all invoices
   */
  async listInvoices(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/invoices?${queryParams}`)
  }

  /**
   * Get invoice by ID
   */
  async getInvoice(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}`)
  }

  /**
   * Create new invoice
   */
  async createInvoice(invoiceData) {
    return this.makeRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    })
  }

  /**
   * Update invoice
   */
  async updateInvoice(invoiceId, invoiceData) {
    return this.makeRequest(`/invoices/${invoiceId}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData)
    })
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}`, {
      method: 'DELETE'
    })
  }

  /**
   * Mark invoice as sent
   */
  async markAsSent(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/status/sent`, {
      method: 'POST'
    })
  }

  /**
   * Mark invoice as void
   */
  async voidInvoice(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/status/void`, {
      method: 'POST'
    })
  }

  /**
   * Mark invoice as draft
   */
  async markAsDraft(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/status/draft`, {
      method: 'POST'
    })
  }

  /**
   * Email invoice to customer
   */
  async emailInvoice(invoiceId, emailData = {}) {
    return this.makeRequest(`/invoices/${invoiceId}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  }

  /**
   * Get invoice email content
   */
  async getEmailContent(invoiceId, params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/invoices/${invoiceId}/email?${queryParams}`)
  }

  /**
   * Email multiple invoices
   */
  async emailInvoices(invoiceIds) {
    return this.makeRequest('/invoices/email', {
      method: 'POST',
      body: JSON.stringify({ invoice_ids: invoiceIds })
    })
  }

  /**
   * Get invoice PDF
   */
  async getPDF(invoiceId) {
    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}/invoices/${invoiceId}`)
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
   * Bulk export invoices
   */
  async bulkExport(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/invoices/pdf?${queryParams}`)
  }

  /**
   * Print invoices
   */
  async printInvoices(invoiceIds) {
    return this.makeRequest('/invoices/print', {
      method: 'POST',
      body: JSON.stringify({ invoice_ids: invoiceIds })
    })
  }

  /**
   * Disable automated payment reminders
   */
  async disablePaymentReminder(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/paymentreminder/disable`, {
      method: 'POST'
    })
  }

  /**
   * Enable automated payment reminders
   */
  async enablePaymentReminder(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/paymentreminder/enable`, {
      method: 'POST'
    })
  }

  /**
   * Write off invoice
   */
  async writeOff(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/writeoff`, {
      method: 'POST'
    })
  }

  /**
   * Cancel write off
   */
  async cancelWriteOff(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/writeoff/cancel`, {
      method: 'POST'
    })
  }

  /**
   * Update billing address
   */
  async updateBillingAddress(invoiceId, addressData) {
    return this.makeRequest(`/invoices/${invoiceId}/address/billing`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    })
  }

  /**
   * Update shipping address
   */
  async updateShippingAddress(invoiceId, addressData) {
    return this.makeRequest(`/invoices/${invoiceId}/address/shipping`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    })
  }

  /**
   * List invoice templates
   */
  async listTemplates() {
    return this.makeRequest('/invoices/templates')
  }

  /**
   * Apply template to invoice
   */
  async applyTemplate(invoiceId, templateId) {
    return this.makeRequest(`/invoices/${invoiceId}/templates/${templateId}`, {
      method: 'PUT'
    })
  }

  /**
   * Attach file to invoice
   */
  async attachFile(invoiceId, file) {
    const formData = new FormData()
    formData.append('attachment', file)

    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}/invoices/${invoiceId}/attachment`)
    url.searchParams.append('organization_id', organizationId)
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to attach file')
    }

    return response.json()
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/attachment`, {
      method: 'DELETE'
    })
  }

  /**
   * Add comment to invoice
   */
  async addComment(invoiceId, commentData) {
    return this.makeRequest(`/invoices/${invoiceId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    })
  }

  /**
   * List invoice comments
   */
  async listComments(invoiceId) {
    return this.makeRequest(`/invoices/${invoiceId}/comments`)
  }

  /**
   * Delete comment
   */
  async deleteComment(invoiceId, commentId) {
    return this.makeRequest(`/invoices/${invoiceId}/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

export const zohoInvoices = new ZohoInvoicesService()
