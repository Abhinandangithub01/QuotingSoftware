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
    this.tokenRefreshBuffer = 5 * 60 * 1000 // Refresh 5 minutes before expiry (as per Zoho best practices)
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
    
    // Tokens reloaded silently
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

    return `${ZOHO_AUTH_URL}/auth?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token (via proxy server)
   */
  async getAccessToken(code) {
    try {
      const config = await this.loadConfig()
      
      // Use proxy server to avoid CORS issues
      const proxyUrl = import.meta.env.PROD 
        ? '/api/zoho/token'
        : 'http://localhost:3001/api/zoho/token'
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code,
          redirect_uri: config.VITE_ZOHO_REDIRECT_URI 
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Token exchange failed:', error)
        
        // Provide more helpful error messages
        if (error.error === 'invalid_client') {
          throw new Error('Invalid client credentials. Please verify Client ID and Secret in Railway environment variables match your Zoho API Console.')
        } else if (error.error === 'redirect_uri_mismatch') {
          throw new Error('Redirect URI mismatch. Please ensure the redirect URI in Railway matches exactly with Zoho API Console.')
        } else if (error.error === 'invalid_code') {
          throw new Error('Authorization code is invalid or expired. Please try connecting again.')
        }
        
        throw new Error(error.message || error.error || 'Failed to get access token')
      }

      const data = await response.json()
      
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
      
      // Calculate expiry time (Zoho tokens expire in 1 hour = 3600 seconds)
      // As per Zoho docs: expires_in is in seconds
      const expiresInMs = (data.expires_in || 3600) * 1000
      const expiryTime = Date.now() + expiresInMs
      this.tokenExpiry = expiryTime

      // Determine API domain from config (Zoho doesn't return api_domain in token response)
      // config is already loaded at the beginning of this function
      const apiDomain = data.api_domain || config.VITE_ZOHO_API_DOMAIN || 'https://www.zohoapis.in'

      // Save tokens and metadata to localStorage
      // As per Zoho best practices: store all token metadata
      localStorage.setItem('zoho_access_token', data.access_token)
      localStorage.setItem('zoho_refresh_token', data.refresh_token)
      localStorage.setItem('zoho_token_expiry', expiryTime.toString())
      localStorage.setItem('zoho_api_domain', apiDomain)
      localStorage.setItem('zoho_token_type', data.token_type || 'Bearer')
      localStorage.setItem('zoho_token_created_at', Date.now().toString())

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
      
      // Validate new access token
      try {
        this.validateToken(data.access_token, 'Refreshed access token')
      } catch (validationError) {
        console.error('❌ CRITICAL: Token validation failed!', validationError.message, data)
        throw new Error(`Token validation failed: ${validationError.message}`)
      }
      
      // Update access token
      this.accessToken = data.access_token
      const expiresInMs = (data.expires_in || 3600) * 1000
      const expiryTime = Date.now() + expiresInMs
      this.tokenExpiry = expiryTime

      // Update localStorage with new token and metadata
      localStorage.setItem('zoho_access_token', data.access_token)
      localStorage.setItem('zoho_token_expiry', expiryTime.toString())
      localStorage.setItem('zoho_token_created_at', Date.now().toString())

      return data
    } catch (error) {
      console.error('❌ Error refreshing access token:', error)
      // Clear tokens on refresh failure
      this.clearTokens()
      throw error
    }
  }

  /**
   * Check if token is expired or will expire soon
   * As per Zoho best practices: refresh before actual expiry
   */
  isTokenExpired() {
    if (!this.tokenExpiry) return true
    return Date.now() >= parseInt(this.tokenExpiry)
  }

  /**
   * Check if token needs refresh (expires within 5 minutes)
   * As per Zoho docs: proactively refresh tokens before expiry
   */
  needsRefresh() {
    if (!this.tokenExpiry) return true
    const timeUntilExpiry = parseInt(this.tokenExpiry) - Date.now()
    return timeUntilExpiry <= this.tokenRefreshBuffer
  }

  /**
   * Get valid access token (refresh if needed)
   * Implements Zoho's recommended token refresh strategy
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

    // Check if token needs refresh (Zoho best practice: refresh proactively)
    if (this.needsRefresh()) {
      try {
        await this.refreshAccessToken()
        // Reload after refresh
        this.reloadTokens()
      } catch (refreshError) {
        console.error('❌ Failed to refresh token:', refreshError)
        // If refresh fails and token is actually expired, throw error
        if (this.isTokenExpired()) {
          this.clearTokens()
          throw new Error('Token expired and refresh failed. Please re-authenticate.')
        }
        // If not expired yet, continue with current token
        console.warn('⚠️ Refresh failed but token still valid, continuing...')
      }
    }

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
