const clientId = '1000.1AXLMPAFYOJ2AM5ZPERK0NH51P4EBR';
const redirectUri = 'http://localhost:5173/zoho/callback';
const authUrl = 'https://accounts.zoho.in/oauth/v2/auth';

const params = new URLSearchParams({
  scope: 'ZohoBooks.fullaccess.all',
  client_id: clientId,
  response_type: 'code',
  redirect_uri: redirectUri,
  access_type: 'offline',
  prompt: 'consent',
  state: 'zoho_oauth'
});

const fullUrl = `${authUrl}?${params.toString()}`;

console.log('\n🔗 Authorization URL:\n');
console.log(fullUrl);
console.log('\n📋 Copy this URL, paste in browser, authorize, then paste the callback URL back here.\n');
