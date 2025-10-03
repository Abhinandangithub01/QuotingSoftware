import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/useStore'
import { zohoAuth } from '@/services/zoho-auth'
import { toast } from 'sonner'
import { ExternalLink } from 'lucide-react'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setUser = useStore((state) => state.setUser)

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Mock authentication - accept any credentials
    if (email && password) {
      setUser({
        id: 1,
        name: 'John Doe',
        email: email,
        role: 'admin'
      })
      toast.success('Welcome back!')
      navigate('/quotes')
    } else {
      toast.error('Please enter email and password')
    }
  }

  const handleZohoLogin = () => {
    // Check if Zoho credentials are configured
    if (!import.meta.env.VITE_ZOHO_CLIENT_ID) {
      toast.error('Zoho Books integration not configured. Please add credentials to .env file.')
      return
    }

    // Redirect to Zoho OAuth
    const authUrl = zohoAuth.getAuthorizationUrl()
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <span className="text-3xl font-bold">V</span>
          </div>
          <CardTitle className="text-2xl">Venezia Kitchen & Bath</CardTitle>
          <CardDescription>Sign in to access the quoting system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@venezia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              After login, connect Zoho Books in Settings to sync your data
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
