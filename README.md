# 🏛️ Venezia Kitchen & Bath - Quoting System

**Modern quoting system with Zoho Books integration, US tax calculation, and Excel-like features**

<div align="center">

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5.0-orange.svg)](https://github.com/pmndrs/zustand)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

**[Quick Start](#-quick-start)** • **[Features](#-features)** • **[Documentation](#-documentation)** • **[Deployment](#-deployment)**

</div>

---

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run frontend + backend servers
npm run dev:full

# Frontend only (port 5173)
npm run dev

# Backend only (port 3001)
npm run server
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Live Demo**: [https://quotingsoftware-production.up.railway.app](https://quotingsoftware-production.up.railway.app)

## ✨ Features

### 🎯 Core Functionality
- ✅ **Quote Management** - Create, edit, track, and convert quotes to invoices
- ✅ **Zoho Books Integration** - Real-time sync with customers, products, and estimates
- ✅ **US Tax System** - Accurate state and local tax calculation for all 50 states
- ✅ **Excel-like Table** - Bulk paste, keyboard navigation, auto-calculation
- ✅ **Product Catalog** - Visual browser with smart search and typeahead
- ✅ **Fixed Summary Bar** - Always-visible totals while scrolling
- ✅ **Compact Layout** - Optimized for minimal scrolling

### 🔗 Zoho Books Integration
- 🔄 **OAuth 2.0** - Secure authentication with auto token refresh
- 👥 **Customers Sync** - Import and sync contacts from Zoho
- 📦 **Products Sync** - Import items with pricing and UoM
- 📊 **Estimates** - Create and manage quotes in Zoho Books
- 💰 **Invoices** - Convert quotes to invoices seamlessly
- 🔒 **Multi-layer Validation** - Prevents invalid token issues

### 💰 US Tax System
- 📍 **State Tax** - Accurate rates for all 50 US states
- 🏙️ **Local Tax** - County and city tax support
- 🎫 **Tax Exemption** - Certificate-based exemption handling
- 📊 **Tax Breakdown** - Detailed state + local tax display
- 🔄 **Real-time Calculation** - Updates as you add items

### 🎨 User Experience
- 🌙 **Dark/Light Mode** - Seamless theme switching
- 📱 **Fully Responsive** - Mobile, tablet, desktop optimized
- ⚡ **Fast Performance** - Vite-powered, optimized bundle
- 🎭 **Smooth Animations** - Polished micro-interactions
- 🔔 **Toast Notifications** - Real-time feedback
- ⌨️ **Keyboard Shortcuts** - Power user workflow

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus product search |
| `Ctrl+S` | Save quote |
| `Ctrl+Enter` | Convert to invoice |
| `Alt+P` | Mark paid & open packing slip |
| `Ctrl+D` | Duplicate row |
| `Alt+↑/↓` | Move row up/down |
| `Enter` | Product → Qty → New row |
| `Ctrl+V` | Bulk paste items |
| `?` or `F1` | Show shortcuts panel |
| `Esc` | Close modals/drawers |

## 🛠️ Tech Stack

### Core
- **[React 18](https://react.dev)** - Modern UI framework
- **[Vite](https://vitejs.dev)** - Lightning-fast build tool
- **[React Router](https://reactrouter.com)** - Client-side routing

### Styling & Components
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS
- **[ShadCN UI](https://ui.shadcn.com)** - Beautiful components
- **[Radix UI](https://radix-ui.com)** - Accessible primitives
- **[Lucide React](https://lucide.dev)** - Icon library

### State & Utils
- **[Zustand](https://github.com/pmndrs/zustand)** - State management
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[date-fns](https://date-fns.org)** - Date utilities

## 📁 Project Structure

```
Venezia/
├── 📚 docs/
│   ├── DEVELOPER_GUIDE.md     Complete developer documentation
│   ├── ZOHO_SETUP.md          Zoho integration setup
│   ├── DEPLOYMENT.md          Deployment guide
│   ├── LAYOUT_FIXES.md        UI layout improvements
│   ├── ZOHO_INTEGRATION_FIXES.md  Token validation fixes
│   ├── SHORTCUTS_GUIDE.md     Keyboard shortcuts
│   └── US_TAX_SYSTEM.md       Tax calculation guide
│
├── 💻 src/
│   ├── pages/                 Main application pages
│   │   ├── Dashboard.jsx
│   │   ├── NewQuote.jsx       Quote creation with fixed summary
│   │   ├── QuotesList.jsx
│   │   ├── QuoteDetail.jsx
│   │   ├── Settings.jsx       Zoho integration settings
│   │   └── ZohoCallback.jsx   OAuth callback handler
│   │
│   ├── components/            Reusable components
│   │   ├── ui/               shadcn/ui components
│   │   ├── ItemsTable.jsx    Excel-like line items table
│   │   ├── ProductTypeahead.jsx  Smart product search
│   │   └── CatalogDrawer.jsx Product catalog browser
│   │
│   ├── services/             External integrations
│   │   ├── zoho-auth.js      OAuth 2.0 handler
│   │   └── zoho-books.js     Zoho Books API client
│   │
│   ├── store/                State management
│   │   └── useStore.js       Zustand store
│   │
│   └── lib/                  Utilities
│       ├── utils.js
│       ├── config.js
│       └── usTaxSystem.js    US tax calculation
│
├── server.js                 Express proxy server
└── ⚙️ Configuration files
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)** | 👨‍💻 Complete developer documentation |
| **[ZOHO_SETUP.md](docs/ZOHO_SETUP.md)** | 🔗 Zoho Books integration setup |
| **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** | 🚀 Deployment instructions |
| **[SHORTCUTS_GUIDE.md](docs/SHORTCUTS_GUIDE.md)** | ⌨️ Keyboard shortcuts reference |
| **[US_TAX_SYSTEM.md](docs/US_TAX_SYSTEM.md)** | 💰 Tax calculation guide |

## 🎯 Key Workflows

### Create a Quote
1. Click "New Quote" → Select customer
2. Add items (Ctrl+K to search products)
3. Review summary → Save (Ctrl+S)

### Bulk Add Items
1. Copy tab-delimited data
2. Paste in Product cell (Ctrl+V)
3. Review preview → Confirm

### Generate Packing Slip
1. Convert quote to invoice
2. Mark as paid (Alt+P)
3. View in Dispatch Queue → Print

## 🚀 Deployment

### Railway (Recommended)

1. **Connect GitHub Repository**
   ```bash
   git push origin main
   ```

2. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   ZOHO_CLIENT_ID=your_client_id
   ZOHO_CLIENT_SECRET=your_client_secret
   ZOHO_REDIRECT_URI=https://your-domain.com/zoho/callback
   ZOHO_API_DOMAIN=https://www.zohoapis.in
   VITE_ZOHO_ORGANIZATION_ID=your_org_id
   ```

3. **Deploy**
   - Railway auto-deploys on push to `main`
   - Build command: `npm run build`
   - Start command: `npm start`

### Manual Deployment

```bash
# Build for production
npm run build

# Output: dist/ folder
# Deploy dist/ to any static hosting
```

**See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions**

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
# Zoho OAuth Credentials
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REDIRECT_URI=http://localhost:5173/zoho/callback

# Zoho Configuration
ZOHO_API_DOMAIN=https://www.zohoapis.in
VITE_ZOHO_ORGANIZATION_ID=your_organization_id

# Server
NODE_ENV=development
PORT=3001
```

### Zoho Setup

1. **Create Zoho Developer Account**
   - Go to [Zoho API Console](https://api-console.zoho.in/)
   - Create a new client (Server-based Applications)

2. **Configure OAuth**
   - Authorized Redirect URI: `http://localhost:5173/zoho/callback`
   - Scopes: `ZohoBooks.fullaccess.all`

3. **Get Organization ID**
   - Login to Zoho Books
   - Settings → Organization → Copy Organization ID

**See [docs/ZOHO_SETUP.md](docs/ZOHO_SETUP.md) for detailed setup**

## 📊 Project Stats

- **React Components**: 30+
- **Pages**: 7
- **Keyboard Shortcuts**: 13+
- **Zoho API Methods**: 25+
- **US States Supported**: 50
- **Tax Calculation**: Real-time
- **Lines of Code**: ~6,000+

## 🔐 Security Features

- ✅ **OAuth 2.0** - Secure Zoho authentication
- ✅ **Token Validation** - Multi-layer validation (5 layers)
- ✅ **Auto Token Refresh** - Prevents expiration issues
- ✅ **CORS Protection** - Backend proxy for API calls
- ✅ **Environment Variables** - Secrets not in code
- ✅ **HTTPS Required** - Secure production deployment

## 🐛 Troubleshooting

### Common Issues

**"Invalid access token" error**
```bash
# Clear localStorage and re-authenticate
# Open browser DevTools → Application → Local Storage → Clear All
```

**Port already in use**
```bash
# Change port in .env
PORT=3002
```

**Zoho customers not loading**
```bash
# Verify organization ID
echo $VITE_ZOHO_ORGANIZATION_ID
```

**Build fails**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**CORS errors**
```bash
# Ensure backend server is running
npm run server
```

**See [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for more solutions**

## 🤝 Contributing

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Commit with conventional commits
git commit -m "feat: Add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Code Style

- Follow existing patterns
- Use ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Test before committing

### Commit Message Format

```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
style: Format code
refactor: Refactor component
test: Add tests
chore: Update dependencies
```

## 📝 License

Proprietary - Venezia Kitchen Cabinets & Bath

## 🔮 Future Enhancements

- [ ] Invoice generation and tracking
- [ ] Payment processing integration
- [ ] Email templates and automation
- [ ] PDF export with custom branding
- [ ] Multi-currency support
- [ ] Recurring quotes
- [ ] Quote templates
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/Abhinandangithub01/QuotingSoftware/issues)
- **Zoho API**: [Zoho Books API Docs](https://www.zoho.com/books/api/v3/)

---

<div align="center">

### 🌟 Ready to Start?

**[📖 Read Developer Guide](docs/DEVELOPER_GUIDE.md)** to begin!

Built with ❤️ for Venezia Kitchen Cabinets & Bath

**[⭐ Star this repo](https://github.com/Abhinandangithub01/QuotingSoftware)** if you find it useful!

</div>
