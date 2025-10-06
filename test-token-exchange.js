/**
 * Test script to manually exchange authorization code for tokens
 * This will help us debug the "Invalid client credentials" error
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const code = '1000.4d8469f6d3364e1adabbf3f21892616d.1020f5f541c0c84efb57d7ef39e66c45';
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const redirectUri = process.env.ZOHO_REDIRECT_URI;
const authUrl = 'https://accounts.zoho.in/oauth/v2/token';

console.log('🔍 Testing Token Exchange:');
console.log('  Auth URL:', authUrl);
console.log('  Client ID:', clientId);
console.log('  Client Secret:', clientSecret ? '✅ SET' : '❌ MISSING');
console.log('  Redirect URI:', redirectUri);
console.log('  Code:', code.substring(0, 30) + '...');
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
    
    if (data.error) {
      console.log('\n❌ Error:', data.error);
      console.log('   Description:', data.error_description || 'No description');
      
      if (data.error === 'invalid_client') {
        console.log('\n💡 Solution: The Client ID and/or Client Secret are incorrect.');
        console.log('   1. Go to https://api-console.zoho.in');
        console.log('   2. Find your "SQUAD Local" client');
        console.log('   3. Verify the Client ID matches:', clientId);
        console.log('   4. Regenerate Client Secret if needed');
      }
    } else if (data.access_token) {
      console.log('\n✅ SUCCESS! Tokens received:');
      console.log('   Access Token:', data.access_token.substring(0, 30) + '...');
      console.log('   Refresh Token:', data.refresh_token ? data.refresh_token.substring(0, 30) + '...' : 'Not provided');
      console.log('   Expires In:', data.expires_in, 'seconds');
      console.log('   API Domain:', data.api_domain);
    }
  })
  .catch(error => {
    console.error('❌ Network Error:', error.message);
  });
