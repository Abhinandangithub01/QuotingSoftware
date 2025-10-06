# Zoho Self Client Setup (Alternative Approach)

## What is Self Client?

Self Client is a simpler authentication method where you generate tokens directly from Zoho Developer Console without needing OAuth redirect flows. **Best for testing and single-user applications.**

## Steps to Set Up Self Client

### 1. Create Self Client

1. Go to [Zoho Developer Console (India)](https://api-console.zoho.in/)
2. Click **"Add Client"**
3. Select **"Self Client"**
4. Click **"Create Now"**
5. Click **"OK"** in the popup

### 2. Get Client ID and Secret

1. Go to the **"Client Secret"** tab
2. Copy your **Client ID** and **Client Secret**

### 3. Generate Grant Token

1. Go to the **"Generate Code"** tab
2. Enter the scope: `ZohoBooks.fullaccess.all`
3. Select time duration: **10 minutes** (or longer for testing)
4. Enter description: `Testing Venezia App`
5. Click **"Create"**
6. **Copy the generated code immediately** (it expires!)

### 4. Exchange Grant Token for Access/Refresh Tokens

Run this command with your grant token:

```bash
node exchange-self-client-token.js YOUR_GRANT_TOKEN_HERE
```

This will give you:
- **Access Token** (expires in 1 hour)
- **Refresh Token** (permanent, used to get new access tokens)

### 5. Store Tokens

The tokens will be automatically saved to `.env` file and you can start using the app!

## Advantages of Self Client

✅ No redirect URI needed  
✅ No OAuth flow complexity  
✅ Perfect for single-user/organization apps  
✅ Tokens generated directly from console  

## Disadvantages

❌ Not suitable for multi-user SaaS applications  
❌ Manual token generation required initially  
❌ Grant token expires quickly (need to regenerate)  

## When to Use Which Approach?

- **Self Client**: Testing, single organization, internal tools
- **OAuth Flow**: Production, multi-user SaaS, public applications

## Current Status

Your current OAuth flow setup is **correct**. The "invalid_client" error was resolved. You just need to complete the OAuth flow quickly (within 2 minutes of authorization) to avoid code expiration.
