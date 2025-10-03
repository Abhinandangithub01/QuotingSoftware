# Venezia Quoting System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5173`

4. **Login:**
Use any email and password to access the demo

## 📁 Project Structure

```
venezia/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # ShadCN UI components
│   │   ├── Topbar.jsx    # Main navigation bar
│   │   ├── Sidebar.jsx   # Side navigation
│   │   ├── ItemsTable.jsx # Keyboard-optimized quote items table
│   │   ├── ProductTypeahead.jsx
│   │   ├── CatalogDrawer.jsx
│   │   └── KeyboardShortcuts.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── QuotesList.jsx
│   │   ├── NewQuote.jsx
│   │   ├── QuoteDetail.jsx
│   │   ├── DispatchQueue.jsx
│   │   ├── PackingSlip.jsx
│   │   └── Settings.jsx
│   ├── lib/              # Utilities
│   │   ├── utils.js      # Helper functions
│   │   └── mockData.js   # Sample data
│   ├── store/            # State management
│   │   └── useStore.js   # Zustand store
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Features

### ✅ Implemented Features

1. **Authentication**
   - Modern login screen
   - Session management

2. **Quotes Management**
   - List view with filters (status, category, date)
   - Create new quotes
   - Edit existing quotes
   - Convert to invoice
   - Mark as paid

3. **Keyboard-First Workflow**
   - `Ctrl+K` - Focus product search
   - `Ctrl+S` - Save quote
   - `Ctrl+Enter` - Convert to invoice
   - `Alt+P` - Mark paid
   - `Ctrl+D` - Duplicate row
   - `Alt+↑/↓` - Move row
   - `Enter` - Navigate cells
   - `Ctrl+V` - Bulk paste

4. **Product Catalog**
   - Typeahead search with partial matching
   - Visual catalog drawer
   - Recent items tracking
   - Stock indicators

5. **Items Table**
   - Dynamic dimensions (L×W for area calculation)
   - UoM selection (piece, set, sq ft, sq m)
   - Finish/color picker with swatches
   - Inline calculations
   - Bulk paste with preview

6. **Dispatch Queue**
   - Packing slip management
   - Batch operations
   - Print functionality

7. **Settings**
   - Custom field mapping
   - Keyboard shortcuts toggle
   - Live preview

8. **UI/UX**
   - Dark mode support
   - Responsive design
   - Toast notifications
   - Skeleton loaders
   - Modern animations

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus product search |
| `Ctrl + S` | Save quote |
| `Ctrl + Enter` | Convert to invoice |
| `Alt + P` | Mark paid & open packing slip |
| `Ctrl + D` | Duplicate row |
| `Alt + ↑/↓` | Move row up/down |
| `Enter` | Product → Qty → New row |
| `Shift + Enter` | Reverse focus |
| `Tab / Shift+Tab` | Next/Previous cell |
| `Backspace` | Delete row (on empty product) |
| `Ctrl + V` | Bulk paste rows |
| `Esc` | Close modal/drawer |
| `? or F1` | Show shortcuts panel |

## 🎯 Usage Guide

### Creating a Quote

1. Click "New Quote" or press `Ctrl+N`
2. Select customer from dropdown
3. Enter project details
4. Add line items:
   - Type to search products (`Ctrl+K`)
   - Or open catalog drawer
   - Enter quantity
   - Press `Enter` to add new row
5. Review summary panel
6. Save or convert to invoice

### Bulk Paste Items

1. Copy tab or comma-delimited data:
   ```
   CAB001	Shaker Cabinet	5	450
   QTZ001	Calacatta Quartz	100	85
   ```
2. Click in Product cell
3. Press `Ctrl+V`
4. Review preview
5. Confirm to insert

### Dispatch Workflow

1. Mark invoice as paid (`Alt+P`)
2. Packing slip auto-generated
3. View in Dispatch Queue
4. Batch print or mark released

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize colors:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Mock Data
Edit `src/lib/mockData.js` to add products, quotes, etc.

### Field Labels
Use Settings page to customize packing slip fields

## 🔧 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 📱 Mobile Support

- Responsive layouts
- Touch-friendly controls
- Bottom action bar on mobile
- Full-screen catalog drawer

## 🐛 Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3000
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Next Steps

To connect to real APIs:
1. Replace mock data in `src/lib/mockData.js`
2. Add API service layer in `src/services/`
3. Update store actions to call APIs
4. Add authentication tokens

## 📝 License

Proprietary - Venezia Kitchen Cabinets & Bath
