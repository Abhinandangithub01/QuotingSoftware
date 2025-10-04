# Final Zoho OAuth Checklist - DO THIS NOW

## 🚨 Current Error
"No access token in Zoho response" - This means Zoho is rejecting the token exchange request.

## ✅ Step-by-Step Fix (Follow Exactly)

### 1. Check Railway Logs (MOST IMPORTANT)

After deployment completes, check Railway logs for the EXACT error:

```
🔍 Full Zoho response: { "error": "...", "error_description": "..." }
```

Common errors:
- `redirect_uri_mismatch` - URIs don't match
- `invalid_code` - Code expired or already used  
- `invalid_client` - Wrong Client ID/Secret

### 2. Verify Zoho API Console Settings

Go to: https://api-console.zoho.in/

**Check these EXACTLY:**

✅ Client Type: **"Server-based Applications"**

✅ Authorized Redirect URIs must include BOTH:
```
http://localhost:5173/zoho/callback
https://quotingsoftware-production.up.railway.app/zoho/callback
```

✅ Scopes: **ZohoBooks.fullaccess.all**

### 3. Verify Railway Environment Variables

Go to Railway → Your Project → Variables

**Must have ALL 6 variables:**

```
NODE_ENV=production
ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
ZOHO_API_DOMAIN=https://www.zohoapis.in
ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/zoho/callback
VITE_ZOHO_ORGANIZATION_ID=60050102326
```

**CRITICAL**: `ZOHO_REDIRECT_URI` must EXACTLY match what's in Zoho API Console (including https://)

### 4. Test Configuration Endpoint

Open: https://quotingsoftware-production.up.railway.app/api/config

Should return:
```json
{
  "VITE_ZOHO_CLIENT_ID": "1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS",
  "VITE_ZOHO_REDIRECT_URI": "https://quotingsoftware-production.up.railway.app/zoho/callback",
  "VITE_ZOHO_ORGANIZATION_ID": "60050102326",
  "VITE_ZOHO_API_DOMAIN": "https://www.zohoapis.in"
}
```

### 5. Check Railway Server Logs

Look for startup configuration:
```
🔐 Server Configuration:
  Auth URL: https://accounts.zoho.in/oauth/v2
  API Domain: https://www.zohoapis.in
  Client ID: 1000.K4Q0VI1JZ7QN...
  Client Secret: SET (hidden)
  Redirect URI: https://quotingsoftware-production.up.railway.app/zoho/callback
  Organization ID: 60050102326
  Environment: production
```

### 6. Try OAuth Flow Again

1. Clear browser cache (Ctrl+Shift+Delete → All time)
2. Go to: https://quotingsoftware-production.up.railway.app/settings
3. Click "Connect to Zoho Books"
4. Authorize on Zoho
5. Check Railway logs immediately

### 7. Read the Exact Error

Railway logs will now show:

**If redirect_uri_mismatch:**
```
❌ Zoho returned error: {
  error: 'redirect_uri_mismatch',
  error_description: 'The redirect URI provided does not match...'
}
```
**Fix**: Update Zoho API Console redirect URI to match EXACTLY

**If invalid_code:**
```
❌ Zoho returned error: {
  error: 'invalid_code',
  error_description: 'The authorization code is invalid or has expired'
}
```
**Fix**: Try OAuth flow again (code expires in 60 seconds)

**If invalid_client:**
```
❌ Zoho returned error: {
  error: 'invalid_client',
  error_description: 'Client authentication failed'
}
```
**Fix**: Check Client ID and Secret in Railway match Zoho API Console

## 🔍 Debug Commands

```bash
# Test config endpoint
curl https://quotingsoftware-production.up.railway.app/api/config

# Test health check  
curl https://quotingsoftware-production.up.railway.app/health

# Check if redirect URI matches
# Compare these two:
echo "Railway: https://quotingsoftware-production.up.railway.app/zoho/callback"
# vs Zoho API Console redirect URI
```

## 📋 Common Mistakes

❌ **Redirect URI has trailing slash** - Remove it
❌ **Redirect URI uses http instead of https** - Must be https in production
❌ **Client ID/Secret copied with extra spaces** - Trim whitespace
❌ **Using wrong Zoho data center** - India uses .in, US uses .com
❌ **Authorization code used twice** - Each code is single-use only

## ✅ Success Indicators

You'll know it works when Railway logs show:

```
🔄 Exchanging code for token...
📝 Request params: { redirect_uri: 'https://...' }
🔍 Full Zoho response: {
  "access_token": "1000.xxx...",
  "refresh_token": "1000.yyy...",
  "expires_in": 3600,
  "api_domain": "https://www.zohoapis.in",
  "token_type": "Bearer"
}
✅ Token exchange successful
```

And browser shows:
```
✅ Successfully connected to Zoho Books!
Redirecting to application...
```

## 🆘 If Still Not Working

1. **Screenshot Railway logs** showing the exact error
2. **Screenshot Zoho API Console** redirect URI settings
3. **Screenshot Railway variables** (hide the secret)
4. **Share these** for debugging

The logs will now tell us EXACTLY what Zoho is rejecting!

---

**Last Updated**: October 4, 2025, 11:58 AM IST
**Deploy Status**: Enhanced error logging deployed
**Next**: Wait for Railway deployment, then try OAuth flow and check logs
