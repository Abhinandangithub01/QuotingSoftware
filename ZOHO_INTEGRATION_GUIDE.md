# 🔗 Zoho Books Integration Guide

## Complete Setup Instructions

This guide will help you integrate your Venezia Quoting System with Zoho Books for real-time data synchronization.

---

## 📋 Prerequisites

1. **Zoho Books Account** - Active subscription
2. **Zoho Developer Account** - Free at https://api-console.zoho.com
3. **Organization ID** - From your Zoho Books account

---

## 🚀 Step-by-Step Setup

### Step 1: Create Zoho API Client

1. **Go to Zoho API Console**
   - Visit: https://api-console.zoho.com
   - Sign in with your Zoho account

2. **Create New Client**
   - Click "Add Client"
   - Select "Server-based Applications"
   
3. **Fill in Details**:
   - **Client Name**: `Venezia Quoting System`
   - **Homepage URL**: `http://localhost:5173`
   - **Authorized Redirect URIs**: `http://localhost:5173/auth/callback`
   
4. **Save and Note Down**:
   - Client ID
   - Client Secret

### Step 2: Get Organization ID

1. **Login to Zoho Books**
   - Visit: https://books.zoho.com
   
2. **Get Organization ID**:
   - Go to Settings → Organization Profile
   - Copy the Organization ID from the URL or page
   - Format: `12345678` (numeric)

### Step 3: Configure Environment Variables

1. **Create `.env` file** in project root:

```bash
# Copy from .env.example
cp .env.example .env
```

2. **Edit `.env` file** with your credentials:

```env
# Zoho Books API Configuration
VITE_ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXXX
VITE_ZOHO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_ZOHO_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_ZOHO_ORGANIZATION_ID=12345678
VITE_ZOHO_API_DOMAIN=https://books.zoho.com

# Environment
VITE_APP_ENV=development
```

3. **Save the file**

### Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### Step 5: Connect to Zoho Books

1. **Open Application**
   - Go to: http://localhost:5173

2. **Click "Connect with Zoho Books"**
   - You'll be redirected to Zoho
   - Login if needed
   - Authorize the application

3. **Grant Permissions**
   - Allow access to Zoho Books data
   - Click "Accept"

4. **Automatic Redirect**
   - You'll be redirected back to the app
   - Connection successful!

---

## 🔧 What Gets Synced

### From Zoho Books → App

✅ **Customers (Contacts)**
- Customer names
- Email addresses
- Phone numbers
- Billing addresses
- Credit limits
- Outstanding balances

✅ **Products (Items)**
- Product codes/SKUs
- Product names
- Descriptions
- Prices
- Stock levels
- Tax settings

✅ **Estimates (Quotes)**
- Existing quotes
- Line items
- Totals
- Status

✅ **Invoices**
- Invoice numbers
- Due dates
- Payment status
- Amounts

✅ **Taxes**
- Tax rates
- Tax names
- Tax types

### From App → Zoho Books

✅ **New Quotes**
- Customer selection
- Line items
- Totals
- Notes

✅ **Quote Updates**
- Status changes
- Line item modifications
- Customer changes

✅ **Invoices**
- Convert quote to invoice
- Payment recording
- Status updates

✅ **Payments**
- Payment amounts
- Payment dates
- Payment methods

---

## 📊 API Endpoints Used

### Estimates (Quotes)
- `GET /estimates` - List all quotes
- `GET /estimates/{id}` - Get quote details
- `POST /estimates` - Create new quote
- `PUT /estimates/{id}` - Update quote
- `POST /estimates/{id}/status/accepted` - Accept quote
- `POST /estimates/{id}/converttoInvoice` - Convert to invoice

### Invoices
- `GET /invoices` - List all invoices
- `GET /invoices/{id}` - Get invoice details
- `POST /invoices` - Create invoice
- `PUT /invoices/{id}` - Update invoice
- `POST /invoices/{id}/status/sent` - Mark as sent

### Contacts (Customers)
- `GET /contacts` - List all customers
- `GET /contacts/{id}` - Get customer details
- `POST /contacts` - Create customer
- `PUT /contacts/{id}` - Update customer

### Items (Products)
- `GET /items` - List all products
- `GET /items/{id}` - Get product details
- `POST /items` - Create product
- `PUT /items/{id}` - Update product
- `POST /items/{id}/adjuststock` - Adjust stock

### Payments
- `GET /customerpayments` - List payments
- `POST /customerpayments` - Record payment

---

## 🔐 Security & Authentication

### OAuth 2.0 Flow

1. **Authorization Request**
   ```
   User clicks "Connect with Zoho Books"
   → Redirects to Zoho OAuth
   → User authorizes
   → Zoho redirects back with code
   ```

2. **Token Exchange**
   ```
   App exchanges code for access token
   → Stores access token & refresh token
   → Uses tokens for API requests
   ```

3. **Token Refresh**
   ```
   Access token expires after 1 hour
   → App automatically refreshes using refresh token
   → New access token obtained
   → Seamless for user
   ```

### Token Storage

- **Access Token**: `localStorage.zoho_access_token`
- **Refresh Token**: `localStorage.zoho_refresh_token`
- **Expiry Time**: `localStorage.zoho_token_expiry`

### Security Best Practices

✅ **Never commit `.env` file** to version control  
✅ **Use HTTPS in production**  
✅ **Rotate client secrets regularly**  
✅ **Implement rate limiting**  
✅ **Log API errors for monitoring**

---

## 🎯 Usage Examples

### Create Quote in Zoho

```javascript
import { zohoBooksAPI } from '@/services/zoho-books'

// Create new estimate
const quote = await zohoBooksAPI.createEstimate({
  customer_id: '123456',
  estimate_number: 'Q-2024-001',
  date: '2024-10-03',
  line_items: [
    {
      item_id: '789012',
      quantity: 5,
      rate: 450.00,
      discount: 0
    }
  ],
  notes: 'Kitchen renovation project'
})
```

### Get Customer with Balance

```javascript
// Check customer credit
const creditCheck = await zohoBooksAPI.checkCreditLimit(
  customerId,
  quoteAmount
)

if (creditCheck.exceeded) {
  alert(`Credit limit exceeded! Available: $${creditCheck.available}`)
}
```

### Record Payment

```javascript
// Record payment for invoice
const payment = await zohoBooksAPI.recordPayment({
  customer_id: '123456',
  payment_mode: 'cash',
  amount: 3875.00,
  date: '2024-10-03',
  invoices: [
    {
      invoice_id: '789012',
      amount_applied: 3875.00
    }
  ]
})
```

---

## 🔄 Real-Time Sync

### Automatic Sync Events

The app automatically syncs with Zoho Books when:

1. **App Loads** - Fetches latest data
2. **Quote Created** - Pushes to Zoho
3. **Quote Updated** - Updates in Zoho
4. **Invoice Created** - Creates in Zoho
5. **Payment Recorded** - Records in Zoho
6. **Manual Sync** - Press `Alt+Shift+Z`

### Sync Status Indicator

Look for the sync icon in the topbar:
- 🟢 **Green**: Synced
- 🟡 **Yellow**: Syncing...
- 🔴 **Red**: Sync failed

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to Zoho Books"

**Solutions:**
1. Check `.env` file has correct credentials
2. Verify Organization ID is correct
3. Ensure redirect URI matches exactly
4. Check internet connection

### Issue: "Token expired"

**Solutions:**
1. App should auto-refresh - wait a moment
2. If persists, logout and login again
3. Check refresh token is valid

### Issue: "API rate limit exceeded"

**Solutions:**
1. Zoho has rate limits (100 requests/minute)
2. Wait a few minutes
3. Implement request queuing (future enhancement)

### Issue: "Organization ID not found"

**Solutions:**
1. Double-check Organization ID in `.env`
2. Ensure you have access to the organization
3. Try logging into Zoho Books directly

---

## 📈 Performance Optimization

### Caching Strategy

1. **Cache customer list** - Refresh every 5 minutes
2. **Cache product list** - Refresh every 10 minutes
3. **Cache tax rates** - Refresh daily
4. **Real-time for quotes** - Always fetch latest

### Request Batching

```javascript
// Batch multiple requests
const [customers, products, taxes] = await Promise.all([
  zohoBooksAPI.getCustomers(),
  zohoBooksAPI.getItems(),
  zohoBooksAPI.getTaxes()
])
```

---

## 🚀 Production Deployment

### Environment Variables for Production

```env
# Production Zoho Configuration
VITE_ZOHO_CLIENT_ID=your_production_client_id
VITE_ZOHO_CLIENT_SECRET=your_production_client_secret
VITE_ZOHO_REDIRECT_URI=https://yourdomain.com/auth/callback
VITE_ZOHO_ORGANIZATION_ID=your_org_id
VITE_ZOHO_API_DOMAIN=https://books.zoho.com
VITE_APP_ENV=production
```

### Update Zoho API Console

1. Add production redirect URI
2. Update homepage URL
3. Enable production mode

### SSL Certificate Required

- Zoho requires HTTPS for production
- Use Let's Encrypt or similar
- Configure reverse proxy (Nginx/Apache)

---

## 📊 Monitoring & Logging

### Log API Requests

```javascript
// Enable debug logging
localStorage.setItem('debug_zoho_api', 'true')

// View logs in console
// All API requests/responses will be logged
```

### Error Tracking

Consider integrating:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **DataDog** - APM monitoring

---

## 🔗 Useful Links

- **Zoho Books API Docs**: https://www.zoho.com/books/api/v3/
- **Zoho API Console**: https://api-console.zoho.com
- **OAuth Documentation**: https://www.zoho.com/accounts/protocol/oauth.html
- **Zoho Books**: https://books.zoho.com

---

## ✅ Integration Checklist

### Setup
- [ ] Created Zoho API client
- [ ] Got Client ID & Secret
- [ ] Got Organization ID
- [ ] Created `.env` file
- [ ] Added credentials to `.env`
- [ ] Restarted dev server

### Testing
- [ ] Clicked "Connect with Zoho Books"
- [ ] Authorized successfully
- [ ] Redirected back to app
- [ ] Can see real customers
- [ ] Can see real products
- [ ] Can create quote
- [ ] Quote appears in Zoho Books

### Production
- [ ] Updated production credentials
- [ ] Added production redirect URI
- [ ] Enabled HTTPS
- [ ] Tested OAuth flow
- [ ] Verified all API calls work

---

## 🎉 Success!

Once integrated, your app will:

✅ Sync all data with Zoho Books in real-time  
✅ Create quotes that appear in Zoho instantly  
✅ Convert quotes to invoices seamlessly  
✅ Record payments automatically  
✅ Track inventory accurately  
✅ Maintain customer credit limits  

**Your Venezia Quoting System is now a full ERP connected to Zoho Books!** 🚀

---

## 💡 Next Steps

1. **Test the integration** with sample data
2. **Train your team** on the new workflow
3. **Monitor sync status** regularly
4. **Set up error alerts** for production
5. **Optimize performance** as needed

For support, refer to the Zoho Books API documentation or contact Zoho support.
