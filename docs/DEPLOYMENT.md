# Deployment Guide

## Railway Deployment

1. **Connect Repository**
   - Link your GitHub repository to Railway
   - Railway auto-deploys on push to `main`

2. **Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`

## Local Development

```bash
# Install dependencies
npm install

# Run development servers (frontend + backend)
npm run dev:full

# Frontend only
npm run dev

# Backend only
npm run server
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Zoho OAuth credentials set
- [ ] Domain whitelisted in Zoho Console
- [ ] CORS origins updated in `server.js`
- [ ] SSL certificate active (required for OAuth)
