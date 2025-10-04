/**
 * Simple Express server to handle Zoho OAuth token exchange
 * This is needed because Zoho OAuth doesn't support CORS for token exchange
 */

import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Enable CORS for frontend (both local and production)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://quotingsoftware-production.up.railway.app'
  ],
  credentials: true
}))

app.use(express.json())

// Serve static files from dist folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
}

// API endpoint to provide config to frontend
app.get('/api/config', (req, res) => {
  res.json({
    VITE_ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID,
    VITE_ZOHO_REDIRECT_URI: process.env.ZOHO_REDIRECT_URI,
    VITE_ZOHO_ORGANIZATION_ID: process.env.VITE_ZOHO_ORGANIZATION_ID,
    VITE_ZOHO_API_DOMAIN: process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.in'
  })
})

// Determine auth URL based on API domain
const API_DOMAIN = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.in'
const ZOHO_AUTH_URL = API_DOMAIN.includes('zoho.in') 
  ? 'https://accounts.zoho.in/oauth/v2'
  : 'https://accounts.zoho.com/oauth/v2'
const CLIENT_ID = process.env.ZOHO_CLIENT_ID
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET
const REDIRECT_URI = process.env.ZOHO_REDIRECT_URI

console.log('🔐 Server Configuration:')
console.log('  Auth URL:', ZOHO_AUTH_URL)
console.log('  API Domain:', API_DOMAIN)
console.log('  Client ID:', CLIENT_ID ? `${CLIENT_ID.substring(0, 20)}...` : 'MISSING')
console.log('  Client Secret:', CLIENT_SECRET ? 'SET (hidden)' : 'MISSING')
console.log('  Redirect URI:', REDIRECT_URI)
console.log('  Organization ID:', process.env.VITE_ZOHO_ORGANIZATION_ID || 'MISSING')
console.log('  Environment:', process.env.NODE_ENV || 'development')
console.log('  Port:', PORT)

// Exchange authorization code for access token
app.post('/api/zoho/token', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' })
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: code
    })

    console.log('🔄 Exchanging code for token...')
    console.log('📝 Request params:', {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code: code ? code.substring(0, 20) + '...' : 'MISSING'
    })

    const response = await fetch(`${ZOHO_AUTH_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Token exchange failed:', data)
      return res.status(response.status).json(data)
    }

    // Debug: Log the entire response from Zoho
    console.log('🔍 Full Zoho response:', JSON.stringify(data, null, 2))
    console.log('🔍 access_token type:', typeof data.access_token)
    console.log('🔍 access_token value:', data.access_token)
    console.log('🔍 refresh_token type:', typeof data.refresh_token)
    console.log('🔍 refresh_token value:', data.refresh_token)

    // TEMPORARY: Relaxed validation - only check if tokens exist
    if (!data.access_token) {
      console.error('❌ CRITICAL: No access_token from Zoho!', JSON.stringify(data, null, 2))
      return res.status(500).json({ error: 'No access token in Zoho response', details: data })
    }
    
    if (!data.refresh_token) {
      console.error('❌ CRITICAL: No refresh_token from Zoho!', JSON.stringify(data, null, 2))
      return res.status(500).json({ error: 'No refresh token in Zoho response', details: data })
    }
    
    // Warn if tokens look suspicious but still allow them through
    if (typeof data.access_token !== 'string') {
      console.warn('⚠️ WARNING: access_token is not a string, type:', typeof data.access_token)
    }
    if (typeof data.refresh_token !== 'string') {
      console.warn('⚠️ WARNING: refresh_token is not a string, type:', typeof data.refresh_token)
    }

    console.log('✅ Token exchange successful')
    console.log('📦 Token data:', {
      has_access_token: !!data.access_token,
      has_refresh_token: !!data.refresh_token,
      expires_in: data.expires_in,
      access_token_preview: data.access_token.substring(0, 20) + '...',
      token_length: data.access_token.length
    })
    
    res.json(data)
  } catch (error) {
    console.error('❌ Error exchanging token:', error)
    res.status(500).json({ error: error.message })
  }
})

// Refresh access token
app.post('/api/zoho/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' })
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refresh_token
    })

    console.log('🔄 Refreshing access token...')

    const response = await fetch(`${ZOHO_AUTH_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Token refresh failed:', data)
      return res.status(response.status).json(data)
    }

    // TEMPORARY: Relaxed validation for refresh
    if (!data.access_token) {
      console.error('❌ CRITICAL: No access_token from Zoho refresh!', JSON.stringify(data, null, 2))
      return res.status(500).json({ error: 'No access token in refresh response' })
    }

    console.log('✅ Token refresh successful')
    console.log('📦 Refreshed token:', {
      has_access_token: !!data.access_token,
      expires_in: data.expires_in,
      access_token_preview: data.access_token.substring(0, 20) + '...'
    })
    
    res.json(data)
  } catch (error) {
    console.error('❌ Error refreshing token:', error)
    res.status(500).json({ error: error.message })
  }
})

// Proxy all Zoho Books API requests
app.all('/api/zoho/books/*', async (req, res) => {
  try {
    const { authorization } = req.headers
    
    if (!authorization) {
      console.log('❌ No authorization header')
      return res.status(401).json({ error: 'Authorization header required' })
    }

    // Extract the path after /api/zoho/books/
    const apiPath = req.url.replace('/api/zoho/books', '')
    const apiUrl = `${API_DOMAIN}/api/v3${apiPath}`

    console.log(`📡 Proxying: ${req.method} ${apiUrl}`)
    console.log(`🔑 Auth: ${authorization.substring(0, 30)}...`)

    const options = {
      method: req.method,
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    }

    if (req.method !== 'GET' && req.body) {
      options.body = JSON.stringify(req.body)
    }

    const response = await fetch(apiUrl, options)
    
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error(`❌ Non-JSON response: ${text.substring(0, 200)}`)
      return res.status(500).json({ error: 'Invalid response from Zoho API', details: text.substring(0, 200) })
    }

    if (!response.ok) {
      console.error(`❌ API Error ${response.status}:`, JSON.stringify(data, null, 2))
      return res.status(response.status).json(data)
    }

    console.log(`✅ Success: ${req.method} ${apiPath}`)
    res.json(data)
  } catch (error) {
    console.error('❌ Proxy error:', error.message)
    console.error('Stack:', error.stack)
    res.status(500).json({ error: error.message, stack: error.stack })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zoho OAuth Proxy Server Running' })
})

// Serve frontend for all other routes (SPA fallback) in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`\n🚀 Zoho OAuth Proxy Server running on http://localhost:${PORT}`)
  console.log(`📡 Frontend: http://localhost:5173`)
  console.log(`🔐 Auth URL: ${ZOHO_AUTH_URL}`)
  console.log(`📚 API Domain: ${API_DOMAIN}\n`)
})
