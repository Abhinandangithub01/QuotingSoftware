# 🏗️ Venezia Kitchen & Bath - ERP Quoting System

Complete ERP quoting system with Zoho Books India integration, keyboard-first navigation, and US tax compliance.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Zoho Books India account
- Zoho API credentials (Client ID & Secret)

### Installation

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev:full
```

Servers will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### First Time Setup

1. **Login** to the app (any email/password)
2. **Go to Settings → Zoho Books**
3. **Click "Connect Now"** (opens in popup)
4. **Authorize** with your Zoho account
5. **Click "Sync Now"** to load your data
6. **Done!** Your customers and products are loaded

## 📋 Features

### ✅ Zoho Books Integration
- OAuth 2.0 authentication with Zoho Books India
- Real-time sync of customers, products, quotes, invoices
- Automatic data updates
- Token auto-refresh

### ✅ Quote Management
- Create quotes with Zoho customers
- Add products from Zoho inventory  
- Automatic tax calculation (US state + local)
- Convert quotes to invoices in Zoho
- Track quote status

### ✅ Dashboard & Analytics
- Revenue tracking with trends
- Pending quotes count
- Active invoices overview
- Top customers by revenue
- Low stock alerts
- Recent activity feed

### ✅ Keyboard-First Navigation
- 30+ keyboard shortcuts
- Quick access to all features
- Alt+1 → Quotes, Alt+2 → New Quote
- Alt+Shift+S → Save Quote
- ? → Show all shortcuts

### ✅ US Tax System
- All 50 states + DC tax rates
- State + local tax calculation
- Tax-exempt customer support
- Automatic tax on quotes

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Zoho Books API Configuration (INDIA)
VITE_ZOHO_CLIENT_ID=your_client_id
VITE_ZOHO_CLIENT_SECRET=your_client_secret
VITE_ZOHO_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_ZOHO_ORGANIZATION_ID=your_org_id
VITE_ZOHO_API_DOMAIN=https://www.zohoapis.in

# Backend variables (without VITE_ prefix)
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_API_DOMAIN=https://www.zohoapis.in
ZOHO_REDIRECT_URI=http://localhost:5173/auth/callback
```

### Get Zoho API Credentials

1. Go to: https://api-console.zoho.in
2. Create a new "Server-based Application"
3. Set redirect URI: `http://localhost:5173/auth/callback`
4. Note your Client ID and Client Secret
5. Add them to `.env`

## 📂 Project Structure

```
Venezia/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── QuotesList.jsx
│   │   ├── NewQuote.jsx
│   │   ├── Settings.jsx
│   │   └── ZohoCallback.jsx
│   ├── services/       # API services
│   │   ├── zoho-auth.js     # OAuth handling
│   │   └── zoho-books.js    # Zoho API client
│   ├── store/          # State management (Zustand)
│   │   └── useStore.js
│   └── lib/            # Utilities
│       └── usTaxSystem.js   # Tax calculations
├── server.js           # Backend proxy server
├── .env                # Environment variables
└── package.json        # Dependencies
```

## 🎯 Usage

### Creating a Quote

1. **Go to New Quote** (Alt+2)
2. **Select Customer** from Zoho Books
3. **Add Products** from Zoho inventory
4. Tax calculates automatically
5. **Save** (Alt+Shift+S)
6. Quote appears in Zoho Books!

### Converting to Invoice

1. Open quote from list
2. Click "Convert to Invoice" (Alt+Shift+I)
3. Invoice created in Zoho Books
4. Status updated automatically

### Syncing Data

- **Automatic**: On app start (if connected)
- **Manual**: Settings → Sync Now
- **Auto-refresh**: Tokens refresh automatically

## 🔐 Security

- OAuth 2.0 secure authentication
- Tokens stored in localStorage
- Auto token refresh before expiry
- All API calls through backend proxy
- HTTPS required for production

## 🐛 Troubleshooting

### "Not Connected" Error
- Go to Settings → Zoho Books
- Click "Disconnect" then "Connect Now"
- Complete OAuth flow
- Click "Sync Now"

### "No Customers/Products" Error
- Ensure you're connected to Zoho Books
- Click "Sync Now" in Settings
- Check Zoho Books has data

### 500 Server Errors
- Check backend is running (port 3001)
- Verify `.env` has correct credentials
- Try reconnecting to Zoho Books

## 📱 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Alt+1 | Go to Quotes |
| Alt+2 | New Quote |
| Alt+3 | Dispatch Queue |
| Alt+4 | Settings |
| Alt+Shift+S | Save Quote |
| Alt+Shift+I | Convert to Invoice |
| Alt+Shift+D | Toggle Dark Mode |
| Alt+Shift+Z | Sync with Zoho |
| ? | Show shortcuts |
| Ctrl+K | Product search |
| Esc | Close dialogs |

## 🚀 Deployment

### Production Checklist

1. **Update .env with production values**
   ```env
   VITE_ZOHO_REDIRECT_URI=https://yourdomain.com/auth/callback
   VITE_ZOHO_API_DOMAIN=https://www.zohoapis.in
   ```

2. **Update Zoho API Console**
   - Add production redirect URI
   - Enable production mode

3. **Build**
   ```bash
   npm run build
   ```

4. **Deploy**
   - Frontend: Deploy `dist/` folder
   - Backend: Deploy `server.js` to Node.js server

5. **SSL Required**
   - Zoho requires HTTPS for OAuth
   - Use Let's Encrypt or similar

## 📚 Additional Documentation

- `SETUP.md` - Detailed setup instructions
- `ZOHO_INTEGRATION_GUIDE.md` - Zoho integration details
- `SHORTCUTS_GUIDE.md` - Complete shortcuts reference
- `US_TAX_SYSTEM.md` - Tax calculation details
- `FINAL_INSTRUCTIONS.md` - Quick reference

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State**: Zustand
- **Routing**: React Router
- **Backend**: Express.js (proxy)
- **API**: Zoho Books REST API
- **Auth**: OAuth 2.0

## 📄 License

MIT

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review documentation files
3. Check Zoho API documentation

---

**Built for Venezia Kitchen & Bath - Professional ERP Quoting System** 🏗️
