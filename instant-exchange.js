import fetch from 'node-fetch';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 INSTANT TOKEN EXCHANGE TOOL\n');
console.log('Paste your callback URL and press Enter:\n');

rl.question('Callback URL: ', async (callbackUrl) => {
  try {
    const url = new URL(callbackUrl);
    const code = url.searchParams.get('code');
    
    if (!code) {
      console.error('❌ No code found in URL!');
      rl.close();
      return;
    }
    
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const redirectUri = process.env.ZOHO_REDIRECT_URI;
    
    console.log('\n📤 Exchanging with these credentials:');
    console.log('   Client ID:', clientId);
    console.log('   Client Secret:', clientSecret);
    console.log('   Redirect URI:', redirectUri);
    console.log('   Code:', code.substring(0, 30) + '...');
    console.log('\n⏳ Sending request to Zoho...\n');
    
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code
    });
    
    const response = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    
    const data = await response.json();
    
    console.log('📥 Response:', JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.log('\n❌ ERROR:', data.error);
      if (data.error === 'invalid_client') {
        console.log('\n🔍 The Client ID or Secret is WRONG!');
        console.log('   Go to https://api-console.zoho.in');
        console.log('   Copy the EXACT credentials and update .env\n');
      }
    } else if (data.access_token) {
      console.log('\n✅ SUCCESS! Tokens received!');
      console.log('   Storing in localStorage...\n');
      
      console.log('Copy this into your browser console at http://localhost:5173:\n');
      console.log('─────────────────────────────────────────────────────────────');
      console.log(`localStorage.setItem('zoho_access_token', '${data.access_token}');`);
      console.log(`localStorage.setItem('zoho_refresh_token', '${data.refresh_token}');`);
      console.log(`localStorage.setItem('zoho_token_expiry', '${Date.now() + 3600000}');`);
      console.log(`localStorage.setItem('zoho_api_domain', 'https://www.zohoapis.in');`);
      console.log(`localStorage.setItem('zoho_token_type', 'Bearer');`);
      console.log(`localStorage.setItem('zoho_token_created_at', '${Date.now()}');`);
      console.log(`location.reload();`);
      console.log('─────────────────────────────────────────────────────────────\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
});
