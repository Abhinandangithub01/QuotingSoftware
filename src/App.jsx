import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Topbar } from '@/components/Topbar'
import { Sidebar } from '@/components/Sidebar'
import { Login } from '@/pages/Login'
import { ZohoCallback } from '@/pages/ZohoCallback'
import { Dashboard } from '@/pages/Dashboard'
import { QuotesList } from '@/pages/QuotesList'
import { NewQuote } from '@/pages/NewQuote'
import { QuoteDetail } from '@/pages/QuoteDetail'
import { DispatchQueue } from '@/pages/DispatchQueue'
import { PackingSlip } from '@/pages/PackingSlip'
import { Settings } from '@/pages/Settings'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'
import { Toaster } from 'sonner'
import { useStore } from '@/store/useStore'

function AppContent() {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const user = useStore((state) => state.user)
  const toggleTheme = useStore((state) => state.toggleTheme)

  useEffect(() => {
    // Only sync if BOTH user is logged in AND has Zoho token
    const syncWithZoho = useStore.getState().syncWithZoho
    
    // Check if user is logged into the app AND has Zoho token
    const hasZohoToken = localStorage.getItem('zoho_access_token')
    
    if (user && hasZohoToken) {
      // User is logged in and has Zoho connection, sync data
      syncWithZoho()
    }

    // Listen for custom app events
    const handleShowHelp = () => setShowShortcuts(true)
    const handleClose = () => setShowShortcuts(false)
    const handleToggleTheme = () => toggleTheme()
    const handleSyncZoho = () => syncWithZoho()

    window.addEventListener('app:show_help', handleShowHelp)
    window.addEventListener('app:close', handleClose)
    window.addEventListener('app:toggle_theme', handleToggleTheme)
    window.addEventListener('app:sync_zoho', handleSyncZoho)

    return () => {
      window.removeEventListener('app:show_help', handleShowHelp)
      window.removeEventListener('app:close', handleClose)
      window.removeEventListener('app:toggle_theme', handleToggleTheme)
      window.removeEventListener('app:sync_zoho', handleSyncZoho)
    }
  }, [user, toggleTheme])

  if (!user) {
    return (
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<ZohoCallback />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <Router>
        <MainApp 
          showShortcuts={showShortcuts}
          setShowShortcuts={setShowShortcuts}
          toggleTheme={toggleTheme}
        />
      </Router>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}

function MainApp({ showShortcuts, setShowShortcuts, toggleTheme }) {
  // Initialize global shortcuts (now inside Router context)
  useGlobalShortcuts({
    enabled: true,
    onShortcut: (action) => {
      if (action === 'show_help') {
        setShowShortcuts(true)
      } else if (action === 'close') {
        setShowShortcuts(false)
      } else if (action === 'toggle_theme') {
        toggleTheme()
      }
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Topbar onShowShortcuts={() => setShowShortcuts(true)} />
      <Sidebar />
      
      <main className="md:pl-64 pt-16">
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quotes" element={<QuotesList />} />
            <Route path="/quotes/new" element={<NewQuote />} />
            <Route path="/quotes/:id" element={<QuoteDetail />} />
            <Route path="/quotes/:id/edit" element={<NewQuote />} />
            <Route path="/dispatch" element={<DispatchQueue />} />
            <Route path="/dispatch/:id" element={<PackingSlip />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      <KeyboardShortcuts 
        open={showShortcuts} 
        onOpenChange={setShowShortcuts}
      />
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App
