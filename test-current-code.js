import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const code = '1000.fda7667ebd4223ba23fb374969e1eec3.d1182876fa2f15f8ca56a45b4d2df2fa';
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const redirectUri = process.env.ZOHO_REDIRECT_URI;
const authUrl = 'https://accounts.zoho.in/oauth/v2/token';

console.log('🔍 Testing Token Exchange:');
console.log('  Auth URL:', authUrl);
console.log('  Client ID:', clientId);
console.log('  Client Secret:', clientSecret);
console.log('  Redirect URI:', redirectUri);
console.log('  Code:', code);
console.log('');

const params = new URLSearchParams({
  grant_type: 'authorization_code',
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: redirectUri,
  code: code
});

console.log('📤 Sending request to Zoho...\n');

fetch(authUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params.toString()
})
  .then(res => res.json())
  .then(data => {
    console.log('📥 Response from Zoho:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    
    if (data.error) {
      console.log('❌ Error:', data.error);
      if (data.error === 'invalid_client') {
        console.log('\n💡 CLIENT ID OR SECRET IS WRONG!');
        console.log('   Go to https://api-console.zoho.in');
        console.log('   Find "SQUAD Local" client');
        console.log('   Click "Client Secret" tab');
        console.log('   Copy the EXACT values and update .env');
      }
    } else if (data.access_token) {
      console.log('✅ SUCCESS! Tokens received!');
      console.log('\nAccess Token:', data.access_token);
      console.log('Refresh Token:', data.refresh_token);
      console.log('');
      console.log('Save these tokens - the OAuth flow is WORKING!');
    }
  })
  .catch(error => {
    console.error('❌ Network Error:', error.message);
  });
