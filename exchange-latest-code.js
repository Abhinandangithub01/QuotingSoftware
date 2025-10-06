import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const code = '1000.aed8b8f2d763eec78ed249c1030758c3.c84ae7b21011fc5e780610572f6cb8b6';
const params = new URLSearchParams({
  grant_type: 'authorization_code',
  client_id: process.env.ZOHO_CLIENT_ID,
  client_secret: process.env.ZOHO_CLIENT_SECRET,
  redirect_uri: process.env.ZOHO_REDIRECT_URI,
  code: code
});

fetch('https://accounts.zoho.in/oauth/v2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params.toString()
})
.then(res => res.json())
.then(data => {
  console.log('\n' + JSON.stringify(data, null, 2));
  if (data.access_token) {
    console.log('\n✅ TOKENS RECEIVED!\n');
    console.log('Copy and paste this in your browser console at http://localhost:5173:\n');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`localStorage.setItem('zoho_access_token', '${data.access_token}');`);
    console.log(`localStorage.setItem('zoho_refresh_token', '${data.refresh_token}');`);
    console.log(`localStorage.setItem('zoho_token_expiry', '${Date.now() + 3600000}');`);
    console.log(`localStorage.setItem('zoho_api_domain', 'https://www.zohoapis.in');`);
    console.log(`localStorage.setItem('zoho_token_type', 'Bearer');`);
    console.log(`localStorage.setItem('zoho_token_created_at', '${Date.now()}');`);
    console.log(`console.log('✅ Tokens stored! Refresh the page.');`);
    console.log('─────────────────────────────────────────────────────────────\n');
  }
});
