# Developer Guide - Venezia Quoting System

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Zoho Books Integration](#zoho-books-integration)
4. [Features](#features)
5. [State Management](#state-management)
6. [UI Components](#ui-components)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Tax System](#tax-system)
9. [Development Workflow](#development-workflow)

---

## Architecture Overview

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ItemsTable.jsx  # Line items table with Excel-like features
│   ├── CatalogDrawer.jsx
│   └── ProductTypeahead.jsx
├── pages/              # Route pages
│   ├── Dashboard.jsx
│   ├── QuotesList.jsx
│   ├── NewQuote.jsx
│   ├── QuoteDetail.jsx
│   ├── Settings.jsx
│   └── ZohoCallback.jsx
├── services/           # API and external services
│   ├── index.js        # Centralized service exports
│   ├── zoho-auth.js    # OAuth 2.0 & token management
│   ├── zoho-contacts.js     # Customer/vendor API
│   ├── zoho-items.js        # Product/service catalog
│   ├── zoho-invoices.js     # Invoice operations
│   ├── zoho-estimates.js    # Quote/estimate API
│   ├── zoho-salesorders.js  # Sales order management
│   ├── zoho-payments.js     # Payment processing
│   ├── zoho-creditnotes.js  # Credit note handling
│   ├── zoho-projects.js     # Project management
│   ├── zoho-expenses.js     # Expense tracking
│   ├── zoho-bills.js        # Bill management
│   ├── zoho-purchaseorders.js # Purchase orders
│   ├── zoho-fields.js       # Field metadata service
│   └── zoho-books.js        # Legacy compatibility
├── store/              # Zustand state management
│   └── useStore.js
├── lib/                # Utilities
│   ├── utils.js
│   ├── config.js
│   └── usTaxSystem.js
└── App.jsx             # Main app component
```

### Backend Architecture
```
server.js               # Express proxy server
├── /api/zoho/token     # OAuth token exchange
├── /api/zoho/refresh   # Token refresh
├── /api/zoho/books/*   # Zoho Books API proxy
└── /api/config         # Environment config endpoint
```

---

## Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.1.0
- **Routing**: React Router DOM 6.22.0
- **State Management**: Zustand 4.5.0
- **Styling**: TailwindCSS 3.4.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Command Palette**: cmdk

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **HTTP Client**: node-fetch 3.3.2
- **Environment**: dotenv 16.3.1
- **CORS**: cors 2.8.5

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Deployment**: Railway (auto-deploy from GitHub)

---

## Features

### 1. Quote Management

#### Create Quote
- **Location**: `/quotes/new`
- **Features**:
  - Customer selection with search
  - Project details (name, location, dispatch date)
  - Line items with Excel-like table
  - Real-time tax calculation
  - Shipping options
  - Draft/Final save options

#### Quote List
- **Location**: `/quotes`
- **Features**:
  - Filterable by status (All, Draft, Sent, Accepted, Declined)
  - Search by customer/project
  - Quick actions (View, Edit, Delete)
  - Status badges

#### Quote Detail
- **Location**: `/quotes/:id`
- **Features**:
  - Full quote preview
  - Print/PDF export
  - Convert to invoice
  - Email to customer
  - Status management

### 2. Line Items Table

**Excel-like Features**:
- **Bulk Paste**: Paste from Excel/CSV (Ctrl+V)
- **Keyboard Navigation**: 
  - Enter: Next row
  - Shift+Enter: Previous row
  - Ctrl+D: Duplicate row
  - Alt+↑/↓: Move row up/down
- **Product Search**: Typeahead with Ctrl+K
- **Auto-calculation**: Qty × Price - Discount%
- **Dimensions**: L × W for area calculation
- **UoM Support**: piece, set, sq ft, sq m

### 3. US Tax System

**Features**:
- State-level sales tax
- Local tax (county/city)
- Tax exemption support
- Tax breakdown display

**Implementation**: `src/lib/usTaxSystem.js`

```javascript
calculateUSTax(subtotal, state, zipCode, options)
// Returns: { totalTax, totalTaxRate, stateTax, localTax, exempt }
```

**Supported States**: All 50 US states with accurate tax rates

### 4. Zoho Books Integration

**Sync Features**:
- Customers (Contacts)
- Products (Items)
- Estimates (Quotes)
- Invoices
- Payments

**Real-time Sync**: Manual sync via Settings page

---

## Zoho Books Integration

### Complete API Coverage

**14 Service Modules - 200+ Methods**

See `FEATURES_IMPLEMENTATION.md` for complete list.

### Quick Start

```javascript
// Import services
import { 
  zohoContacts,
  zohoInvoices,
  zohoEstimates,
  zohoItems,
  zohoFields
} from '@/services'

// Get customers
const customers = await zohoContacts.listContacts()

// Create invoice
const invoice = await zohoInvoices.createInvoice({
  customer_id: '123',
  line_items: [{ item_id: '456', quantity: 2, rate: 100 }]
})

// Get dynamic fields
const invoiceFields = await zohoFields.getInvoiceFields()

// Create estimate
const estimate = await zohoEstimates.createEstimate(data)
```

### Available Services

| Service | Module | Methods |
|---------|--------|---------|
| **Contacts** | `zohoContacts` | 17 |
| **Items** | `zohoItems` | 7 |
| **Invoices** | `zohoInvoices` | 31 |
| **Estimates** | `zohoEstimates` | 18 |
| **Sales Orders** | `zohoSalesOrders` | 17 |
| **Payments** | `zohoPayments` | 9 |
| **Credit Notes** | `zohoCreditNotes` | 12 |
| **Projects** | `zohoProjects` | 14 |
| **Expenses** | `zohoExpenses` | 11 |
| **Bills** | `zohoBills` | 14 |
| **Purchase Orders** | `zohoPurchaseOrders` | 16 |
| **Fields** | `zohoFields` | 10 |

---

## OAuth 2.0 Authentication

### OAuth 2.0 Flow

**1. Authorization Request**
```javascript
// User clicks "Connect to Zoho"
const authUrl = await zohoAuth.getAuthorizationUrl()
window.open(authUrl, '_blank', 'width=600,height=700')
```

**2. Callback Handling**
```javascript
// /zoho/callback page
const code = searchParams.get('code')
const tokenData = await zohoAuth.getAccessToken(code)
// Tokens automatically saved to localStorage
```

**3. API Requests**
```javascript
// Automatic token refresh if expired
const token = await zohoAuth.getValidAccessToken()
// Use token in API calls
```

### Token Management

**Storage**: localStorage
- `zoho_access_token` - Expires in 1 hour
- `zoho_refresh_token` - Never expires
- `zoho_token_expiry` - Timestamp
- `zoho_api_domain` - Regional API domain

**Validation Layers**:
1. Backend validation (server.js)
2. Frontend validation (zoho-auth.js)
3. Type checking (string validation)
4. Format validation (must start with "1000.")
5. Auto-refresh on expiry

**Token Refresh**:
```javascript
// Automatic refresh 5 minutes before expiry
if (isTokenExpiringSoon()) {
  await zohoAuth.refreshAccessToken()
}
```

### Zoho Books API Structure

**Base URL**: `https://www.zohoapis.in/books/v3` (India)
**Alternative**: `https://www.zohoapis.com/books/v3` (US/Global)

**Authentication**:
```http
Authorization: Zoho-oauthtoken {access_token}
```

**Required Parameter**: `organization_id` in all requests

**Example Request**:
```javascript
const response = await fetch(
  'https://www.zohoapis.in/books/v3/estimates?organization_id=xxx',
  {
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json'
    }
  }
)
```

### Error Handling

**401 Unauthorized**: Auto-refresh token and retry
**500 Server Error**: Log and display user-friendly message
**Network Error**: Retry with exponential backoff

---

## State Management

### Zustand Store

**Location**: `src/store/useStore.js`

```javascript
const useStore = create((set, get) => ({
  // State
  quotes: [],
  customers: [],
  products: [],
  
  // Actions
  addQuote: (quote) => set((state) => ({
    quotes: [...state.quotes, quote]
  })),
  
  fetchCustomers: async () => {
    const data = await zohoBooksAPI.getCustomers()
    set({ customers: data.contacts })
  },
  
  fetchProducts: async () => {
    const data = await zohoBooksAPI.getItems()
    set({ products: data.items })
  }
}))
```

**Usage**:
```javascript
import { useStore } from '@/store/useStore'

function MyComponent() {
  const quotes = useStore((state) => state.quotes)
  const addQuote = useStore((state) => state.addQuote)
  
  return <div>{quotes.length} quotes</div>
}
```

---

## UI Components

### shadcn/ui Components Used

- **Button**: Primary actions
- **Input**: Form fields
- **Select**: Dropdowns
- **Card**: Content containers
- **Dialog**: Modals
- **Popover**: Dropdown menus
- **Command**: Search/command palette
- **Table**: Data tables
- **Toast**: Notifications (via Sonner)
- **Separator**: Visual dividers
- **Label**: Form labels
- **Switch**: Toggle switches
- **Tabs**: Tab navigation

### Custom Components

#### ItemsTable
**Features**:
- Excel-like editing
- Bulk paste support
- Keyboard shortcuts
- Auto-calculation
- Row operations (duplicate, delete, move)

#### ProductTypeahead
**Features**:
- Real-time search
- Keyboard navigation
- Product preview
- Quick add

#### CatalogDrawer
**Features**:
- Full product catalog
- Category filtering
- Search
- Quick select

---

## Keyboard Shortcuts

### Global Shortcuts
- `Ctrl+S` - Save quote
- `Ctrl+Enter` - Convert to invoice
- `Ctrl+K` - Open product search
- `Esc` - Close dialogs/drawers

### Table Shortcuts
- `Enter` - Next row
- `Shift+Enter` - Previous row
- `Ctrl+D` - Duplicate row
- `Alt+↑` - Move row up
- `Alt+↓` - Move row down
- `Backspace` - Delete empty row
- `Ctrl+V` - Bulk paste

**Implementation**: Event listeners in `ItemsTable.jsx`

---

## Tax System

### US Tax Calculation

**File**: `src/lib/usTaxSystem.js`

**Tax Rates by State**:
```javascript
const STATE_TAX_RATES = {
  'CA': 7.25,  // California
  'TX': 6.25,  // Texas
  'NY': 4.00,  // New York
  // ... all 50 states
}
```

**Local Tax** (County/City):
```javascript
const LOCAL_TAX_RATES = {
  'CA': { 'Los Angeles': 2.25, 'San Francisco': 1.50 },
  'TX': { 'Houston': 2.00, 'Dallas': 2.00 }
}
```

**Tax Exemption**:
```javascript
calculateUSTax(subtotal, state, zip, {
  taxExemptCertificate: 'CERT-123',
  customerType: 'wholesale'
})
// Returns: { exempt: true, exemptReason: '...' }
```

**Usage**:
```javascript
const taxResult = calculateUSTax(1000, 'CA', '90001', {})
// {
//   totalTax: 92.50,
//   totalTaxRate: 9.25,
//   stateTax: 72.50,
//   stateTaxRate: 7.25,
//   localTax: 20.00,
//   localTaxRate: 2.00,
//   exempt: false
// }
```

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run frontend + backend
npm run dev:full

# Frontend only (port 5173)
npm run dev

# Backend only (port 3001)
npm run server
```

### Environment Variables

**Required**:
```env
# Zoho OAuth
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REDIRECT_URI=http://localhost:5173/zoho/callback

# Zoho Configuration
ZOHO_API_DOMAIN=https://www.zohoapis.in
VITE_ZOHO_ORGANIZATION_ID=your_org_id

# Node Environment
NODE_ENV=development
PORT=3001
```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy (Railway auto-deploys from GitHub)
git push origin main
```

### Testing Checklist

- [ ] OAuth flow works
- [ ] Customers sync from Zoho
- [ ] Products sync from Zoho
- [ ] Create quote with line items
- [ ] Tax calculation accurate
- [ ] Save as draft
- [ ] Save as final
- [ ] Convert to invoice
- [ ] Keyboard shortcuts work
- [ ] Bulk paste works
- [ ] Token refresh works

---

## Common Issues & Solutions

### Issue: "Invalid access token"
**Solution**: Clear localStorage and re-authenticate
```javascript
localStorage.clear()
// Then reconnect to Zoho
```

### Issue: CORS errors
**Solution**: Ensure backend proxy is running
```bash
npm run server
```

### Issue: Customers not loading
**Solution**: Check Zoho organization ID
```javascript
console.log(import.meta.env.VITE_ZOHO_ORGANIZATION_ID)
```

### Issue: Token refresh fails
**Solution**: Check refresh token in localStorage
```javascript
console.log(localStorage.getItem('zoho_refresh_token'))
```

---

## API Rate Limits

**Zoho Books API**:
- 100 requests per minute
- 1000 requests per day (free tier)
- 10000 requests per day (paid tier)

**Handling**:
- Implement request queuing
- Cache responses when possible
- Use webhooks for real-time updates (future)

---

## Security Best Practices

1. **Never commit `.env` file**
2. **Use environment variables** for all secrets
3. **Validate all user inputs**
4. **Sanitize data** before saving
5. **Use HTTPS** in production
6. **Implement CSRF protection**
7. **Rate limit API endpoints**
8. **Log security events**

---

## Future Enhancements

### Planned Features
- [ ] Invoice generation
- [ ] Payment tracking
- [ ] Email templates
- [ ] PDF export
- [ ] Multi-currency support
- [ ] Recurring quotes
- [ ] Quote templates
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Offline mode

### API Improvements
- [ ] GraphQL API
- [ ] Webhooks for real-time sync
- [ ] Batch operations
- [ ] Advanced filtering
- [ ] Custom fields support

---

## Contributing

### Code Style
- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push and create PR
git push origin feature/new-feature
```

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

---

## Support & Resources

- **Zoho Books API**: https://www.zoho.com/books/api/v3/
- **Zoho OAuth**: https://www.zoho.com/accounts/protocol/oauth.html
- **shadcn/ui**: https://ui.shadcn.com/
- **React Router**: https://reactrouter.com/
- **Zustand**: https://github.com/pmndrs/zustand

---

**Last Updated**: October 3, 2025
**Version**: 1.0.0
**Maintainer**: Development Team
