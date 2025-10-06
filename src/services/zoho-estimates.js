/**
 * Zoho Books Estimates API Service
 * Scope: ZohoBooks.estimates.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoEstimatesService {
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
   * List all estimates
   */
  async listEstimates(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/estimates?${queryParams}`)
  }

  /**
   * Get estimate by ID
   */
  async getEstimate(estimateId) {
    return this.makeRequest(`/estimates/${estimateId}`)
  }

  /**
   * Create new estimate
   */
  async createEstimate(estimateData) {
    return this.makeRequest('/estimates', {
      method: 'POST',
      body: JSON.stringify(estimateData)
    })
  }

  /**
   * Update estimate
   */
  async updateEstimate(estimateId, estimateData) {
    return this.makeRequest(`/estimates/${estimateId}`, {
      method: 'PUT',
      body: JSON.stringify(estimateData)
    })
  }

  /**
   * Delete estimate
   */
  async deleteEstimate(estimateId) {
    return this.makeRequest(`/estimates/${estimateId}`, {
      method: 'DELETE'
    })
  }

  /**
   * Mark estimate as sent
   */
  async markAsSent(estimateId) {
    return this.makeRequest(`/estimates/${estimateId}/status/sent`, {
      method: 'POST'
    })
  }

  /**
   * Mark estimate as accepted
   */
  async markAsAccepted(estimateId) {
    return this.makeRequest(`/estimates/${estimateId}/status/accepted`, {
      method: 'POST'
    })
  }

  /**
   * Mark estimate as declined
   */
  async markAsDeclined(estimateId) {
    return this.makeRequest(`/estimates/${estimateId}/status/declined`, {
      method: 'POST'
    })
  }

  /**
   * Email estimate to customer
   */
  async emailEstimate(estimateId, emailData = {}) {
    return this.makeRequest(`/estimates/${estimateId}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  }

  /**
   * Get estimate PDF
   */
  async getPDF(estimateId) {
    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}/estimates/${estimateId}`)
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
   * Convert estimate to invoice
   */
  async convertToInvoice(estimateId) {
    return this.makeRequest(`/estimates/${estimateId}/converttoInvoice`, {
      method: 'POST'
    })
  }

  /**
   * Convert estimate to sales order
   */
  async convertToSalesOrder(estimateId) {
    return this.makeRequest(`/estimates/${estimateId}/converttoSalesorder`, {
      method: 'POST'
    })
  }

  /**
   * Update billing address
   */
  async updateBillingAddress(estimateId, addressData) {
    return this.makeRequest(`/estimates/${estimateId}/address/billing`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    })
  }

  /**
   * Update shipping address
   */
  async updateShippingAddress(estimateId, addressData) {
    return this.makeRequest(`/estimates/${estimateId}/address/shipping`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    })
  }

  /**
   * List estimate templates
   */
  async listTemplates() {
    return this.makeRequest('/estimates/templates')
  }

  /**
   * Add comment to estimate
   */
  async addComment(estimateId, commentData) {
    return this.makeRequest(`/estimates/${estimateId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    })
  }

  /**
   * List estimate comments
   */
  async listComments(estimateId) {
    return this.makeRequest(`/estimates/${estimateId}/comments`)
  }

  /**
   * Delete comment
   */
  async deleteComment(estimateId, commentId) {
    return this.makeRequest(`/estimates/${estimateId}/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

export const zohoEstimates = new ZohoEstimatesService()
