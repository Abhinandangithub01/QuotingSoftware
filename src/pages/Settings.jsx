import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ShortcutsCustomizer } from '@/components/ShortcutsCustomizer'
import { useStore } from '@/store/useStore'
import { zohoAuth } from '@/services/zoho-auth'
import { toast } from 'sonner'
import { Save, Eye, Keyboard, Settings as SettingsIcon, FileText, Link as LinkIcon, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react'

export function Settings() {
  const settings = useStore((state) => state.settings)
  const updateSettings = useStore((state) => state.updateSettings)
  const syncWithZoho = useStore((state) => state.syncWithZoho)
  
  const [dispatchTimeField, setDispatchTimeField] = useState(settings.dispatchTimeField)
  const [customerNameField, setCustomerNameField] = useState(settings.customerNameField)
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = useState(settings.keyboardShortcutsEnabled)
  
  // Zoho integration state
  const [isZohoConnected, setIsZohoConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Check if Zoho is connected
    const checkConnection = () => {
      const hasToken = localStorage.getItem('zoho_access_token')
      setIsZohoConnected(!!hasToken)
    }
    
    checkConnection()
    
    // Listen for messages from popup
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === 'ZOHO_AUTH_SUCCESS') {
        toast.success('Successfully connected to Zoho Books!')
        checkConnection()
        // Auto-sync after connection
        setTimeout(() => {
          handleSyncNow()
        }, 500)
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    // Check again after a short delay (in case we just returned from OAuth)
    const timer = setTimeout(checkConnection, 1000)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const handleSave = () => {
    updateSettings({
      dispatchTimeField,
      customerNameField,
      keyboardShortcutsEnabled,
    })
    toast.success('Settings saved successfully')
  }

  const handleConnectZoho = async () => {
    // In production, check config from server
    if (import.meta.env.PROD) {
      try {
        const response = await fetch('/api/config')
        const config = await response.json()
        if (!config.VITE_ZOHO_CLIENT_ID) {
          toast.error('Zoho Books integration not configured. Please add environment variables in Railway.')
          return
        }
      } catch (error) {
        console.error('Failed to fetch config:', error)
      }
    } else {
      // Check if Zoho credentials are configured in development
      if (!import.meta.env.VITE_ZOHO_CLIENT_ID) {
        toast.error('Zoho Books integration not configured. Please add credentials to .env file.')
        return
      }
    }

    // Open Zoho OAuth in new tab
    const authUrl = await zohoAuth.getAuthorizationUrl()
    window.open(authUrl, '_blank', 'width=600,height=700')
    
    toast.info('Authorization window opened. Please complete the authorization and return here.')
  }

  const handleDisconnectZoho = () => {
    setIsZohoConnected(false)
    toast.success('Disconnected from Zoho Books')
  }

  const handleSyncNow = async () => {
    if (!isZohoConnected) {
      toast.error('Please connect to Zoho Books first before syncing.')
      return
    }
    
    setIsSyncing(true)
    try {
      await syncWithZoho()
    } catch (error) {
      console.error('Sync error:', error)
      toast.error('Sync failed. Please try again or reconnect to Zoho Books.')
    } finally {
      setIsSyncing(false)
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="zoho" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            Zoho Books
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="gap-2">
            <Keyboard className="h-4 w-4" />
            Shortcuts
          </TabsTrigger>
          <TabsTrigger value="packing" className="gap-2">
            <FileText className="h-4 w-4" />
            Packing Slips
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Packing Slip Fields</CardTitle>
              <CardDescription>
                Customize the field names displayed on packing slips
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dispatchTime">Dispatch Time Field Label</Label>
                <Input
                  id="dispatchTime"
                  value={dispatchTimeField}
                  onChange={(e) => setDispatchTimeField(e.target.value)}
                  placeholder="Dispatch Time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name Field Label</Label>
                <Input
                  id="customerName"
                  value={customerNameField}
                  onChange={(e) => setCustomerNameField(e.target.value)}
                  placeholder="Customer Name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
              <CardDescription>
                Enable or disable keyboard shortcuts throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shortcuts">Enable Keyboard Shortcuts</Label>
                  <p className="text-sm text-muted-foreground">
                    Use keyboard shortcuts for faster navigation and actions
                  </p>
                </div>
                <Switch
                  id="shortcuts"
                  checked={keyboardShortcutsEnabled}
                  onCheckedChange={setKeyboardShortcutsEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize how information is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Date Format</Label>
                  <p className="text-sm text-muted-foreground">
                    Currently: MMM DD, YYYY
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Currency</Label>
                  <p className="text-sm text-muted-foreground">
                    Currently: USD ($)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your packing slip will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
                <div className="text-xs font-semibold text-muted-foreground uppercase">
                  Packing Slip Preview
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{dispatchTimeField}:</span>
                    <span className="font-medium">10:30 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{customerNameField}:</span>
                    <span className="font-medium">John Smith</span>
                  </div>
                </div>
                <Separator />
                <div className="text-xs text-muted-foreground">
                  Changes will be reflected on all new packing slips
                </div>
              </div>

              {keyboardShortcutsEnabled && (
                <div className="mt-4 p-3 rounded-lg bg-primary/10">
                  <p className="text-xs font-medium mb-2">Active Shortcuts</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>✓ Ctrl+K - Search</p>
                    <p>✓ Ctrl+S - Save</p>
                    <p>✓ Alt+P - Mark Paid</p>
                    <p>✓ ? - Show Help</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
        </TabsContent>

        {/* Zoho Books Integration Tab */}
        <TabsContent value="zoho" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Zoho Books Integration
                  </CardTitle>
                  <CardDescription>
                    Connect your Zoho Books account to sync data in real-time
                  </CardDescription>
                </div>
                {isZohoConnected && (
                  <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Connection Status */}
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isZohoConnected ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <XCircle className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {isZohoConnected ? 'Connected to Zoho Books' : 'Not Connected'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isZohoConnected 
                          ? 'Your data is syncing with Zoho Books' 
                          : 'Connect to start syncing your data'}
                      </p>
                    </div>
                  </div>
                  {isZohoConnected ? (
                    <Button variant="outline" onClick={handleDisconnectZoho}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button onClick={handleConnectZoho}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect Now
                    </Button>
                  )}
                </div>

                {isZohoConnected && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Manual Sync</p>
                        <p className="text-xs text-muted-foreground">
                          Manually sync your data with Zoho Books
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleSyncNow}
                        disabled={isSyncing}
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Sync Now'}
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* What Gets Synced */}
              <div>
                <h3 className="font-medium mb-3">What gets synced?</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2 rounded-lg border p-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Customers</p>
                      <p className="text-xs text-muted-foreground">Names, emails, credit limits</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border p-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Products</p>
                      <p className="text-xs text-muted-foreground">SKUs, prices, stock levels</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border p-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Quotes</p>
                      <p className="text-xs text-muted-foreground">Create, update, convert</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border p-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Invoices</p>
                      <p className="text-xs text-muted-foreground">Status, payments, totals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border p-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Payments</p>
                      <p className="text-xs text-muted-foreground">Record automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border p-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Taxes</p>
                      <p className="text-xs text-muted-foreground">US state + local rates</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Text */}
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium mb-2">Need help?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Make sure you have a Zoho Books account</li>
                  <li>• Your organization ID is configured in .env</li>
                  <li>• Data syncs automatically after connection</li>
                  <li>• Use manual sync if data seems outdated</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyboard Shortcuts Tab */}
        <TabsContent value="shortcuts" className="mt-6">
          <ShortcutsCustomizer />
        </TabsContent>

        {/* Packing Slips Tab */}
        <TabsContent value="packing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Packing Slip Configuration</CardTitle>
              <CardDescription>
                Configure packing slip templates and fields
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dispatchTime2">Dispatch Time Field Label</Label>
                <Input
                  id="dispatchTime2"
                  value={dispatchTimeField}
                  onChange={(e) => setDispatchTimeField(e.target.value)}
                  placeholder="Dispatch Time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName2">Customer Name Field Label</Label>
                <Input
                  id="customerName2"
                  value={customerNameField}
                  onChange={(e) => setCustomerNameField(e.target.value)}
                  placeholder="Customer Name"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
