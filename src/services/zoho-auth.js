/**
 * Zoho OAuth 2.0 Authentication Service
 */

import { getConfig } from '@/lib/config'

export class ZohoAuthService {
  constructor() {
    this.accessToken = localStorage.getItem('zoho_access_token')
    this.refreshToken = localStorage.getItem('zoho_refresh_token')
    this.tokenExpiry = localStorage.getItem('zoho_token_expiry')
    this.config = null
  }

  async loadConfig() {
    if (!this.config) {
      this.config = await getConfig()
    }
    return this.config
  }

  getAuthUrl(apiDomain) {
    return apiDomain?.includes('zoho.in')
      ? 'https://accounts.zoho.in/oauth/v2'
      : 'https://accounts.zoho.com/oauth/v2'
  }

  /**
   * Get authorization URL for OAuth flow
   */
  async getAuthorizationUrl() {
    const config = await this.loadConfig()
    const ZOHO_AUTH_URL = this.getAuthUrl(config.VITE_ZOHO_API_DOMAIN)

    const params = new URLSearchParams({
      scope: 'ZohoBooks.fullaccess.all',
      client_id: config.VITE_ZOHO_CLIENT_ID,
      response_type: 'code',
      redirect_uri: config.VITE_ZOHO_REDIRECT_URI,
      access_type: 'offline',
      prompt: 'consent'
    })

    return `${ZOHO_AUTH_URL}/auth?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token (via proxy server)
   */
  async getAccessToken(code) {
    try {
      // Use proxy server to avoid CORS issues
      const response = await fetch('http://localhost:3001/api/zoho/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get access token')
      }

      const data = await response.json()
      
      // Store tokens
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      
      const expiryTime = Date.now() + (data.expires_in * 1000)
      this.tokenExpiry = expiryTime

      localStorage.setItem('zoho_access_token', data.access_token)
      localStorage.setItem('zoho_refresh_token', data.refresh_token)
      localStorage.setItem('zoho_token_expiry', expiryTime.toString())

      return data
    } catch (error) {
      console.error('Error getting access token:', error)
      throw error
    }
  }

  /**
   * Refresh the access token (via proxy server)
   */
  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      // Use proxy server to avoid CORS issues
      const response = await fetch('http://localhost:3001/api/zoho/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: this.refreshToken })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to refresh access token')
      }

      const data = await response.json()
      
      // Update access token
      this.accessToken = data.access_token
      const expiryTime = Date.now() + (data.expires_in * 1000)
      this.tokenExpiry = expiryTime

      localStorage.setItem('zoho_access_token', data.access_token)
      localStorage.setItem('zoho_token_expiry', expiryTime.toString())

      return data
    } catch (error) {
      console.error('Error refreshing access token:', error)
      // Clear tokens on refresh failure
      this.clearTokens()
      throw error
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    if (!this.tokenExpiry) return true
    return Date.now() >= parseInt(this.tokenExpiry)
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken() {
    // Always reload from localStorage in case it was updated
    this.accessToken = localStorage.getItem('zoho_access_token')
    this.refreshToken = localStorage.getItem('zoho_refresh_token')
    this.tokenExpiry = localStorage.getItem('zoho_token_expiry')
    
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate.')
    }

    if (this.isTokenExpired()) {
      await this.refreshAccessToken()
    }

    return this.accessToken
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.accessToken && !!this.refreshToken
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    this.tokenExpiry = null

    localStorage.removeItem('zoho_access_token')
    localStorage.removeItem('zoho_refresh_token')
    localStorage.removeItem('zoho_token_expiry')
  }

  /**
   * Revoke access token
   */
  async revokeToken() {
    try {
      if (!this.accessToken) return

      await fetch(`${ZOHO_AUTH_URL}/token/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `token=${this.accessToken}`
      })

      this.clearTokens()
    } catch (error) {
      console.error('Error revoking token:', error)
      this.clearTokens()
    }
  }
}

// Export singleton instance
export const zohoAuth = new ZohoAuthService()
