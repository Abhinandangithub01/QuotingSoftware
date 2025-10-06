/**
 * Comprehensive Zoho Setup Verification
 * This script will help identify the exact issue
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('═══════════════════════════════════════════════════════════');
console.log('           ZOHO SETUP VERIFICATION');
console.log('═══════════════════════════════════════════════════════════\n');

const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const redirectUri = process.env.ZOHO_REDIRECT_URI;
const apiDomain = process.env.ZOHO_API_DOMAIN;

console.log('📋 Environment Variables:');
console.log('  ✓ ZOHO_CLIENT_ID:', clientId);
console.log('  ✓ ZOHO_CLIENT_SECRET:', clientSecret ? `SET (${clientSecret.length} chars)` : '❌ NOT SET');
console.log('  ✓ ZOHO_REDIRECT_URI:', redirectUri);
console.log('  ✓ ZOHO_API_DOMAIN:', apiDomain);
console.log('');

// Determine data center
const isIndia = apiDomain?.includes('.in');
const dataCenter = isIndia ? 'INDIA (.in)' : 'US (.com)';
const authUrl = isIndia ? 'https://accounts.zoho.in' : 'https://accounts.zoho.com';
const consoleUrl = isIndia ? 'https://api-console.zoho.in' : 'https://api-console.zoho.com';

console.log('🌍 Data Center Detection:');
console.log('  ✓ Detected:', dataCenter);
console.log('  ✓ Auth URL:', authUrl);
console.log('  ✓ API Console:', consoleUrl);
console.log('');

console.log('⚠️  CRITICAL CHECKS:');
console.log('');

// Check 1: Client ID format
if (clientId && clientId.startsWith('1000.')) {
  console.log('  ✅ Client ID format is valid');
} else {
  console.log('  ❌ Client ID format is invalid (should start with "1000.")');
}

// Check 2: Redirect URI
if (redirectUri === 'http://localhost:5173/zoho/callback') {
  console.log('  ✅ Redirect URI is correct for local development');
} else {
  console.log('  ⚠️  Redirect URI:', redirectUri);
}

// Check 3: Client Secret length
if (clientSecret && clientSecret.length >= 30) {
  console.log('  ✅ Client Secret length looks valid');
} else {
  console.log('  ❌ Client Secret is too short or missing');
}

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('           IMPORTANT INSTRUCTIONS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('🔍 To fix "Invalid client credentials" error:\n');
console.log(`1. Go to: ${consoleUrl}`);
console.log('2. Find your "SQUAD Local" client');
console.log('3. Verify the Client ID matches:', clientId);
console.log('4. If it doesn\'t match, you have TWO options:\n');
console.log('   Option A: Update .env with the correct Client ID/Secret from Zoho Console');
console.log('   Option B: Create a NEW client with these exact settings:\n');
console.log('      - Client Type: Server-based Applications');
console.log('      - Authorized Redirect URI:', redirectUri);
console.log('      - Then update .env with the new credentials\n');
console.log('5. Make sure you\'re on the CORRECT console:');
console.log(`   ✓ You MUST use: ${consoleUrl}`);
console.log(`   ✗ Do NOT use: ${isIndia ? 'https://api-console.zoho.com' : 'https://api-console.zoho.in'}\n`);
console.log('═══════════════════════════════════════════════════════════\n');
