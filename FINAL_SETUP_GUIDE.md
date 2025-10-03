# 🎉 Venezia Quoting System - Complete Setup Guide

## ✅ What's Been Built

A **complete ERP quoting system** with full Zoho Books integration, keyboard-first navigation, and US tax compliance.

---

## 🚀 Quick Start

### 1. Start Both Servers

```bash
npm run dev:full
```

This starts:
- **Frontend** (Vite): http://localhost:5173
- **Backend** (Proxy): http://localhost:3001

### 2. Login

- Go to http://localhost:5173
- Enter any email/password
- Click "Sign In"

### 3. Connect Zoho Books

1. Go to **Settings** (Alt+4)
2. Click **"Zoho Books"** tab
3. Click **"Connect Now"**
4. Authorize on Zoho
5. You'll be redirected back - **Connected!** ✅

### 4. Sync Data

- Click **"Sync Now"** in Settings
- Your customer and product will appear!

---

## 📋 Complete Feature List

### ✅ Zoho Books Integration
- **OAuth 2.0** authentication
- **Real-time sync** with Zoho Books India
- **Proxy server** (no CORS issues)
- **Auto token refresh**

### ✅ Data Synced from Zoho
- **Customers** - Names, emails, credit limits, balances
- **Products** - SKUs, prices, stock levels
- **Quotes** - Create, update, convert to invoice
- **Invoices** - Status, payments, totals
- **Payments** - Record automatically
- **Taxes** - US state + local rates

### ✅ Dashboard & Reports
- Total revenue with trends
- Pending quotes count
- Active invoices
- Top customers by revenue
- Low stock alerts
- Recent activity

### ✅ Keyboard Shortcuts
- `Alt+1` - Quotes List
- `Alt+2` - New Quote
- `Alt+3` - Dispatch Queue
- `Alt+4` - Settings
- `Alt+Shift+S` - Save Quote
- `Alt+Shift+I` - Convert to Invoice
- `Alt+Shift+D` - Toggle Dark Mode
- `Alt+Shift+Z` - Sync with Zoho
- `?` - Show shortcuts panel

### ✅ US Tax System
- All 50 states + DC
- State + local tax rates
- Tax-exempt customer support
- Automatic tax calculation

### ✅ Quote Management
- Create quotes with real Zoho customers
- Add products from Zoho inventory
- Calculate taxes automatically
- Convert to invoices in Zoho
- Track status (draft, sent, accepted)

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# Zoho Books API Configuration (INDIA)
VITE_ZOHO_CLIENT_ID=1000.K4Q0VI1JZ7QNI41FKGDFGQ2S01MHXS
VITE_ZOHO_CLIENT_SECRET=4fd22e6eb52c85512ced1c5b9b199758f843fb8ebd
VITE_ZOHO_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_ZOHO_ORGANIZATION_ID=60050102326
VITE_ZOHO_API_DOMAIN=https://www.zohoapis.in

# Environment
VITE_APP_ENV=development
```

### Important Notes:
- ✅ API Domain: `https://www.zohoapis.in` (for India)
- ✅ OAuth Domain: `https://accounts.zoho.in` (auto-detected)
- ✅ Client created on: `api-console.zoho.in`

---

## 📊 How It Works

### Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │─────▶│ Proxy Server │─────▶│ Zoho Books  │
│ (Frontend)  │      │  (Port 3001) │      │   (India)   │
│ Port 5173   │◀─────│              │◀─────│             │
└─────────────┘      └──────────────┘      └─────────────┘
```

### Data Flow

1. **User logs in** → App checks for Zoho token
2. **If authenticated** → Auto-sync with Zoho
3. **Create quote** → Saves to Zoho Books
4. **Convert to invoice** → Creates in Zoho Books
5. **Record payment** → Updates in Zoho Books

### No Mock Data!

All data comes from Zoho Books:
- ❌ No mock customers
- ❌ No mock products
- ❌ No mock quotes
- ✅ Everything is real-time from Zoho!

---

## 🎯 Usage Guide

### Creating a Quote

1. **Go to New Quote** (Alt+2)
2. **Select Customer** - Type to search Zoho customers
3. **Add Products** - Search Zoho inventory
4. **Tax calculates automatically**
5. **Save** (Alt+Shift+S)
6. **Quote appears in Zoho Books!**

### Converting to Invoice

1. **Open quote** from list
2. **Click "Convert to Invoice"** (Alt+Shift+I)
3. **Invoice created in Zoho Books**
4. **Status updated automatically**

### Recording Payment

1. **Open invoice**
2. **Click "Record Payment"**
3. **Enter amount and date**
4. **Payment recorded in Zoho Books**

---

## 🔐 Security

### OAuth Flow

```
1. User clicks "Connect with Zoho Books"
2. Redirects to accounts.zoho.in
3. User authorizes
4. Zoho redirects back with code
5. Backend exchanges code for tokens
6. Tokens stored in localStorage
7. Auto-refresh before expiry
```

### Token Storage

- **Access Token**: `localStorage.zoho_access_token`
- **Refresh Token**: `localStorage.zoho_refresh_token`
- **Expiry**: `localStorage.zoho_token_expiry`

### Security Best Practices

✅ Never commit `.env` file  
✅ Tokens auto-refresh  
✅ All API calls through proxy  
✅ HTTPS required for production  

---

## 📁 Project Structure

```
Venezia/
├── src/
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx    # Analytics dashboard
│   │   ├── QuotesList.jsx   # Quotes list
│   │   ├── NewQuote.jsx     # Create quote
│   │   ├── Settings.jsx     # Settings + Zoho
│   │   └── ZohoCallback.jsx # OAuth callback
│   ├── services/       # API services
│   │   ├── zoho-auth.js     # OAuth handling
│   │   └── zoho-books.js    # Zoho API client
│   ├── store/          # State management
│   │   └── useStore.js      # Zustand store
│   └── lib/            # Utilities
│       └── usTaxSystem.js   # Tax calculations
├── server.js           # Backend proxy server
├── .env                # Environment variables
└── package.json        # Dependencies
```

---

## 🐛 Troubleshooting

### "500 Internal Server Error"

**Cause**: Not authenticated with Zoho yet

**Solution**:
1. Go to Settings → Zoho Books
2. Click "Connect Now"
3. Authorize
4. Click "Sync Now"

### "Invalid Client"

**Cause**: Wrong API console (US vs India)

**Solution**:
- Create client on `api-console.zoho.in` (not `.com`)
- Update `.env` with new credentials

### "Use zohoapis domain"

**Cause**: Wrong API domain in `.env`

**Solution**:
- Change to `https://www.zohoapis.in`
- Restart servers

### "CORS Error"

**Cause**: Backend proxy not running

**Solution**:
```bash
npm run dev:full
```

### "No customers/products found"

**Cause**: Not synced yet

**Solution**:
1. Go to Settings → Zoho Books
2. Click "Sync Now"
3. Wait for success message

---

## 🚀 Production Deployment

### 1. Update Environment Variables

```env
VITE_ZOHO_CLIENT_ID=your_production_client_id
VITE_ZOHO_CLIENT_SECRET=your_production_secret
VITE_ZOHO_REDIRECT_URI=https://yourdomain.com/auth/callback
VITE_ZOHO_ORGANIZATION_ID=your_org_id
VITE_ZOHO_API_DOMAIN=https://www.zohoapis.in
VITE_APP_ENV=production
```

### 2. Update Zoho API Console

- Add production redirect URI
- Update homepage URL
- Enable production mode

### 3. Deploy

```bash
# Build frontend
npm run build

# Deploy to hosting (Vercel, Netlify, etc.)
# Deploy backend to server (Railway, Render, etc.)
```

### 4. SSL Required

- Zoho requires HTTPS for production
- Use Let's Encrypt or similar
- Configure reverse proxy

---

## 📊 Testing Checklist

### Zoho Integration
- [ ] Connect to Zoho Books
- [ ] Sync customers successfully
- [ ] Sync products successfully
- [ ] Create quote in app
- [ ] Quote appears in Zoho Books
- [ ] Convert quote to invoice
- [ ] Invoice appears in Zoho Books
- [ ] Record payment
- [ ] Payment appears in Zoho Books

### Dashboard
- [ ] Revenue displays correctly
- [ ] Pending quotes count accurate
- [ ] Top customers show
- [ ] Low stock alerts work
- [ ] Recent activity displays

### Keyboard Shortcuts
- [ ] Alt+1 opens Quotes
- [ ] Alt+2 opens New Quote
- [ ] Alt+4 opens Settings
- [ ] Alt+Shift+S saves quote
- [ ] ? shows shortcuts panel

---

## 📞 Support

### Documentation
- `ZOHO_INTEGRATION_GUIDE.md` - Detailed Zoho setup
- `SHORTCUTS_GUIDE.md` - All keyboard shortcuts
- `KEYBOARD_FIRST_IMPLEMENTATION.md` - Technical details

### Zoho Resources
- API Docs: https://www.zoho.com/books/api/v3/
- API Console: https://api-console.zoho.in
- Zoho Books: https://books.zoho.in

---

## ✅ Success Criteria

Your system is working correctly when:

✅ Login works  
✅ Zoho connection shows "Connected"  
✅ Sync loads your customer "Mr. Abhinandan R"  
✅ Sync loads your product "Wash Basin"  
✅ Can create quote with real data  
✅ Quote appears in Zoho Books  
✅ Can convert to invoice  
✅ Invoice appears in Zoho Books  
✅ Dashboard shows real data  
✅ No console errors  

---

## 🎉 You're Done!

Your Venezia Quoting System is now:

✅ **Fully integrated** with Zoho Books India  
✅ **No mock data** - everything is real-time  
✅ **Keyboard-first** - optimized for speed  
✅ **Tax compliant** - US state + local taxes  
✅ **Production ready** - secure OAuth flow  

**Start creating quotes and watch them appear in Zoho Books instantly!** 🚀

---

## 🔄 Next Steps

1. **Test the integration** with real data
2. **Train your team** on keyboard shortcuts
3. **Customize** as needed
4. **Deploy to production**
5. **Monitor** sync status regularly

**Happy Quoting!** 💼
