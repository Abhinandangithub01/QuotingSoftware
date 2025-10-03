# Zoho Books Integration Setup

## Environment Variables

Add these to your `.env` file:

```env
# Zoho OAuth Credentials
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REDIRECT_URI=https://your-domain.com/zoho/callback

# Zoho Configuration
ZOHO_API_DOMAIN=https://www.zohoapis.in
VITE_ZOHO_ORGANIZATION_ID=your_organization_id
```

## OAuth Flow

1. User clicks "Connect to Zoho Books" in Settings
2. Redirected to Zoho authorization page
3. After approval, redirected back to `/zoho/callback`
4. Tokens are exchanged and saved to localStorage
5. API calls use the access token automatically

## Token Management

- **Access Token**: Expires after 1 hour, auto-refreshes
- **Refresh Token**: Never expires (unless revoked)
- **Validation**: Multiple layers prevent invalid tokens

## Troubleshooting

Check browser console for:
- `🔍 Full Zoho response:` - Token exchange details
- `✅ Token saved` - Confirmation of storage
- `❌ CRITICAL:` - Validation errors

If issues persist, clear localStorage and re-authenticate.
