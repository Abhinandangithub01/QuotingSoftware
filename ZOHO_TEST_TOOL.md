# 🔐 Zoho OAuth Test Tool

A simple single-page HTML tool to test and debug your Zoho Books OAuth integration locally.

## 🚀 Quick Start

### 1. Start the Server

```bash
node server.js
```

The server will start on `http://localhost:3001`

### 2. Open the Test Page

Open your browser and navigate to:
```
http://localhost:3001/zoho-test.html
```

### 3. Configure Your Credentials

1. **Select Region**: Choose your Zoho region (India, US, Europe, or Australia)
2. **Enter Client ID**: From your Zoho API Console
3. **Enter Client Secret**: From your Zoho API Console
4. **Set Redirect URI**: Use `http://localhost:3001/callback`
5. **Organization ID**: (Optional) For testing API calls
6. Click **Save Configuration**

### 4. Update Zoho API Console

Go to [Zoho API Console](https://api-console.zoho.in/) and:

1. Select your client application
2. Go to **Client Secret** tab
3. Under **Authorized Redirect URIs**, add:
   ```
   http://localhost:3001/callback
   ```
4. Click **Update**

### 5. Test OAuth Flow

1. Click **Start OAuth Flow** - A new window will open
2. Authorize the application in Zoho
3. You'll be redirected back to the test page
4. Click **Handle Callback** to exchange the code for tokens
5. Click **Show Tokens** to see your access and refresh tokens

## 🔍 Features

### Configuration Management
- Save and load credentials locally
- Support for all Zoho regions
- Secure credential storage in browser

### OAuth Testing
- **Start OAuth Flow**: Initiates the authorization process
- **Handle Callback**: Exchanges authorization code for tokens
- **Test Token Refresh**: Tests the refresh token flow
- **Show Tokens**: Displays current tokens and expiry
- **Clear Tokens**: Removes all stored tokens

### API Testing
- Test actual Zoho Books API calls
- Verify token validity
- Debug API responses

### Detailed Logging
- Real-time logs of all operations
- Color-coded success/error messages
- Full request/response details

## 🐛 Debugging Common Issues

### "Invalid client credentials"

**Cause**: Client ID or Secret doesn't match Zoho API Console

**Solution**:
1. Go to Zoho API Console
2. Copy the **exact** Client ID and Secret
3. Paste into the test tool
4. Make sure there are no extra spaces
5. Save configuration and try again

### "Redirect URI mismatch"

**Cause**: The redirect URI in your request doesn't match Zoho API Console

**Solution**:
1. In test tool, use: `http://localhost:3001/callback`
2. In Zoho API Console, add the **exact** same URI
3. No trailing slashes
4. Must match exactly (including http/https)

### "Invalid code"

**Cause**: Authorization code expired or already used

**Solution**:
1. Authorization codes expire in ~60 seconds
2. Can only be used once
3. Start a new OAuth flow

### "No access token in response"

**Cause**: OAuth flow didn't complete successfully

**Solution**:
1. Check the logs for detailed error messages
2. Verify all credentials are correct
3. Ensure redirect URI matches exactly
4. Try the flow again

## 📋 Logs Explained

The tool provides detailed logs for every operation:

- **🚀 Blue (Info)**: General information and progress
- **✅ Green (Success)**: Successful operations
- **❌ Red (Error)**: Errors and failures
- **⚠️ Yellow (Warning)**: Warnings and notices

## 🔐 Security Notes

1. **Never commit credentials**: The test tool stores credentials in browser localStorage
2. **Use only for testing**: This is a development tool, not for production
3. **Clear tokens**: Use "Clear Tokens" when done testing
4. **Client Secret**: Keep your client secret secure

## 💡 Tips

1. **Save Configuration**: Click "Save Configuration" to persist your settings
2. **Check Logs**: Always check the logs for detailed error messages
3. **Copy Tokens**: Use "Show Tokens" to copy tokens for testing elsewhere
4. **Test API**: Use the "Test API Call" feature to verify tokens work
5. **Refresh Test**: Test token refresh to ensure it works before expiry

## 🔄 Typical Workflow

1. Configure credentials → Save
2. Start OAuth Flow → Authorize in Zoho
3. Handle Callback → Get tokens
4. Show Tokens → Verify tokens received
5. Test API Call → Confirm tokens work
6. Test Refresh → Verify refresh works

## 📞 Still Having Issues?

If you're still getting errors:

1. **Check the detailed logs** - They show exact request/response
2. **Verify in Zoho Console**:
   - Client ID matches exactly
   - Client Secret matches exactly
   - Redirect URI is added and matches exactly
   - Scopes include `ZohoBooks.fullaccess.all`
3. **Try a fresh OAuth flow** - Clear tokens and start over
4. **Check server logs** - The Node.js server also logs detailed info

## 🎯 What This Tool Tests

✅ OAuth authorization URL generation  
✅ Authorization code exchange  
✅ Token storage and retrieval  
✅ Token refresh flow  
✅ API authentication  
✅ Credential validation  
✅ Error handling  

This tool helps you verify your Zoho integration works **before** deploying to production!
