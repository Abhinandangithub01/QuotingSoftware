import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const code = '1000.b91511ed29e455c940b7733909633f72.e38280f1b4d5bfb1d0918bbae547f6a8';
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const redirectUri = process.env.ZOHO_REDIRECT_URI;
const authUrl = 'https://accounts.zoho.in/oauth/v2/token';

const params = new URLSearchParams({
  grant_type: 'authorization_code',
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: redirectUri,
  code: code
});

console.log('Testing with new code...\n');

fetch(authUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params.toString()
})
  .then(res => res.json())
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
    if (data.access_token) {
      console.log('\n✅ SUCCESS! Tokens received!');
    } else {
      console.log('\n❌ Error:', data.error);
    }
  });
