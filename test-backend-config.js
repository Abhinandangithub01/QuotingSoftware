import dotenv from 'dotenv';
dotenv.config();

console.log('\n🔍 Backend Server Configuration:\n');
console.log('ZOHO_CLIENT_ID:', process.env.ZOHO_CLIENT_ID);
console.log('ZOHO_CLIENT_SECRET:', process.env.ZOHO_CLIENT_SECRET);
console.log('ZOHO_REDIRECT_URI:', process.env.ZOHO_REDIRECT_URI);
console.log('ZOHO_API_DOMAIN:', process.env.ZOHO_API_DOMAIN);
console.log('\n');

// Test with the code from the URL
const code = '1000.d76fa8d04d9da68a8fhf267c6a55eb79b.9e1a97334285d35bfcc34dc6046234218';

const authUrl = 'https://accounts.zoho.in/oauth/v2/token';
const params = new URLSearchParams({
  grant_type: 'authorization_code',
  client_id: process.env.ZOHO_CLIENT_ID,
  client_secret: process.env.ZOHO_CLIENT_SECRET,
  redirect_uri: process.env.ZOHO_REDIRECT_URI,
  code: code
});

console.log('🔄 Would send to Zoho:');
console.log('  URL:', authUrl);
console.log('  client_id:', process.env.ZOHO_CLIENT_ID);
console.log('  client_secret:', process.env.ZOHO_CLIENT_SECRET);
console.log('  redirect_uri:', process.env.ZOHO_REDIRECT_URI);
console.log('\n');

// Verify these match what you see in Zoho Console
console.log('✅ Verify these credentials match your "SQUAD Local" client in https://api-console.zoho.in\n');
