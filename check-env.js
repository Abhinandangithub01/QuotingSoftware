import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables Check:');
console.log('ZOHO_CLIENT_ID:', process.env.ZOHO_CLIENT_ID);
console.log('ZOHO_CLIENT_SECRET:', process.env.ZOHO_CLIENT_SECRET ? 'SET (length: ' + process.env.ZOHO_CLIENT_SECRET.length + ')' : 'NOT SET');
console.log('ZOHO_REDIRECT_URI:', process.env.ZOHO_REDIRECT_URI);
console.log('ZOHO_API_DOMAIN:', process.env.ZOHO_API_DOMAIN);
console.log('PORT:', process.env.PORT);
