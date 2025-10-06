# 🚨 Railway Environment Variables - VERIFICATION REQUIRED

## Current Issue
**"Invalid client credentials"** error means Railway environment variables are NOT updated with the new Zoho client.

## ✅ IMMEDIATE ACTION: Verify Railway Variables

### 1. Go to Railway Dashboard
https://railway.app/project/your-project/variables

### 2. Check These 6 Variables Exist:

```env
NODE_ENV=production
ZOHO_CLIENT_ID=1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW
ZOHO_CLIENT_SECRET=553c38ec51680afcd74e1ad60b3d912ffb19fb12b6
ZOHO_API_DOMAIN=https://www.zohoapis.in
ZOHO_REDIRECT_URI=https://quotingsoftware-production.up.railway.app/zoho/callback
VITE_ZOHO_ORGANIZATION_ID=60050102326
```

### 3. Verify Each Variable

| Variable | Expected Value | Status |
|----------|---------------|--------|
| `NODE_ENV` | `production` | ☐ |
| `ZOHO_CLIENT_ID` | `1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW` | ☐ |
| `ZOHO_CLIENT_SECRET` | `553c38ec51680afcd74e1ad60b3d912ffb19fb12b6` | ☐ |
| `ZOHO_API_DOMAIN` | `https://www.zohoapis.in` | ☐ |
| `ZOHO_REDIRECT_URI` | `https://quotingsoftware-production.up.railway.app/zoho/callback` | ☐ |
| `VITE_ZOHO_ORGANIZATION_ID` | `60050102326` | ☐ |

### 4. Common Mistakes

❌ **Only updated VITE_ZOHO_CLIENT_ID** (frontend only)
   → Must update `ZOHO_CLIENT_ID` (backend)

❌ **Copy-pasted with extra spaces/quotes**
   → Values should be plain text, no quotes

❌ **Old client ID still there**
   → Must be: `1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW`
   → NOT: `1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS`

❌ **Didn't wait for deployment**
   → Wait 2 minutes after saving variables

### 5. Verification Steps

#### A. Check Config Endpoint
```bash
curl https://quotingsoftware-production.up.railway.app/api/config
```

**Expected Response:**
```json
{
  "VITE_ZOHO_CLIENT_ID": "1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW",
  "VITE_ZOHO_REDIRECT_URI": "https://quotingsoftware-production.up.railway.app/zoho/callback",
  "VITE_ZOHO_ORGANIZATION_ID": "60050102326",
  "VITE_ZOHO_API_DOMAIN": "https://www.zohoapis.in"
}
```

#### B. Check Railway Logs

Look for server startup logs:
```
🔐 Server Configuration:
  Client ID: 1000.8KKXLK4BLVQ2J9...  ← Should start with 8KKXLK
  Client Secret: ✅ SET (hidden)
  Redirect URI: https://quotingsoftware-production.up.railway.app/zoho/callback
```

**If you see:**
```
Client ID: 1000.K4Q0VI1JZ7QNI4...  ← Old client! Update needed!
```

Then Railway variables are NOT updated!

### 6. How to Update Variables

1. Go to Railway → Your Project → **Variables** tab
2. Find `ZOHO_CLIENT_ID` variable
3. Click **Edit** (pencil icon)
4. Replace old value with: `1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW`
5. Click **Save**
6. Repeat for `ZOHO_CLIENT_SECRET`: `553c38ec51680afcd74e1ad60b3d912ffb19fb12b6`
7. Wait 2 minutes for auto-deployment

### 7. Test After Update

1. Clear browser cache (Ctrl+Shift+Delete → All time)
2. Go to: https://quotingsoftware-production.up.railway.app/settings
3. Click "Connect to Zoho Books"
4. Complete authorization

**Expected Result:**
```
✅ Token exchange successful
📦 Token data: { access_token: '1000.xxx...', ... }
✅ Successfully connected to Zoho Books!
```

**If Still Failing:**
Check Railway logs for the EXACT error from Zoho:
```
❌ Zoho returned error: {
  error: 'invalid_client',
  error_description: 'Client authentication failed'
}
```

This confirms the credentials don't match.

## 🔍 How to Know If Variables Are Updated

### Method 1: Check Logs
Railway logs will show the first 20 characters of Client ID:
- ✅ `1000.8KKXLK4BLVQ2J9...` = NEW client (correct)
- ❌ `1000.K4Q0VI1JZ7QNI4...` = OLD client (wrong)

### Method 2: Test OAuth
If OAuth works → Variables updated ✅
If "invalid_client" error → Variables NOT updated ❌

### Method 3: Check /api/config
```bash
curl https://quotingsoftware-production.up.railway.app/api/config | grep ZOHO_CLIENT_ID
```

Should show: `"VITE_ZOHO_CLIENT_ID":"1000.8KKXLK4BLVQ2J9P7TF31LSHIYDSBQW"`

## 📋 Checklist

Before testing again:

- [ ] Railway variables updated with NEW client ID
- [ ] Railway variables updated with NEW client secret  
- [ ] Railway deployment completed (check logs)
- [ ] /api/config returns new client ID
- [ ] Railway logs show new client ID (8KKXLK...)
- [ ] Browser cache cleared completely
- [ ] Zoho API Console has correct redirect URI

Only proceed with OAuth test after ALL checkboxes are ✅

---

**The code is correct. The issue is 100% Railway environment variables not being updated.**

Update them and it will work immediately!
