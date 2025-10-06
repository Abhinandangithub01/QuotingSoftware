/**
 * Zoho Books Purchase Orders API Service
 * Scope: ZohoBooks.purchaseorders.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoPurchaseOrdersService {
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

  async listPurchaseOrders(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/purchaseorders?${queryParams}`)
  }

  async getPurchaseOrder(purchaseOrderId) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}`)
  }

  async createPurchaseOrder(purchaseOrderData) {
    return this.makeRequest('/purchaseorders', {
      method: 'POST',
      body: JSON.stringify(purchaseOrderData)
    })
  }

  async updatePurchaseOrder(purchaseOrderId, purchaseOrderData) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}`, {
      method: 'PUT',
      body: JSON.stringify(purchaseOrderData)
    })
  }

  async deletePurchaseOrder(purchaseOrderId) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}`, {
      method: 'DELETE'
    })
  }

  async markAsOpen(purchaseOrderId) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/status/open`, {
      method: 'POST'
    })
  }

  async markAsBilled(purchaseOrderId) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/status/billed`, {
      method: 'POST'
    })
  }

  async markAsCancelled(purchaseOrderId) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/status/cancelled`, {
      method: 'POST'
    })
  }

  async emailPurchaseOrder(purchaseOrderId, emailData = {}) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  }

  async getPDF(purchaseOrderId) {
    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}/purchaseorders/${purchaseOrderId}`)
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

  async convertToBill(purchaseOrderId) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/converttobill`, {
      method: 'POST'
    })
  }

  async updateBillingAddress(purchaseOrderId, addressData) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/address/billing`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    })
  }

  async listTemplates() {
    return this.makeRequest('/purchaseorders/templates')
  }

  async attachFile(purchaseOrderId, file) {
    const formData = new FormData()
    formData.append('attachment', file)

    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}/purchaseorders/${purchaseOrderId}/attachment`)
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

  async addComment(purchaseOrderId, commentData) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    })
  }

  async listComments(purchaseOrderId) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/comments`)
  }

  async deleteComment(purchaseOrderId, commentId) {
    return this.makeRequest(`/purchaseorders/${purchaseOrderId}/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

export const zohoPurchaseOrders = new ZohoPurchaseOrdersService()
