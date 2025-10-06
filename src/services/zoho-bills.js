/**
 * Zoho Books Bills API Service
 * Scope: ZohoBooks.bills.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoBillsService {
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

  async listBills(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/bills?${queryParams}`)
  }

  async getBill(billId) {
    return this.makeRequest(`/bills/${billId}`)
  }

  async createBill(billData) {
    return this.makeRequest('/bills', {
      method: 'POST',
      body: JSON.stringify(billData)
    })
  }

  async updateBill(billId, billData) {
    return this.makeRequest(`/bills/${billId}`, {
      method: 'PUT',
      body: JSON.stringify(billData)
    })
  }

  async deleteBill(billId) {
    return this.makeRequest(`/bills/${billId}`, {
      method: 'DELETE'
    })
  }

  async voidBill(billId) {
    return this.makeRequest(`/bills/${billId}/status/void`, {
      method: 'POST'
    })
  }

  async markAsOpen(billId) {
    return this.makeRequest(`/bills/${billId}/status/open`, {
      method: 'POST'
    })
  }

  async updateBillingAddress(billId, addressData) {
    return this.makeRequest(`/bills/${billId}/address/billing`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    })
  }

  async listPayments(billId) {
    return this.makeRequest(`/bills/${billId}/payments`)
  }

  async applyCredits(billId, creditData) {
    return this.makeRequest(`/bills/${billId}/credits`, {
      method: 'POST',
      body: JSON.stringify(creditData)
    })
  }

  async deletePayment(billId, billPaymentId) {
    return this.makeRequest(`/bills/${billId}/payments/${billPaymentId}`, {
      method: 'DELETE'
    })
  }

  async attachFile(billId, file) {
    const formData = new FormData()
    formData.append('attachment', file)

    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}/bills/${billId}/attachment`)
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

  async deleteAttachment(billId) {
    return this.makeRequest(`/bills/${billId}/attachment`, {
      method: 'DELETE'
    })
  }

  async addComment(billId, commentData) {
    return this.makeRequest(`/bills/${billId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    })
  }

  async listComments(billId) {
    return this.makeRequest(`/bills/${billId}/comments`)
  }

  async deleteComment(billId, commentId) {
    return this.makeRequest(`/bills/${billId}/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

export const zohoBills = new ZohoBillsService()
