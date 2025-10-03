/**
 * Zoho OAuth 2.0 Authentication Service
 */

import { getConfig } from '@/lib/config'

export class ZohoAuthService {
  constructor() {
    this.accessToken = null
    this.refreshToken = null
    this.tokenExpiry = null
    this.config = null
    this.refreshPromise = null // Prevent multiple simultaneous refresh calls
  }

  /**
   * Validate token value to prevent undefined/null/invalid values
   */
  validateToken(token, tokenType = 'token') {
    if (!token) {
      throw new Error(`${tokenType} is missing`)
    }
    if (typeof token !== 'string') {
      throw new Error(`${tokenType} must be a string, got ${typeof token}`)
    }
    if (token === 'undefined' || token === 'null') {
      throw new Error(`${tokenType} has invalid string value: ${token}`)
    }
    if (token.length < 10) {
      throw new Error(`${tokenType} is too short: ${token.length} characters`)
    }
    return true
  }

  /**
   * Reload tokens from localStorage
   */
  reloadTokens() {
    this.accessToken = localStorage.getItem('zoho_access_token')
    this.refreshToken = localStorage.getItem('zoho_refresh_token')
    this.tokenExpiry = localStorage.getItem('zoho_token_expiry')
    
    console.log('🔄 Tokens reloaded from localStorage:', {
      hasAccess: !!this.accessToken,
      hasRefresh: !!this.refreshToken,
      expiry: this.tokenExpiry
    })
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
      prompt: 'consent',
      state: 'zoho_oauth' // Anti-CSRF token
    })

    console.log('🔐 Authorization URL:', `${ZOHO_AUTH_URL}/auth`)
    return `${ZOHO_AUTH_URL}/auth?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token (via proxy server)
   */
  async getAccessToken(code) {
    try {
      // Use proxy server to avoid CORS issues
      const proxyUrl = import.meta.env.PROD 
        ? '/api/zoho/token'
        : 'http://localhost:3001/api/zoho/token'
      
      const response = await fetch(proxyUrl, {
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
      
      console.log('📦 Received token data:', {
        has_access_token: !!data.access_token,
        has_refresh_token: !!data.refresh_token,
        expires_in: data.expires_in,
        access_token_preview: data.access_token ? data.access_token.substring(0, 20) + '...' : 'MISSING',
        full_response: data
      })
      
      // CRITICAL: Validate tokens exist and are not undefined
      try {
        this.validateToken(data.access_token, 'Access token')
        this.validateToken(data.refresh_token, 'Refresh token')
      } catch (validationError) {
        console.error('❌ CRITICAL: Token validation failed!', validationError.message, data)
        throw new Error(`Token validation failed: ${validationError.message}`)
      }
      
      // Store tokens
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      
      const expiryTime = Date.now() + (data.expires_in * 1000)
      this.tokenExpiry = expiryTime

      // Determine API domain from config (Zoho doesn't return api_domain in token response)
      const config = await this.loadConfig()
      const apiDomain = config.VITE_ZOHO_API_DOMAIN || 'https://www.zohoapis.in'
      
      console.log('💾 Saving to localStorage...', {
        access_token: data.access_token ? 'Present' : 'UNDEFINED',
        refresh_token: data.refresh_token ? 'Present' : 'UNDEFINED',
        api_domain: apiDomain,
        expiry: expiryTime
      })

      // Save tokens and API domain
      localStorage.setItem('zoho_access_token', data.access_token)
      localStorage.setItem('zoho_refresh_token', data.refresh_token)
      localStorage.setItem('zoho_token_expiry', expiryTime.toString())
      localStorage.setItem('zoho_api_domain', apiDomain)
      
      console.log('✅ Tokens saved. Verification:', {
        saved_access: localStorage.getItem('zoho_access_token') ? 'SUCCESS' : 'FAILED',
        saved_refresh: localStorage.getItem('zoho_refresh_token') ? 'SUCCESS' : 'FAILED',
        saved_api_domain: localStorage.getItem('zoho_api_domain')
      })

      return data
    } catch (error) {
      console.error('Error getting access token:', error)
      throw error
    }
  }

  /**
   * Refresh the access token (via proxy server)
   * Prevents multiple simultaneous refresh calls
   */
  async refreshAccessToken() {
    // If already refreshing, wait for that to complete
    if (this.refreshPromise) {
      console.log('⏳ Token refresh already in progress, waiting...')
      return this.refreshPromise
    }

    this.refreshPromise = this._doRefreshToken()
    
    try {
      const result = await this.refreshPromise
      return result
    } finally {
      this.refreshPromise = null
    }
  }

  async _doRefreshToken() {
    try {
      console.log('🔄 Starting token refresh...')
      
      // Reload tokens from localStorage in case they were updated elsewhere
      this.reloadTokens()
      
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      // Use proxy server to avoid CORS issues
      const proxyUrl = import.meta.env.PROD 
        ? '/api/zoho/refresh'
        : 'http://localhost:3001/api/zoho/refresh'
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: this.refreshToken })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Token refresh failed:', error)
        throw new Error(error.error || 'Failed to refresh access token')
      }

      const data = await response.json()
      
      console.log('✅ Token refreshed successfully')
      
      // Validate new access token
      try {
        this.validateToken(data.access_token, 'Refreshed access token')
      } catch (validationError) {
        console.error('❌ CRITICAL: Token validation failed!', validationError.message, data)
        throw new Error(`Token validation failed: ${validationError.message}`)
      }
      
      // Update access token
      this.accessToken = data.access_token
      const expiryTime = Date.now() + (data.expires_in * 1000)
      this.tokenExpiry = expiryTime

      localStorage.setItem('zoho_access_token', data.access_token)
      localStorage.setItem('zoho_token_expiry', expiryTime.toString())
      
      console.log('✅ Token refresh saved:', {
        access_token_preview: data.access_token.substring(0, 20) + '...',
        expiry: new Date(expiryTime).toISOString()
      })

      return data
    } catch (error) {
      console.error('❌ Error refreshing access token:', error)
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
    this.reloadTokens()
    
    if (!this.accessToken) {
      console.error('❌ No access token in localStorage')
      throw new Error('No access token available. Please authenticate.')
    }

    // Validate token format and value
    try {
      this.validateToken(this.accessToken, 'Access token')
    } catch (validationError) {
      console.error('❌ Token validation failed:', validationError.message)
      console.error('❌ Invalid token in localStorage:', this.accessToken?.substring(0, 20))
      this.clearTokens()
      throw new Error(`Invalid access token: ${validationError.message}. Please re-authenticate.`)
    }

    // Additional Zoho-specific validation (tokens should start with "1000.")
    if (!this.accessToken.startsWith('1000.')) {
      console.error('❌ Invalid Zoho token format:', this.accessToken.substring(0, 20))
      this.clearTokens()
      throw new Error('Invalid Zoho access token format. Please re-authenticate.')
    }

    // Check if token is expired or will expire in next 5 minutes
    if (this.isTokenExpired() || this.isTokenExpiringSoon()) {
      console.log('🔄 Token expired or expiring soon, refreshing...')
      await this.refreshAccessToken()
    }

    console.log('✅ Valid token available:', this.accessToken.substring(0, 30) + '...')
    return this.accessToken
  }

  /**
   * Check if token will expire in next 5 minutes
   */
  isTokenExpiringSoon() {
    if (!this.tokenExpiry) return false
    const fiveMinutes = 5 * 60 * 1000
    return Date.now() >= (parseInt(this.tokenExpiry) - fiveMinutes)
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
