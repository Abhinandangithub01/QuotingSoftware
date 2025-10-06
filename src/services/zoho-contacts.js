/**
 * Zoho Books Contacts API Service
 * Scope: ZohoBooks.contacts.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoContactsService {
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
   * List all contacts
   */
  async listContacts(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/contacts?${queryParams}`)
  }

  /**
   * Get contact by ID
   */
  async getContact(contactId) {
    return this.makeRequest(`/contacts/${contactId}`)
  }

  /**
   * Create new contact
   */
  async createContact(contactData) {
    return this.makeRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData)
    })
  }

  /**
   * Update contact
   */
  async updateContact(contactId, contactData) {
    return this.makeRequest(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(contactData)
    })
  }

  /**
   * Delete contact
   */
  async deleteContact(contactId) {
    return this.makeRequest(`/contacts/${contactId}`, {
      method: 'DELETE'
    })
  }

  /**
   * Mark contact as active
   */
  async activateContact(contactId) {
    return this.makeRequest(`/contacts/${contactId}/active`, {
      method: 'POST'
    })
  }

  /**
   * Mark contact as inactive
   */
  async deactivateContact(contactId) {
    return this.makeRequest(`/contacts/${contactId}/inactive`, {
      method: 'POST'
    })
  }

  /**
   * Enable payment reminders for contact
   */
  async enablePaymentReminders(contactId) {
    return this.makeRequest(`/contacts/${contactId}/paymentreminder/enable`, {
      method: 'POST'
    })
  }

  /**
   * Disable payment reminders for contact
   */
  async disablePaymentReminders(contactId) {
    return this.makeRequest(`/contacts/${contactId}/paymentreminder/disable`, {
      method: 'POST'
    })
  }

  /**
   * Email a statement to contact
   */
  async emailStatement(contactId, statementData) {
    return this.makeRequest(`/contacts/${contactId}/statements/email`, {
      method: 'POST',
      body: JSON.stringify(statementData)
    })
  }

  /**
   * Get contact statement
   */
  async getContactStatement(contactId, params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/contacts/${contactId}/statements?${queryParams}`)
  }

  /**
   * Email contact to contact
   */
  async emailContact(contactId) {
    return this.makeRequest(`/contacts/${contactId}/email`, {
      method: 'POST'
    })
  }

  /**
   * List contact persons for a contact
   */
  async listContactPersons(contactId) {
    return this.makeRequest(`/contacts/${contactId}/contactpersons`)
  }

  /**
   * Get address list for contact
   */
  async getAddresses(contactId) {
    return this.makeRequest(`/contacts/${contactId}/address`)
  }

  /**
   * List refund history of contact
   */
  async getRefundHistory(contactId) {
    return this.makeRequest(`/contacts/${contactId}/refunds`)
  }

  /**
   * Track contact in 1099
   */
  async track1099(contactId) {
    return this.makeRequest(`/contacts/${contactId}/track1099`, {
      method: 'POST'
    })
  }

  /**
   * Untrack contact in 1099
   */
  async untrack1099(contactId) {
    return this.makeRequest(`/contacts/${contactId}/untrack1099`, {
      method: 'POST'
    })
  }
}

export const zohoContacts = new ZohoContactsService()
