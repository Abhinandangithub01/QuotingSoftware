# 🚀 Deployment Guide - Railway & Vercel

## 📋 Prerequisites

- GitHub account
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Zoho Books India account with API credentials

## 🎯 Deployment Architecture

```
Frontend (Vercel) → Backend (Railway) → Zoho Books API
     ↓                    ↓
  HTTPS              HTTPS + Logs
```

## 🔧 Step 1: Push to GitHub

```bash
# Already initialized! Now create GitHub repo and push:

# 1. Create new repo on GitHub (don't initialize with README)
# 2. Add remote and push:
git remote add origin https://github.com/YOUR_USERNAME/venezia-erp.git
git branch -M main
git push -u origin main
```

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `venezia-erp` repository
5. Railway will auto-detect Node.js

### 2.2 Configure Backend

1. Click on your service
2. Go to "Settings"
3. Set **Start Command**: `node server.js`
4. Set **Root Directory**: `/` (leave empty)

### 2.3 Add Environment Variables

Go to "Variables" tab and add:

```env
ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
ZOHO_API_DOMAIN=https://www.zohoapis.in
ZOHO_REDIRECT_URI=https://YOUR_FRONTEND_URL.vercel.app/auth/callback
PORT=3001
```

### 2.4 Get Backend URL

1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Copy your backend URL (e.g., `https://venezia-backend.up.railway.app`)

## ☁️ Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite

### 3.2 Configure Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Add Environment Variables

Go to "Settings" → "Environment Variables" and add:

```env
VITE_ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
VITE_ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
VITE_ZOHO_REDIRECT_URI=https://YOUR_FRONTEND_URL.vercel.app/auth/callback
VITE_ZOHO_ORGANIZATION_ID=60050102326
VITE_ZOHO_API_DOMAIN=https://www.zohoapis.in
VITE_APP_ENV=production
```

### 3.4 Update Backend URL in Code

Before deploying, update the proxy URL in `src/services/zoho-books.js`:

```javascript
constructor() {
  this.proxyURL = import.meta.env.PROD 
    ? 'https://YOUR_RAILWAY_BACKEND_URL/api/zoho/books'
    : 'http://localhost:3001/api/zoho/books'
  this.organizationId = ORGANIZATION_ID
}
```

Commit and push this change.

## 🔐 Step 4: Update Zoho API Console

1. Go to https://api-console.zoho.in
2. Edit your application
3. Add production redirect URI:
   ```
   https://YOUR_FRONTEND_URL.vercel.app/auth/callback
   ```
4. Add to authorized domains:
   ```
   https://YOUR_FRONTEND_URL.vercel.app
   https://YOUR_RAILWAY_BACKEND_URL.up.railway.app
   ```

## 🔄 Step 5: Update CORS in Backend

Update `server.js` to allow production frontend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://YOUR_FRONTEND_URL.vercel.app'
  ],
  credentials: true
}))
```

Commit and push - Railway will auto-deploy!

## ✅ Step 6: Test Production

1. Visit your Vercel URL
2. Login to the app
3. Go to Settings → Zoho Books
4. Click "Connect Now"
5. Authorize (should work with HTTPS!)
6. Click "Sync Now"
7. Check Railway logs for any errors

## 📊 Monitoring

### Railway Logs
- Go to Railway dashboard
- Click on your service
- View real-time logs
- See all API calls and errors

### Vercel Logs
- Go to Vercel dashboard
- Click "Deployments"
- View build and runtime logs

## 🐛 Troubleshooting

### "CORS Error"
- Check backend CORS settings
- Ensure frontend URL is in allowed origins

### "OAuth Failed"
- Verify redirect URI in Zoho console
- Check HTTPS is enabled
- Ensure URLs match exactly

### "500 Errors"
- Check Railway logs
- Verify environment variables
- Test backend health: `https://YOUR_BACKEND_URL/health`

### "Build Failed"
- Check Vercel build logs
- Verify all dependencies in package.json
- Ensure environment variables are set

## 💰 Costs

**Railway:**
- Free: $5 credit/month
- Pro: $20/month (if needed)

**Vercel:**
- Free: Hobby plan (generous limits)
- Pro: $20/month (if needed)

**Total:** $0-40/month depending on usage

## 🔄 Auto-Deployment

Both platforms support auto-deployment:
- Push to `main` branch → Auto-deploys
- Pull requests → Preview deployments
- Rollback available if issues

## 📝 Post-Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] Zoho redirect URI updated
- [ ] CORS configured
- [ ] OAuth flow tested
- [ ] Data sync working
- [ ] Logs monitoring setup
- [ ] Custom domain (optional)
- [ ] SSL certificate active

## 🎉 Success!

Your Venezia ERP system is now live and production-ready!

**Frontend**: https://YOUR_APP.vercel.app  
**Backend**: https://YOUR_BACKEND.up.railway.app  
**Logs**: Available in Railway dashboard

---

**Need help?** Check Railway and Vercel documentation or review the logs!
