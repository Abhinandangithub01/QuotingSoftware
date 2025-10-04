# Venezia Quoting System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Zoho Books account
- Railway account (for deployment)

### Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/Abhinandangithub01/QuotingSoftware.git
   cd QuotingSoftware
   npm install
   ```

2. **Configure Environment**
   
   Create `.env` file:
   ```env
   # Zoho OAuth Credentials
   ZOHO_CLIENT_ID=your_client_id
   ZOHO_CLIENT_SECRET=your_client_secret
   ZOHO_REDIRECT_URI=http://localhost:5173/zoho/callback
   ZOHO_API_DOMAIN=https://www.zohoapis.in
   
   # Frontend (with VITE_ prefix)
   VITE_ZOHO_CLIENT_ID=your_client_id
   VITE_ZOHO_REDIRECT_URI=http://localhost:5173/zoho/callback
   VITE_ZOHO_ORGANIZATION_ID=your_org_id
   VITE_ZOHO_API_DOMAIN=https://www.zohoapis.in
   
   # Server
   NODE_ENV=development
   PORT=3001
   ```

3. **Run Development Servers**
   ```bash
   npm run dev:full
   ```
   
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 🔗 Zoho Integration Setup

### 1. Create Zoho OAuth Client

1. Go to [Zoho API Console](https://api-console.zoho.in/)
2. Click "Add Client" → "Server-based Applications"
3. Fill in:
   - **Client Name**: Venezia Quoting System
   - **Homepage URL**: Your domain
   - **Authorized Redirect URIs**:
     ```
     http://localhost:5173/zoho/callback
     https://your-domain.com/zoho/callback
     ```
4. Copy Client ID and Client Secret

### 2. Get Organization ID

1. Login to [Zoho Books](https://books.zoho.in/)
2. Go to Settings → Organization
3. Copy Organization ID

## 🚂 Railway Deployment

### 1. Connect Repository

1. Go to [Railway](https://railway.app/)
2. New Project → Deploy from GitHub
3. Select your repository

### 2. Configure Environment Variables

Add these in Railway → Variables:

```env
NODE_ENV=production
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REDIRECT_URI=https://your-domain.railway.app/zoho/callback
ZOHO_API_DOMAIN=https://www.zohoapis.in
VITE_ZOHO_ORGANIZATION_ID=your_org_id
```

### 3. Update Zoho Redirect URI

Add production URL to Zoho API Console:
```
https://your-domain.railway.app/zoho/callback
```

### 4. Deploy

Railway auto-deploys on push to `main` branch.

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)** - Complete developer documentation
- **[docs/ZOHO_SETUP.md](docs/ZOHO_SETUP.md)** - Zoho integration details
- **[docs/ZOHO_TOKEN_MANAGEMENT.md](docs/ZOHO_TOKEN_MANAGEMENT.md)** - Token lifecycle
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide

## ✅ Verification

### Test Local Setup

1. Start servers: `npm run dev:full`
2. Open http://localhost:5173
3. Go to Settings → Connect to Zoho Books
4. Complete OAuth flow
5. Check for "Successfully connected" message

### Test Production

1. Open your Railway URL
2. Go to Settings → Connect to Zoho Books
3. Authorize with Zoho
4. Verify connection successful

## 🐛 Troubleshooting

### "Invalid client credentials"
→ Check Client ID and Secret match Zoho API Console

### "Redirect URI mismatch"
→ Ensure redirect URI in .env matches Zoho API Console exactly

### "No access token in Zoho response"
→ Check Railway logs for exact error from Zoho

### Port already in use
→ Change PORT in .env or kill process on port 3001

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/Abhinandangithub01/QuotingSoftware/issues)
- **Documentation**: [docs/](docs/)
- **Zoho API Docs**: [Zoho Books API](https://www.zoho.com/books/api/v3/)

---

**Last Updated**: October 4, 2025
