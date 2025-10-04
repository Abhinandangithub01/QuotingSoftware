# 🚨 URGENT FIX - Invalid Client Error

## Current Error
```
Error: Invalid client credentials. 
Please verify Client ID and Secret in Railway environment variables 
match your Zoho API Console.
```

## Root Cause
The Railway environment variables still have the OLD client credentials. You created a NEW client in Zoho but didn't update Railway yet.

## ✅ IMMEDIATE ACTION REQUIRED

### Step 1: Update Railway Environment Variables

Go to: **Railway Dashboard → Your Project → Variables**

**DELETE the old values and ADD these NEW ones:**

```env
ZOHO_CLIENT_ID=1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW
ZOHO_CLIENT_SECRET=553c38ec51680afcd74e1ad60b3d912ffb19fb12b6
```

**Make sure these are EXACTLY correct:**
- No extra spaces
- No quotes
- Exact copy-paste from Zoho

### Step 2: Verify Other Variables

Also ensure these are set:

```env
NODE_ENV=production
ZOHO_API_DOMAIN=https://www.zohoapis.in
ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/zoho/callback
VITE_ZOHO_ORGANIZATION_ID=60050102326
```

### Step 3: Wait for Deployment

Railway will auto-redeploy when you save variables (~2 minutes)

### Step 4: Verify Configuration

After deployment, check:
```
https://quotingsoftware-production.up.railway.app/api/config
```

Should return:
```json
{
  "VITE_ZOHO_CLIENT_ID": "1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW",
  "VITE_ZOHO_REDIRECT_URI": "https://quotingsoftware-production.up.railway.app/zoho/callback",
  "VITE_ZOHO_ORGANIZATION_ID": "60050102326",
  "VITE_ZOHO_API_DOMAIN": "https://www.zohoapis.in"
}
```

### Step 5: Check Railway Logs

After deployment, logs should show:
```
🔐 Server Configuration:
  Client ID: 1000.8KKXLK4BLVQ2J9...
  Client Secret: ✅ SET (hidden)
  Redirect URI: https://quotingsoftware-production.up.railway.app/zoho/callback
```

### Step 6: Try OAuth Again

1. Clear browser cache (Ctrl+Shift+Delete)
2. Go to Settings
3. Click "Connect to Zoho Books"
4. Should work! ✅

## 🔍 How to Verify It's Fixed

**Before Fix:**
```
❌ Token exchange failed: { error: 'invalid_client' }
```

**After Fix:**
```
✅ Token exchange successful
📦 Token data: { access_token: '1000.xxx...', ... }
```

## ⚠️ Common Mistakes

1. ❌ Updating only frontend variables (VITE_*)
   - ✅ Must update backend variables (ZOHO_*)

2. ❌ Copy-pasting with extra spaces
   - ✅ Trim all whitespace

3. ❌ Using old client credentials
   - ✅ Use NEW client: 1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW

4. ❌ Not waiting for deployment
   - ✅ Wait 2 minutes for Railway to redeploy

## 📋 Quick Checklist

- [ ] Railway variables updated with NEW client ID
- [ ] Railway variables updated with NEW client secret
- [ ] All 6 environment variables present
- [ ] Railway deployment completed
- [ ] `/api/config` returns correct values
- [ ] Railway logs show new client ID
- [ ] Browser cache cleared
- [ ] OAuth flow tested

## 🎯 Expected Result

After fixing, you should see:
```
ZohoCallback: Starting OAuth callback process
ZohoCallback: Code: Present
🔑 Getting access token with code: 1000.xxx...
📡 Calling proxy: /api/zoho/token
📥 Response status: 200 OK
📦 Received token data: { access_token: '1000.xxx...', ... }
✅ Token saved
✅ Successfully connected to Zoho Books!
```

---

**The issue is 100% that Railway still has the old client credentials. Update them and it will work immediately!**
