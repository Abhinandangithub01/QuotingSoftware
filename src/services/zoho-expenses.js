/**
 * Zoho Books Expenses API Service
 * Scope: ZohoBooks.expenses.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoExpensesService {
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

  async listExpenses(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/expenses?${queryParams}`)
  }

  async getExpense(expenseId) {
    return this.makeRequest(`/expenses/${expenseId}`)
  }

  async createExpense(expenseData) {
    return this.makeRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    })
  }

  async updateExpense(expenseId, expenseData) {
    return this.makeRequest(`/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData)
    })
  }

  async deleteExpense(expenseId) {
    return this.makeRequest(`/expenses/${expenseId}`, {
      method: 'DELETE'
    })
  }

  async markAsBillable(expenseId) {
    return this.makeRequest(`/expenses/${expenseId}/billable`, {
      method: 'POST'
    })
  }

  async markAsNonBillable(expenseId) {
    return this.makeRequest(`/expenses/${expenseId}/nonbillable`, {
      method: 'POST'
    })
  }

  async attachReceipt(expenseId, file) {
    const formData = new FormData()
    formData.append('receipt', file)

    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}/expenses/${expenseId}/receipt`)
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
      throw new Error(error.message || 'Failed to attach receipt')
    }

    return response.json()
  }

  async deleteReceipt(expenseId) {
    return this.makeRequest(`/expenses/${expenseId}/receipt`, {
      method: 'DELETE'
    })
  }

  async addComment(expenseId, commentData) {
    return this.makeRequest(`/expenses/${expenseId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    })
  }

  async listComments(expenseId) {
    return this.makeRequest(`/expenses/${expenseId}/comments`)
  }

  async deleteComment(expenseId, commentId) {
    return this.makeRequest(`/expenses/${expenseId}/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

export const zohoExpenses = new ZohoExpensesService()
