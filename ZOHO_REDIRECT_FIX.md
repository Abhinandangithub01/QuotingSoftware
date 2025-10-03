# 🔧 Zoho Redirect URI Fix

## The Problem

"Invalid Redirect Uri - Redirect URI passed does not match with the one configured"

## Root Cause Analysis

Looking at your Railway variables, I see:
```
VITE_ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/auth/callback
ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/auth/callback
```

## Possible Issues:

### 1. Railway Domain Mismatch
Your actual Railway domain might be different. Check:
- Go to Railway → Settings → Networking
- Look at the actual domain (might be different from `quotingsoftware-production.up.railway.app`)

### 2. Zoho API Console Not Updated
The redirect URI in Zoho API Console must EXACTLY match.

## Step-by-Step Fix:

### Step 1: Get Your Actual Railway URL

1. Open your Railway app in browser
2. Copy the EXACT URL from the address bar
3. It should be something like:
   - `https://quotingsoftware-production.up.railway.app`
   - OR `https://quotingsoftware-production-xxxx.up.railway.app`
   - OR a custom domain

### Step 2: Update Zoho API Console

1. Go to: https://api-console.zoho.in
2. Click on your application (SQUAD)
3. Click "Edit" or go to "Client Details"
4. Find "Authorized Redirect URIs"
5. Add EXACTLY (copy-paste):
   ```
   https://YOUR-EXACT-RAILWAY-URL/auth/callback
   ```
6. Click "Update"

### Step 3: Update Railway Variables

Make sure these match your actual Railway URL:

```
VITE_ZOHO_REDIRECT_URI=https://YOUR-EXACT-RAILWAY-URL/auth/callback
ZOHO_REDIRECT_URI=https://YOUR-EXACT-RAILWAY-URL/auth/callback
```

### Step 4: Test Config Endpoint

Open in browser:
```
https://YOUR-RAILWAY-URL/api/config
```

Check that `VITE_ZOHO_REDIRECT_URI` shows the correct URL.

### Step 5: Verify in Browser Console

When you click "Connect Now", open browser console and run:
```javascript
fetch('/api/config').then(r => r.json()).then(config => {
  console.log('Redirect URI being used:', config.VITE_ZOHO_REDIRECT_URI)
})
```

This will show you exactly what redirect URI the app is sending to Zoho.

## Common Mistakes:

❌ **Wrong**: `http://` (must be `https://`)  
❌ **Wrong**: Missing `/auth/callback` at the end  
❌ **Wrong**: Extra trailing slash: `/auth/callback/`  
❌ **Wrong**: Different subdomain  

✅ **Correct**: `https://quotingsoftware-production.up.railway.app/auth/callback`

## Quick Test:

1. Copy your Railway URL from browser
2. Add `/auth/callback` to it
3. That's your redirect URI
4. Add it to Zoho API Console
5. Update Railway variables
6. Redeploy
7. Try again

## If Still Not Working:

### Check Zoho API Console Shows:

**Homepage URL**: `https://YOUR-RAILWAY-URL`  
**Authorized Redirect URIs**: `https://YOUR-RAILWAY-URL/auth/callback`

Both must match EXACTLY (including https, no trailing slash on homepage, with /auth/callback on redirect).

## Final Checklist:

- [ ] Railway URL is correct (check browser address bar)
- [ ] Zoho API Console has the exact redirect URI
- [ ] Railway variables match the URL
- [ ] No typos (https not http, correct domain)
- [ ] Redeployed after changing variables
- [ ] Tested /api/config endpoint

**The redirect URI must match EXACTLY in all three places: Zoho Console, Railway Variables, and what the app sends!**
