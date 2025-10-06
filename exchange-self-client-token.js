/**
 * Exchange Self Client Grant Token for Access and Refresh Tokens
 * Usage: node exchange-self-client-token.js YOUR_GRANT_TOKEN
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const grantToken = process.argv[2];

if (!grantToken) {
  console.error('❌ Error: Grant token is required');
  console.log('\nUsage: node exchange-self-client-token.js YOUR_GRANT_TOKEN');
  console.log('\nTo get a grant token:');
  console.log('1. Go to https://api-console.zoho.in');
  console.log('2. Select your Self Client');
  console.log('3. Go to "Generate Code" tab');
  console.log('4. Enter scope: ZohoBooks.fullaccess.all');
  console.log('5. Click "Create" and copy the code');
  process.exit(1);
}

const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const authUrl = 'https://accounts.zoho.in/oauth/v2/token';

console.log('🔍 Exchanging Self Client Grant Token:');
console.log('  Auth URL:', authUrl);
console.log('  Client ID:', clientId);
console.log('  Client Secret:', clientSecret ? '✅ SET' : '❌ MISSING');
console.log('  Grant Token:', grantToken.substring(0, 30) + '...');
console.log('');

const params = new URLSearchParams({
  grant_type: 'authorization_code',
  client_id: clientId,
  client_secret: clientSecret,
  code: grantToken
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
      console.log('   Description:', data.error_description || 'No description');
      
      if (data.error === 'invalid_code') {
        console.log('\n💡 The grant token has expired or is invalid.');
        console.log('   Generate a new one from https://api-console.zoho.in');
      } else if (data.error === 'invalid_client') {
        console.log('\n💡 Client ID or Secret is incorrect.');
        console.log('   Verify credentials in .env file match Zoho Console');
      }
      process.exit(1);
    } else if (data.access_token) {
      console.log('✅ SUCCESS! Tokens received:\n');
      console.log('Access Token:', data.access_token);
      console.log('Refresh Token:', data.refresh_token || 'Not provided');
      console.log('Expires In:', data.expires_in, 'seconds');
      console.log('API Domain:', data.api_domain);
      console.log('');
      
      // Save tokens to a file for easy access
      const tokensFile = '.zoho-tokens.json';
      const tokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        api_domain: data.api_domain,
        token_type: data.token_type || 'Bearer',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + (data.expires_in * 1000)).toISOString()
      };
      
      fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2));
      console.log(`💾 Tokens saved to ${tokensFile}`);
      console.log('');
      console.log('📝 Next steps:');
      console.log('1. Copy the refresh token above');
      console.log('2. Store it securely (it never expires)');
      console.log('3. Use it to generate new access tokens when needed');
      console.log('');
      console.log('🚀 You can now use these tokens in your application!');
      console.log('   The access token will expire in', Math.floor(data.expires_in / 60), 'minutes');
    }
  })
  .catch(error => {
    console.error('❌ Network Error:', error.message);
    process.exit(1);
  });
