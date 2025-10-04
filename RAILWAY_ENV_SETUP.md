# Railway Environment Variables Setup

## 🚀 Required Environment Variables for Railway

Go to your Railway project → Variables tab and add these:

```env
# Node Environment
NODE_ENV=production

# Zoho OAuth Credentials (Backend)
ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
ZOHO_API_DOMAIN=https://www.zohoapis.in
ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/zoho/callback

# Zoho Organization (Frontend - passed via API)
VITE_ZOHO_ORGANIZATION_ID=60050102326
```

## ⚠️ CRITICAL: Zoho API Console Setup

1. Go to https://api-console.zoho.in/
2. Select your client application
3. Under **Authorized Redirect URIs**, add:
   ```
   https://quotingsoftware-production.up.railway.app/zoho/callback
   ```
4. Save changes

## 🔍 How It Works in Production

### Frontend Config Loading
```javascript
// In production, frontend fetches config from backend
GET /api/config
// Returns:
{
  VITE_ZOHO_CLIENT_ID: "...",
  VITE_ZOHO_REDIRECT_URI: "https://...",
  VITE_ZOHO_ORGANIZATION_ID: "...",
  VITE_ZOHO_API_DOMAIN: "https://..."
}
```

### OAuth Flow
1. User clicks "Connect to Zoho Books"
2. Frontend gets config from `/api/config`
3. Redirects to Zoho with production redirect URI
4. Zoho redirects back to `https://quotingsoftware-production.up.railway.app/zoho/callback`
5. Frontend sends auth code to backend `/api/zoho/token`
6. Backend exchanges code for tokens using production redirect URI
7. Tokens saved to localStorage

## ✅ Verification Steps

### 1. Check Railway Logs
After deployment, check logs for:
```
🔐 Server Configuration:
  Auth URL: https://accounts.zoho.in/oauth/v2
  API Domain: https://www.zohoapis.in
  Client ID: 1000.K4Q0VI1JZ7QN...
  Client Secret: SET (hidden)
  Redirect URI: https://quotingsoftware-production.up.railway.app/zoho/callback
  Organization ID: 60050102326
  Environment: production
  Port: XXXX
```

### 2. Test Config Endpoint
```bash
curl https://quotingsoftware-production.up.railway.app/api/config
```

Should return:
```json
{
  "VITE_ZOHO_CLIENT_ID": "1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS",
  "VITE_ZOHO_REDIRECT_URI": "https://quotingsoftware-production.up.railway.app/zoho/callback",
  "VITE_ZOHO_ORGANIZATION_ID": "60050102326",
  "VITE_ZOHO_API_DOMAIN": "https://www.zohoapis.in"
}
```

### 3. Test OAuth Flow
1. Go to https://quotingsoftware-production.up.railway.app
2. Navigate to Settings
3. Click "Connect to Zoho Books"
4. Check browser console for:
   ```
   📋 Config loaded: { clientId: 'SET', redirectUri: 'https://...', ... }
   ```
5. Complete Zoho authorization
6. Check Railway logs for:
   ```
   🔄 Exchanging code for token...
   📝 Request params: { redirect_uri: 'https://...' }
   🔍 Full Zoho response: { access_token: '...', ... }
   ✅ Token exchange successful
   ```

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause**: Redirect URI in Railway doesn't match Zoho API Console

**Fix**:
1. Check Railway variable: `ZOHO_REDIRECT_URI`
2. Check Zoho API Console: Authorized Redirect URIs
3. They must match EXACTLY (including https://)

### Error: "No access token in Zoho response"

**Cause**: Authorization code invalid or expired

**Possible reasons**:
1. Code already used (single-use only)
2. Code expired (60 seconds)
3. Redirect URI mismatch
4. Wrong client credentials

**Fix**:
1. Check Railway logs for exact error from Zoho
2. Try OAuth flow again (generates new code)
3. Verify all environment variables are set correctly

### Error: "invalid_client"

**Cause**: Client ID or Secret incorrect

**Fix**:
1. Verify `ZOHO_CLIENT_ID` in Railway matches Zoho API Console
2. Verify `ZOHO_CLIENT_SECRET` in Railway matches Zoho API Console
3. Redeploy after updating variables

## 📝 Deployment Checklist

- [ ] All environment variables set in Railway
- [ ] Redirect URI added to Zoho API Console
- [ ] Code pushed to GitHub (Railway auto-deploys)
- [ ] Deployment successful (check Railway logs)
- [ ] `/api/config` endpoint returns correct values
- [ ] OAuth flow completes without errors
- [ ] Tokens saved to localStorage
- [ ] API calls work with saved tokens

## 🔄 After Changing Variables

If you update any environment variables in Railway:

1. Railway will automatically redeploy
2. Wait for deployment to complete (~2 minutes)
3. Clear browser cache and localStorage
4. Try OAuth flow again

## 📞 Support

If issues persist:

1. **Check Railway Logs**: Deployments → Latest → View Logs
2. **Check Browser Console**: F12 → Console tab
3. **Check Network Tab**: F12 → Network → Filter by "zoho"
4. **Manual Test**:
   ```bash
   # Test token exchange
   curl -X POST https://accounts.zoho.in/oauth/v2/token \
     -d "grant_type=authorization_code" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "redirect_uri=https://quotingsoftware-production.up.railway.app/zoho/callback" \
     -d "code=YOUR_AUTH_CODE"
   ```

---

**Last Updated**: October 4, 2025
