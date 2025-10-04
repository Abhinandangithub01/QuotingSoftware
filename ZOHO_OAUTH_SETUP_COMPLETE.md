# Complete Zoho OAuth Setup Guide

## ❌ Current Issue
"No access token in Zoho response" - This means the redirect URI mismatch or authorization code is invalid.

## ✅ Step-by-Step Fix

### 1. **Zoho API Console Setup** (CRITICAL)

Go to [https://api-console.zoho.in/](https://api-console.zoho.in/)

#### Create Client Application
1. Click **"Add Client"**
2. Select **"Server-based Applications"**
3. Fill in:
   - **Client Name**: Venezia Quoting System
   - **Homepage URL**: `https://quotingsoftware-production.up.railway.app`
   - **Authorized Redirect URIs** (ADD BOTH):
     ```
     http://localhost:5173/zoho/callback
     https://quotingsoftware-production.up.railway.app/zoho/callback
     ```
4. Click **"Create"**
5. Copy **Client ID** and **Client Secret**

### 2. **Update Local .env File**

Edit `c:/Users/mail2/Downloads/Venezia/.env`:

```env
# Zoho Books API Configuration (INDIA)
VITE_ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
VITE_ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
VITE_ZOHO_REDIRECT_URI=http://localhost:5173/zoho/callback
VITE_ZOHO_ORGANIZATION_ID=60050102326
VITE_ZOHO_API_DOMAIN=https://www.zohoapis.in

# Backend variables (MUST MATCH FRONTEND)
ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
ZOHO_REDIRECT_URI=http://localhost:5173/zoho/callback
ZOHO_API_DOMAIN=https://www.zohoapis.in

# Server
NODE_ENV=development
PORT=3001
```

**CRITICAL**: The redirect URI must be EXACTLY `/zoho/callback` (not `/auth/callback`)

### 3. **Update Railway Environment Variables**

In Railway dashboard → Variables:

```env
NODE_ENV=production
ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/zoho/callback
ZOHO_API_DOMAIN=https://www.zohoapis.in
VITE_ZOHO_ORGANIZATION_ID=60050102326
```

### 4. **Restart Servers**

```bash
# Stop all running servers (Ctrl+C)

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Start both servers
npm run dev:full
```

### 5. **Clear Browser Data**

1. Open DevTools (F12)
2. Go to **Application** tab
3. **Local Storage** → Select your domain
4. Click **"Clear All"**
5. **Close and reopen browser** (important!)

### 6. **Test OAuth Flow**

1. Go to `http://localhost:5173`
2. Navigate to **Settings**
3. Click **"Connect to Zoho Books"**
4. You should see Zoho authorization page
5. After approving, you'll be redirected to `/zoho/callback`
6. Check browser console for logs:
   ```
   📋 Config loaded: { clientId: 'SET', redirectUri: '...', ... }
   🔄 Exchanging code for token...
   ✅ Token saved
   ```

### 7. **Check Server Logs**

In the terminal running `npm run server`, you should see:

```
🔐 Server Configuration:
  Auth URL: https://accounts.zoho.in/oauth/v2
  API Domain: https://www.zohoapis.in
  Client ID: SET
  Client Secret: SET
  Redirect URI: http://localhost:5173/zoho/callback
  Environment: development

🔄 Exchanging code for token...
📝 Request params: { ... }
🔍 Full Zoho response: { access_token: '...', refresh_token: '...', ... }
✅ Token exchange successful
```

## 🔍 Debugging

### Check Redirect URI Mismatch

The most common issue is redirect URI mismatch. Verify:

1. **Zoho API Console**: `http://localhost:5173/zoho/callback`
2. **.env file**: `ZOHO_REDIRECT_URI=http://localhost:5173/zoho/callback`
3. **Browser URL** after redirect: Should match exactly

### Check Authorization Code

The authorization code from Zoho:
- Is single-use only
- Expires in 60 seconds
- Must be exchanged immediately

If you see the error repeatedly, the code might be:
- Already used
- Expired
- Invalid due to redirect URI mismatch

### Check Server Logs

Look for these errors:

**"redirect_uri_mismatch"**
```
❌ Token exchange failed: { error: 'redirect_uri_mismatch' }
```
**Solution**: Update redirect URI in Zoho API Console

**"invalid_code"**
```
❌ Token exchange failed: { error: 'invalid_code' }
```
**Solution**: Code expired or already used. Try OAuth flow again.

**"invalid_client"**
```
❌ Token exchange failed: { error: 'invalid_client' }
```
**Solution**: Check Client ID and Secret in .env

## 📚 Zoho OAuth Best Practices

### 1. Token Expiration
- **Access Token**: Expires in 1 hour
- **Refresh Token**: Never expires (unless revoked)
- **Auto-refresh**: Implemented 5 minutes before expiry

### 2. Token Storage
- Stored in `localStorage`:
  - `zoho_access_token`
  - `zoho_refresh_token`
  - `zoho_token_expiry`
  - `zoho_api_domain`

### 3. Token Refresh Flow
```javascript
// Automatic refresh before expiry
if (isTokenExpiringSoon()) {
  const newToken = await zohoAuth.refreshAccessToken()
  // Use new token for API calls
}
```

### 4. Error Handling
- **401 Unauthorized**: Auto-refresh token and retry
- **Invalid Token**: Clear localStorage and re-authenticate
- **Network Error**: Retry with exponential backoff

### 5. Security
- ✅ OAuth 2.0 with PKCE (Proof Key for Code Exchange)
- ✅ State parameter for CSRF protection
- ✅ Backend proxy to hide client secret
- ✅ HTTPS required in production
- ✅ Token validation (5 layers)

## 🎯 Production Deployment

### Railway Configuration

1. **Environment Variables** (set in Railway dashboard):
```env
NODE_ENV=production
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/zoho/callback
ZOHO_API_DOMAIN=https://www.zohoapis.in
VITE_ZOHO_ORGANIZATION_ID=your_org_id
```

2. **Zoho API Console**:
   - Add production redirect URI: `https://quotingsoftware-production.up.railway.app/zoho/callback`

3. **Deploy**:
```bash
git push origin main
# Railway auto-deploys
```

## ✅ Verification Checklist

- [ ] Zoho API Console has correct redirect URIs
- [ ] `.env` file has correct redirect URI (`/zoho/callback`)
- [ ] Railway environment variables are set
- [ ] Client ID and Secret match in all places
- [ ] Organization ID is correct
- [ ] Servers are restarted
- [ ] Browser cache is cleared
- [ ] OAuth flow completes without errors
- [ ] Tokens are saved in localStorage
- [ ] API calls work with saved tokens

## 🆘 Still Not Working?

### Check Railway Logs

```bash
# In Railway dashboard
Deployments → Latest → View Logs
```

Look for:
```
🔐 Server Configuration:
  Redirect URI: https://...
```

### Check Browser Console

```javascript
// In browser console
localStorage.getItem('zoho_access_token')
localStorage.getItem('zoho_refresh_token')
```

Should return valid tokens (not null or "undefined")

### Manual Test

```bash
# Test token exchange manually
curl -X POST https://accounts.zoho.in/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:5173/zoho/callback" \
  -d "code=YOUR_AUTH_CODE"
```

## 📞 Support

- **Zoho API Docs**: https://www.zoho.com/books/api/v3/oauth/
- **Zoho API Console**: https://api-console.zoho.in/
- **GitHub Issues**: https://github.com/Abhinandangithub01/QuotingSoftware/issues

---

**Last Updated**: October 4, 2025
**Version**: 2.0
