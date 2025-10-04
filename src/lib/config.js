/**
 * Runtime configuration loader
 * Fetches config from server in production, uses import.meta.env in development
 */

let cachedConfig = null

export async function getConfig() {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig
  }

  // In production, fetch from server
  if (import.meta.env.PROD) {
    try {
      const response = await fetch('/api/config')
      const config = await response.json()
      cachedConfig = config
      return config
    } catch (error) {
      console.error('Failed to fetch config from server:', error)
      // Fallback to import.meta.env
      return getDevConfig()
    }
  }

  // In development, use import.meta.env
  return getDevConfig()
}

function getDevConfig() {
  // Dynamically determine redirect URI based on current origin
  const redirectUri = import.meta.env.VITE_ZOHO_REDIRECT_URI || 
    `${window.location.origin}/zoho/callback`
  
  const config = {
    VITE_ZOHO_CLIENT_ID: import.meta.env.VITE_ZOHO_CLIENT_ID,
    VITE_ZOHO_CLIENT_SECRET: import.meta.env.VITE_ZOHO_CLIENT_SECRET,
    VITE_ZOHO_REDIRECT_URI: redirectUri,
    VITE_ZOHO_API_DOMAIN: import.meta.env.VITE_ZOHO_API_DOMAIN || 'https://www.zohoapis.in',
    VITE_ZOHO_ORGANIZATION_ID: import.meta.env.VITE_ZOHO_ORGANIZATION_ID
  }
  
  console.log('📋 Config loaded:', {
    clientId: config.VITE_ZOHO_CLIENT_ID ? 'SET' : 'MISSING',
    redirectUri: config.VITE_ZOHO_REDIRECT_URI,
    apiDomain: config.VITE_ZOHO_API_DOMAIN,
    orgId: config.VITE_ZOHO_ORGANIZATION_ID ? 'SET' : 'MISSING'
  })
  
  cachedConfig = config
  return config
}

// Preload config on app start
if (import.meta.env.PROD) {
  getConfig().catch(console.error)
}
