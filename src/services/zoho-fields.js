/**
 * Zoho Books Field Mapping Service
 * Fetches field definitions from Zoho Books API
 */

import { zohoAuth } from './zoho-auth'

class ZohoFieldsService {
  constructor() {
    this.baseURL = '/api/zoho/books'
    this.cachedFields = {}
  }

  getOrganizationId() {
    return localStorage.getItem('zoho_organization_id')
  }

  async makeRequest(endpoint) {
    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}${endpoint}`)
    url.searchParams.append('organization_id', organizationId)
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch fields')
    }

    return response.json()
  }

  async getContactFields() {
    if (this.cachedFields.contacts) return this.cachedFields.contacts
    const data = await this.makeRequest('/contacts/fields')
    this.cachedFields.contacts = data
    return data
  }

  async getInvoiceFields() {
    if (this.cachedFields.invoices) return this.cachedFields.invoices
    const data = await this.makeRequest('/invoices/fields')
    this.cachedFields.invoices = data
    return data
  }

  async getEstimateFields() {
    if (this.cachedFields.estimates) return this.cachedFields.estimates
    const data = await this.makeRequest('/estimates/fields')
    this.cachedFields.estimates = data
    return data
  }

  async getItemFields() {
    if (this.cachedFields.items) return this.cachedFields.items
    const data = await this.makeRequest('/items/fields')
    this.cachedFields.items = data
    return data
  }

  async getSalesOrderFields() {
    if (this.cachedFields.salesorders) return this.cachedFields.salesorders
    const data = await this.makeRequest('/salesorders/fields')
    this.cachedFields.salesorders = data
    return data
  }

  async getPurchaseOrderFields() {
    if (this.cachedFields.purchaseorders) return this.cachedFields.purchaseorders
    const data = await this.makeRequest('/purchaseorders/fields')
    this.cachedFields.purchaseorders = data
    return data
  }

  async getBillFields() {
    if (this.cachedFields.bills) return this.cachedFields.bills
    const data = await this.makeRequest('/bills/fields')
    this.cachedFields.bills = data
    return data
  }

  async getExpenseFields() {
    if (this.cachedFields.expenses) return this.cachedFields.expenses
    const data = await this.makeRequest('/expenses/fields')
    this.cachedFields.expenses = data
    return data
  }

  async getProjectFields() {
    if (this.cachedFields.projects) return this.cachedFields.projects
    const data = await this.makeRequest('/projects/fields')
    this.cachedFields.projects = data
    return data
  }

  clearCache() {
    this.cachedFields = {}
  }
}

export const zohoFields = new ZohoFieldsService()
