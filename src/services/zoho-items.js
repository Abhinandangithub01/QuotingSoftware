/**
 * Zoho Books Items API Service
 * Manages products/services (items) in Zoho Books
 */

import { zohoAuth } from './zoho-auth'

class ZohoItemsService {
  constructor() {
    this.baseURL = '/api/zoho/books'
  }

  /**
   * Get organization ID from localStorage
   */
  getOrganizationId() {
    const orgId = localStorage.getItem('zoho_organization_id')
    if (!orgId) {
      throw new Error('Organization ID not found. Please reconnect to Zoho Books.')
    }
    return orgId
  }

  /**
   * Make authenticated request to Zoho Books API
   */
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
   * List all items
   */
  async listItems(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/items?${queryParams}`)
  }

  /**
   * Get item by ID
   */
  async getItem(itemId) {
    return this.makeRequest(`/items/${itemId}`)
  }

  /**
   * Create new item
   */
  async createItem(itemData) {
    return this.makeRequest('/items', {
      method: 'POST',
      body: JSON.stringify(itemData)
    })
  }

  /**
   * Update item
   */
  async updateItem(itemId, itemData) {
    return this.makeRequest(`/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    })
  }

  /**
   * Delete item
   */
  async deleteItem(itemId) {
    return this.makeRequest(`/items/${itemId}`, {
      method: 'DELETE'
    })
  }

  /**
   * Mark item as active
   */
  async activateItem(itemId) {
    return this.makeRequest(`/items/${itemId}/active`, {
      method: 'POST'
    })
  }

  /**
   * Mark item as inactive
   */
  async deactivateItem(itemId) {
    return this.makeRequest(`/items/${itemId}/inactive`, {
      method: 'POST'
    })
  }
}

export const zohoItems = new ZohoItemsService()
