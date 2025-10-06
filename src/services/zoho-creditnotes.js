/**
 * Zoho Books Credit Notes API Service
 * Scope: ZohoBooks.creditnotes.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoCreditNotesService {
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

  async listCreditNotes(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/creditnotes?${queryParams}`)
  }

  async getCreditNote(creditNoteId) {
    return this.makeRequest(`/creditnotes/${creditNoteId}`)
  }

  async createCreditNote(creditNoteData) {
    return this.makeRequest('/creditnotes', {
      method: 'POST',
      body: JSON.stringify(creditNoteData)
    })
  }

  async updateCreditNote(creditNoteId, creditNoteData) {
    return this.makeRequest(`/creditnotes/${creditNoteId}`, {
      method: 'PUT',
      body: JSON.stringify(creditNoteData)
    })
  }

  async deleteCreditNote(creditNoteId) {
    return this.makeRequest(`/creditnotes/${creditNoteId}`, {
      method: 'DELETE'
    })
  }

  async emailCreditNote(creditNoteId, emailData = {}) {
    return this.makeRequest(`/creditnotes/${creditNoteId}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  }

  async voidCreditNote(creditNoteId) {
    return this.makeRequest(`/creditnotes/${creditNoteId}/status/void`, {
      method: 'POST'
    })
  }

  async convertToOpen(creditNoteId) {
    return this.makeRequest(`/creditnotes/${creditNoteId}/status/open`, {
      method: 'POST'
    })
  }

  async applyToInvoice(creditNoteId, invoiceData) {
    return this.makeRequest(`/creditnotes/${creditNoteId}/invoices`, {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    })
  }

  async listCreditedInvoices(creditNoteId) {
    return this.makeRequest(`/creditnotes/${creditNoteId}/invoices`)
  }

  async deleteInvoiceCredits(creditNoteId, creditNoteInvoiceId) {
    return this.makeRequest(`/creditnotes/${creditNoteId}/invoices/${creditNoteInvoiceId}`, {
      method: 'DELETE'
    })
  }

  async refundCreditNote(creditNoteId, refundData) {
    return this.makeRequest(`/creditnotes/${creditNoteId}/refunds`, {
      method: 'POST',
      body: JSON.stringify(refundData)
    })
  }
}

export const zohoCreditNotes = new ZohoCreditNotesService()
