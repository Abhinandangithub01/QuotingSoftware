# Zoho Token Management - Best Practices Implementation

## 📚 Based on Zoho OAuth 2.0 Documentation

This implementation follows Zoho's official OAuth 2.0 best practices:
https://www.zoho.com/accounts/protocol/oauth.html

## 🔑 Token Lifecycle

### 1. **Access Token**
- **Lifetime**: 1 hour (3600 seconds)
- **Format**: Starts with `1000.`
- **Usage**: All API requests
- **Refresh**: Automatically 5 minutes before expiry

### 2. **Refresh Token**
- **Lifetime**: Never expires (unless revoked)
- **Format**: Starts with `1000.`
- **Usage**: Get new access tokens
- **Storage**: Secure localStorage

## 🔄 Token Refresh Strategy

### Proactive Refresh (Recommended by Zoho)

```javascript
// Refresh 5 minutes before expiry
const REFRESH_BUFFER = 5 * 60 * 1000 // 5 minutes

if (tokenExpiresIn < REFRESH_BUFFER) {
  await refreshAccessToken()
}
```

**Why 5 minutes?**
- Prevents race conditions
- Accounts for network latency
- Ensures uninterrupted API access
- Zoho recommended practice

### Automatic Refresh Flow

```
1. User makes API call
2. Check token expiry
3. If expires in < 5 min → Refresh
4. Use new token for API call
5. Save new token to localStorage
```

## 💾 Token Storage

### LocalStorage Keys

```javascript
{
  'zoho_access_token': '1000.xxx...',        // Current access token
  'zoho_refresh_token': '1000.yyy...',       // Refresh token (never expires)
  'zoho_token_expiry': '1234567890123',      // Expiry timestamp (ms)
  'zoho_api_domain': 'https://www.zohoapis.in', // API domain
  'zoho_token_type': 'Bearer',               // Token type
  'zoho_token_created_at': '1234567890123'   // Creation timestamp
}
```

### Security Considerations

✅ **Do:**
- Store in localStorage (client-side app)
- Validate token format before use
- Clear tokens on logout
- Handle token refresh failures

❌ **Don't:**
- Store in cookies (CSRF risk)
- Log full tokens to console
- Share tokens across domains
- Hardcode tokens in code

## 🔐 Token Validation

### Format Validation

```javascript
// Zoho tokens always start with "1000."
if (!token.startsWith('1000.')) {
  throw new Error('Invalid Zoho token format')
}

// Minimum length check
if (token.length < 50) {
  throw new Error('Token too short')
}

// Type check
if (typeof token !== 'string') {
  throw new Error('Token must be string')
}
```

### Expiry Validation

```javascript
const now = Date.now()
const expiry = parseInt(localStorage.getItem('zoho_token_expiry'))

if (now >= expiry) {
  // Token expired
  await refreshAccessToken()
}
```

## 🚀 API Request Flow

### With Auto-Refresh

```javascript
async function makeAPICall(endpoint) {
  // 1. Get valid token (auto-refreshes if needed)
  const token = await zohoAuth.getValidAccessToken()
  
  // 2. Make API call
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`
    }
  })
  
  // 3. Handle 401 (token invalid)
  if (response.status === 401) {
    // Force refresh and retry
    await zohoAuth.refreshAccessToken()
    const newToken = await zohoAuth.getValidAccessToken()
    
    // Retry request
    return fetch(endpoint, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${newToken}`
      }
    })
  }
  
  return response
}
```

## ⏱️ Token Timing

### Typical Timeline

```
00:00 - Token created (expires_in: 3600s)
00:55 - Auto-refresh triggered (5 min buffer)
00:56 - New token received
01:00 - Old token expires
```

### Edge Cases

**Network Delay:**
```
00:55 - Refresh starts
00:56 - Network slow...
00:59 - Refresh completes
01:00 - Old token expires
✅ New token ready before expiry
```

**Refresh Failure:**
```
00:55 - Refresh fails
00:56 - Retry refresh
00:57 - Still fails
01:00 - Token expires
❌ User must re-authenticate
```

## 🛡️ Error Handling

### Token Refresh Errors

```javascript
try {
  await refreshAccessToken()
} catch (error) {
  if (error.message.includes('invalid_grant')) {
    // Refresh token revoked or invalid
    clearTokens()
    redirectToLogin()
  } else if (error.message.includes('network')) {
    // Network error - retry
    await retryRefresh()
  } else {
    // Unknown error - log and clear
    console.error('Refresh failed:', error)
    clearTokens()
  }
}
```

### API Call Errors

```javascript
// 401 Unauthorized - Token invalid
if (response.status === 401) {
  await refreshAccessToken()
  // Retry request
}

// 403 Forbidden - Insufficient permissions
if (response.status === 403) {
  throw new Error('Insufficient permissions')
}

// 429 Too Many Requests - Rate limited
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After')
  await sleep(retryAfter * 1000)
  // Retry request
}
```

## 📊 Token Metrics

### Monitor These

```javascript
{
  token_age: Date.now() - token_created_at,
  time_until_expiry: token_expiry - Date.now(),
  refresh_count: number_of_refreshes,
  last_refresh: last_refresh_timestamp
}
```

### Alerts

- ⚠️ Token age > 50 minutes → Refresh soon
- ❌ Refresh failed → User action needed
- ✅ Token refreshed → Update metrics

## 🔄 Token Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    OAuth 2.0 Flow                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User clicks "Connect to Zoho"                          │
│     ↓                                                       │
│  2. Redirect to Zoho authorization                         │
│     ↓                                                       │
│  3. User approves                                          │
│     ↓                                                       │
│  4. Redirect back with code                                │
│     ↓                                                       │
│  5. Exchange code for tokens                               │
│     ├─ access_token (1 hour)                              │
│     └─ refresh_token (never expires)                      │
│     ↓                                                       │
│  6. Save to localStorage                                   │
│     ↓                                                       │
│  7. Use access_token for API calls                        │
│     ↓                                                       │
│  8. After 55 minutes → Auto-refresh                       │
│     ↓                                                       │
│  9. Get new access_token                                  │
│     ↓                                                       │
│  10. Repeat from step 7                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📝 Implementation Checklist

- [x] Store access_token in localStorage
- [x] Store refresh_token in localStorage
- [x] Store token_expiry timestamp
- [x] Validate token format (starts with "1000.")
- [x] Auto-refresh 5 minutes before expiry
- [x] Handle refresh failures gracefully
- [x] Clear tokens on logout
- [x] Retry failed API calls after refresh
- [x] Log token lifecycle events
- [x] Monitor token metrics

## 🔗 References

- [Zoho OAuth 2.0 Guide](https://www.zoho.com/accounts/protocol/oauth.html)
- [Zoho Books API](https://www.zoho.com/books/api/v3/)
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)

---

**Last Updated**: October 4, 2025
**Implemented**: Full Zoho OAuth 2.0 best practices
