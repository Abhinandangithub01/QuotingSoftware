/**
 * Comprehensive OAuth Diagnostics
 * This will test the EXACT OAuth flow with Zoho
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('═══════════════════════════════════════════════════════════');
console.log('           ZOHO OAUTH DIAGNOSTIC TOOL');
console.log('═══════════════════════════════════════════════════════════\n');

const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const redirectUri = process.env.ZOHO_REDIRECT_URI;
const apiDomain = process.env.ZOHO_API_DOMAIN;

console.log('Current Configuration:');
console.log('  Client ID:', clientId);
console.log('  Client Secret:', clientSecret);
console.log('  Redirect URI:', redirectUri);
console.log('  API Domain:', apiDomain);
console.log('');

const authUrl = apiDomain?.includes('.in') 
  ? 'https://accounts.zoho.in/oauth/v2'
  : 'https://accounts.zoho.com/oauth/v2';

console.log('  Auth URL:', authUrl);
console.log('');

// Step 1: Generate authorization URL
const authParams = new URLSearchParams({
  scope: 'ZohoBooks.fullaccess.all',
  client_id: clientId,
  response_type: 'code',
  redirect_uri: redirectUri,
  access_type: 'offline',
  prompt: 'consent',
  state: 'zoho_oauth'
});

const authorizationUrl = `${authUrl}/auth?${authParams.toString()}`;

console.log('Step 1: Authorization URL Generated');
console.log('─────────────────────────────────────────────────────────');
console.log(authorizationUrl);
console.log('─────────────────────────────────────────────────────────');
console.log('');
console.log('INSTRUCTIONS:');
console.log('1. Copy the URL above');
console.log('2. Open it in your browser');
console.log('3. Click "Accept" to authorize');
console.log('4. After redirect, copy the ENTIRE callback URL');
console.log('5. Paste it here');
console.log('');

rl.question('Paste the callback URL here: ', async (callbackUrl) => {
  try {
    // Extract code from callback URL
    const url = new URL(callbackUrl);
    const code = url.searchParams.get('code');
    const location = url.searchParams.get('location');
    const accountsServer = url.searchParams.get('accounts-server');
    
    console.log('');
    console.log('Step 2: Analyzing Callback');
    console.log('─────────────────────────────────────────────────────────');
    console.log('  Code:', code?.substring(0, 30) + '...');
    console.log('  Location:', location);
    console.log('  Accounts Server:', accountsServer);
    console.log('─────────────────────────────────────────────────────────');
    console.log('');
    
    if (!code) {
      console.error('❌ No authorization code found in URL!');
      rl.close();
      return;
    }
    
    // Verify data center match
    if (location === 'in' && !apiDomain.includes('.in')) {
      console.error('⚠️  WARNING: Data center mismatch!');
      console.error('   User is in India (.in) but API domain is', apiDomain);
    }
    
    console.log('Step 3: Exchanging Code for Tokens');
    console.log('─────────────────────────────────────────────────────────');
    
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code
    });
    
    console.log('Request Details:');
    console.log('  URL:', `${authUrl}/token`);
    console.log('  Method: POST');
    console.log('  Content-Type: application/x-www-form-urlencoded');
    console.log('  Body:');
    console.log('    grant_type: authorization_code');
    console.log('    client_id:', clientId);
    console.log('    client_secret:', clientSecret);
    console.log('    redirect_uri:', redirectUri);
    console.log('    code:', code.substring(0, 30) + '...');
    console.log('');
    console.log('Sending request...');
    console.log('');
    
    const response = await fetch(`${authUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenParams.toString()
    });
    
    const data = await response.json();
    
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Body:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    
    if (data.error) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('           ERROR ANALYSIS');
      console.log('═══════════════════════════════════════════════════════════\n');
      
      if (data.error === 'invalid_client') {
        console.log('❌ Error: INVALID CLIENT CREDENTIALS');
        console.log('');
        console.log('This means:');
        console.log('1. The Client ID and/or Client Secret are incorrect');
        console.log('2. OR they were created in a different data center');
        console.log('');
        console.log('Solutions:');
        console.log(`1. Go to ${accountsServer ? accountsServer.replace('/oauth/v2', '') : authUrl.replace('/oauth/v2', '')}`);
        console.log('2. Go to API Console: ' + (location === 'in' ? 'https://api-console.zoho.in' : 'https://api-console.zoho.com'));
        console.log('3. Find "SQUAD Local" client');
        console.log('4. Go to "Client Secret" tab');
        console.log('5. Copy the EXACT Client ID and Secret');
        console.log('6. Update your .env file with these values');
        console.log('');
        console.log('Current values in .env:');
        console.log('  ZOHO_CLIENT_ID=' + clientId);
        console.log('  ZOHO_CLIENT_SECRET=' + clientSecret);
        
      } else if (data.error === 'invalid_code') {
        console.log('❌ Error: INVALID OR EXPIRED CODE');
        console.log('');
        console.log('The authorization code expired (valid for only 2 minutes)');
        console.log('OR it was already used.');
        console.log('');
        console.log('Solution: Run this script again and complete it within 2 minutes.');
        
      } else if (data.error === 'redirect_uri_mismatch') {
        console.log('❌ Error: REDIRECT URI MISMATCH');
        console.log('');
        console.log('The redirect_uri in the request does not match Zoho Console.');
        console.log('');
        console.log('Current redirect_uri:', redirectUri);
        console.log('');
        console.log('Solution:');
        console.log('1. Go to https://api-console.zoho.in');
        console.log('2. Edit "SQUAD Local" client');
        console.log('3. Under "Authorized Redirect URIs", make sure it includes:');
        console.log('   ' + redirectUri);
      }
      
    } else if (data.access_token) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('           ✅ SUCCESS!');
      console.log('═══════════════════════════════════════════════════════════\n');
      
      console.log('Access Token:', data.access_token);
      console.log('Refresh Token:', data.refresh_token);
      console.log('Expires In:', data.expires_in, 'seconds');
      console.log('API Domain:', data.api_domain);
      console.log('');
      console.log('✅ Your OAuth setup is CORRECT!');
      console.log('✅ The credentials in your .env file are VALID!');
      console.log('');
      console.log('The issue was likely:');
      console.log('- Authorization code expiring (codes expire in 2 minutes)');
      console.log('- OR the code was already used');
      console.log('');
      console.log('Your app should work now. Try the OAuth flow from the UI.');
    }
    
  } catch (error) {
    console.error('');
    console.error('❌ Unexpected Error:', error.message);
    console.error(error.stack);
  } finally {
    rl.close();
  }
});
