# Railway Quick Fix Guide

## 🚨 Current Status
Testing directly on Railway production: `https://quotingsoftware-production.up.railway.app`

## ✅ What Was Fixed

1. **Added `/api/config` endpoint** - Frontend now fetches config from backend in production
2. **Enhanced logging** - Server shows all config on startup
3. **Dynamic config** - Works with Railway environment variables

## 🎯 Required Actions (DO THIS NOW)

### 1. Set Railway Environment Variables

Go to Railway → Your Project → Variables → Add these:

```
NODE_ENV=production
ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
ZOHO_API_DOMAIN=https://www.zohoapis.in
ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/zoho/callback
VITE_ZOHO_ORGANIZATION_ID=60050102326
```

### 2. Update Zoho API Console

Go to https://api-console.zoho.in/ → Your Client → Edit

**Authorized Redirect URIs** - Add this EXACT URL:
```
https://quotingsoftware-production.up.railway.app/zoho/callback
```

Click **Update**

### 3. Wait for Railway Deployment

- Railway will auto-deploy (takes ~2 minutes)
- Check Deployments tab for "Success"

### 4. Verify Configuration

Open: `https://quotingsoftware-production.up.railway.app/api/config`

Should show:
```json
{
  "VITE_ZOHO_CLIENT_ID": "1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS",
  "VITE_ZOHO_REDIRECT_URI": "https://quotingsoftware-production.up.railway.app/zoho/callback",
  "VITE_ZOHO_ORGANIZATION_ID": "60050102326",
  "VITE_ZOHO_API_DOMAIN": "https://www.zohoapis.in"
}
```

### 5. Check Railway Logs

In Railway → Deployments → Latest → View Logs

Look for:
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

### 6. Test OAuth Flow

1. Go to: `https://quotingsoftware-production.up.railway.app`
2. Navigate to **Settings**
3. Click **"Connect to Zoho Books"**
4. Complete authorization on Zoho
5. Check Railway logs for:
   ```
   🔄 Exchanging code for token...
   📝 Request params: { redirect_uri: 'https://...' }
   🔍 Full Zoho response: { access_token: '...', ... }
   ✅ Token exchange successful
   ```

## 🐛 If Still Not Working

### Check These in Order:

1. **Railway Variables Set?**
   - All 6 variables present
   - No typos in values
   - Redirect URI has correct domain

2. **Zoho API Console Updated?**
   - Redirect URI added
   - Exact match (including https://)
   - Client is "Server-based Applications"

3. **Railway Deployed?**
   - Check Deployments tab
   - Status should be "Success"
   - Latest commit deployed

4. **Config Endpoint Working?**
   - Visit `/api/config`
   - Returns JSON with all values
   - Redirect URI matches Railway variable

5. **Check Railway Logs**
   - Look for "redirect_uri_mismatch"
   - Look for "invalid_client"
   - Look for "invalid_code"

### Common Errors & Fixes

**"redirect_uri_mismatch"**
→ Zoho API Console redirect URI doesn't match Railway variable

**"No access token in Zoho response"**
→ Check Railway logs for exact Zoho error
→ Usually means redirect URI mismatch or invalid code

**"invalid_client"**
→ Client ID or Secret wrong in Railway variables

**"invalid_code"**
→ Code expired (60 seconds) or already used
→ Try OAuth flow again

## 📞 Quick Support Commands

```bash
# Test config endpoint
curl https://quotingsoftware-production.up.railway.app/api/config

# Test health check
curl https://quotingsoftware-production.up.railway.app/health

# Manual token exchange (replace YOUR_AUTH_CODE)
curl -X POST https://accounts.zoho.in/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS" \
  -d "client_secret=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd" \
  -d "redirect_uri=https://quotingsoftware-production.up.railway.app/zoho/callback" \
  -d "code=YOUR_AUTH_CODE"
```

## ✅ Success Indicators

You'll know it's working when:

1. ✅ `/api/config` returns correct values
2. ✅ Railway logs show correct configuration
3. ✅ OAuth redirects to Zoho successfully
4. ✅ Zoho redirects back to your app
5. ✅ Railway logs show "Token exchange successful"
6. ✅ Browser console shows "Token saved"
7. ✅ Settings page shows "Connected" status

---

**Last Updated**: October 4, 2025, 11:43 AM IST
**Status**: Code deployed, waiting for Railway variables
