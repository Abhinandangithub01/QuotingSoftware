/**
 * Zoho Books Customer Payments API Service
 * Scope: ZohoBooks.customerpayments.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoPaymentsService {
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

  // Customer Payments
  async listCustomerPayments(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/customerpayments?${queryParams}`)
  }

  async getCustomerPayment(paymentId) {
    return this.makeRequest(`/customerpayments/${paymentId}`)
  }

  async createCustomerPayment(paymentData) {
    return this.makeRequest('/customerpayments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })
  }

  async updateCustomerPayment(paymentId, paymentData) {
    return this.makeRequest(`/customerpayments/${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData)
    })
  }

  async deleteCustomerPayment(paymentId) {
    return this.makeRequest(`/customerpayments/${paymentId}`, {
      method: 'DELETE'
    })
  }

  async refundPayment(paymentId, refundData) {
    return this.makeRequest(`/customerpayments/${paymentId}/refunds`, {
      method: 'POST',
      body: JSON.stringify(refundData)
    })
  }

  async listRefunds(paymentId) {
    return this.makeRequest(`/customerpayments/${paymentId}/refunds`)
  }

  async getRefund(paymentId, refundId) {
    return this.makeRequest(`/customerpayments/${paymentId}/refunds/${refundId}`)
  }

  async deleteRefund(paymentId, refundId) {
    return this.makeRequest(`/customerpayments/${paymentId}/refunds/${refundId}`, {
      method: 'DELETE'
    })
  }
}

export const zohoPayments = new ZohoPaymentsService()
