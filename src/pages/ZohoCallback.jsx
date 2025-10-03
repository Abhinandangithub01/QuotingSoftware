import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { zohoAuth } from '@/services/zoho-auth'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ZohoCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Connecting to Zoho Books...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('ZohoCallback: Starting OAuth callback process')
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        
        console.log('ZohoCallback: Code:', code ? 'Present' : 'Missing')
        console.log('ZohoCallback: Error:', error)

        if (error) {
          setStatus('error')
          setMessage(`Authorization failed: ${error}`)
          return
        }

        if (!code) {
          setStatus('error')
          setMessage('No authorization code received')
          return
        }

        // Exchange code for access token
        setMessage('Exchanging authorization code...')
        console.log('ZohoCallback: Calling getAccessToken...')
        const tokenData = await zohoAuth.getAccessToken(code)
        console.log('ZohoCallback: Token received:', tokenData ? 'Success' : 'Failed')
        
        // Wait a bit for tokens to be saved
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Verify tokens were saved
        const savedToken = localStorage.getItem('zoho_access_token')
        if (!savedToken) {
        }

        setStatus('success')
        setMessage('Successfully connected to Zoho Books!')

        // If opened in popup, close it and notify parent
        if (window.opener) {
          setTimeout(() => {
            window.opener.postMessage({ type: 'ZOHO_AUTH_SUCCESS' }, window.location.origin)
            window.close()
          }, 1500)
        } else {
          // If not in popup, redirect to settings
          setTimeout(() => {
            navigate('/settings')
          }, 2000)
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Failed to connect to Zoho Books')
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'processing' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            Zoho Books Integration
          </CardTitle>
          <CardDescription>
            {status === 'processing' && 'Please wait...'}
            {status === 'success' && 'Connection successful!'}
            {status === 'error' && 'Connection failed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{message}</p>
            
            {status === 'success' && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Redirecting to application...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
