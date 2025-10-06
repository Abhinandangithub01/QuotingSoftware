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
const API_DOMAIN = (process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.in').trim()

// Debug: Log what we're checking
console.log('🔍 DEBUG: API_DOMAIN =', `"${API_DOMAIN}"`)
console.log('🔍 DEBUG: API_DOMAIN length =', API_DOMAIN.length)
console.log('🔍 DEBUG: includes zoho.in?', API_DOMAIN.includes('zoho.in'))
console.log('🔍 DEBUG: includes .in?', API_DOMAIN.includes('.in'))

const ZOHO_AUTH_URL = API_DOMAIN.includes('.in') 
  ? 'https://accounts.zoho.in/oauth/v2'
  : 'https://accounts.zoho.com/oauth/v2'
const CLIENT_ID = process.env.ZOHO_CLIENT_ID
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET
const REDIRECT_URI = process.env.ZOHO_REDIRECT_URI

console.log('🔐 Server Configuration:')
console.log('  Auth URL:', ZOHO_AUTH_URL)
console.log('  API Domain:', API_DOMAIN)
console.log('  Client ID:', CLIENT_ID ? `${CLIENT_ID.substring(0, 20)}...` : '❌ MISSING')
console.log('  Client Secret:', CLIENT_SECRET ? '✅ SET (hidden)' : '❌ MISSING')
console.log('  Redirect URI:', REDIRECT_URI || '❌ MISSING')
console.log('  Organization ID:', process.env.VITE_ZOHO_ORGANIZATION_ID || '❌ MISSING')
console.log('  Environment:', process.env.NODE_ENV || 'development')
console.log('  Port:', PORT)

// Validate critical environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('❌ CRITICAL: Missing required environment variables!')
  console.error('   Required: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REDIRECT_URI')
  console.error('   Please set these in Railway dashboard')
}

// Exchange authorization code for access token
app.post('/api/zoho/token', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' })
    }

    // Validate server has credentials
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('❌ Server missing credentials!')
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Zoho credentials not configured on server. Please set ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET in Railway environment variables.'
      })
    }

    // Use redirect_uri from request if provided, otherwise fall back to env variable
    const redirectUri = redirect_uri || REDIRECT_URI
    
    if (!redirectUri) {
      return res.status(400).json({ 
        error: 'Redirect URI required',
        message: 'Please provide redirect_uri in request body or set ZOHO_REDIRECT_URI environment variable.'
      })
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: redirectUri,
      code: code
    })

    console.log('🔄 Exchanging code for token...')
    console.log('📝 EXACT Request params being sent:')
    console.log('   URL:', `${ZOHO_AUTH_URL}/token`)
    console.log('   grant_type:', 'authorization_code')
    console.log('   client_id:', CLIENT_ID)
    console.log('   client_secret:', CLIENT_SECRET)
    console.log('   redirect_uri:', redirectUri)
    console.log('   code:', code)
    console.log('   Body string:', params.toString())

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
      console.error('❌ Full error response:', JSON.stringify(data, null, 2))
      return res.status(response.status).json(data)
    }

    // Debug: Log the entire response from Zoho
    console.log('🔍 Full Zoho response:', JSON.stringify(data, null, 2))
    console.log('🔍 access_token type:', typeof data.access_token)
    console.log('🔍 access_token value:', data.access_token)
    console.log('🔍 refresh_token type:', typeof data.refresh_token)
    console.log('🔍 refresh_token value:', data.refresh_token)

    // Check if Zoho returned an error
    if (data.error) {
      console.error('❌ Zoho returned error:', {
        error: data.error,
        error_description: data.error_description,
        full_response: data
      })
      return res.status(400).json({ 
        error: data.error,
        message: data.error_description || data.error,
        details: data 
      })
    }

    // Validate tokens exist
    if (!data.access_token) {
      console.error('❌ CRITICAL: No access_token from Zoho!')
      console.error('Full response:', JSON.stringify(data, null, 2))
      return res.status(500).json({ 
        error: 'No access token in Zoho response', 
        details: data,
        hint: 'Check if redirect_uri matches exactly in Zoho API Console'
      })
    }
    
    if (!data.refresh_token) {
      console.error('❌ CRITICAL: No refresh_token from Zoho!')
      console.error('Full response:', JSON.stringify(data, null, 2))
      return res.status(500).json({ 
        error: 'No refresh token in Zoho response', 
        details: data 
      })
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
      token_type: data.token_type,
      api_domain: data.api_domain,
      access_token_preview: data.access_token.substring(0, 20) + '...',
      token_length: data.access_token.length,
      expires_at: new Date(Date.now() + (data.expires_in * 1000)).toISOString()
    })
    
    // Return token data with additional metadata
    res.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type || 'Bearer',
      api_domain: data.api_domain || API_DOMAIN
    })
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
      token_type: data.token_type,
      access_token_preview: data.access_token.substring(0, 20) + '...',
      expires_at: new Date(Date.now() + (data.expires_in * 1000)).toISOString()
    })
    
    // Return refreshed token with metadata
    res.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type || 'Bearer',
      api_domain: data.api_domain || API_DOMAIN
    })
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
    const apiUrl = `${API_DOMAIN}/books/v3${apiPath}`

    console.log(`📡 Proxying: ${req.method} ${apiUrl}`)
    console.log(`🔑 Auth: ${authorization.substring(0, 30)}...`)
    
    // Ensure organization_id is in query params (required by Zoho)
    const url = new URL(apiUrl)
    if (!url.searchParams.has('organization_id')) {
      console.warn('⚠️ Warning: organization_id not in request, some APIs may fail')
    }

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

// OAuth callback handler for test page
app.get('/callback', (req, res) => {
  const code = req.query.code
  const error = req.query.error
  
  if (error) {
    console.error('❌ OAuth error:', error)
    return res.send(`
      <html>
        <body>
          <h1>OAuth Error</h1>
          <p>Error: ${error}</p>
          <p>${req.query.error_description || ''}</p>
          <a href="/zoho-test.html">Back to Test Page</a>
        </body>
      </html>
    `)
  }
  
  if (!code) {
    return res.send(`
      <html>
        <body>
          <h1>No Authorization Code</h1>
          <p>No code parameter found in callback</p>
          <a href="/zoho-test.html">Back to Test Page</a>
        </body>
      </html>
    `)
  }
  
  // Redirect back to test page with code
  res.redirect(`/zoho-test.html?code=${code}`)
})

// Serve test page
app.get('/zoho-test.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'zoho-test.html'))
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
