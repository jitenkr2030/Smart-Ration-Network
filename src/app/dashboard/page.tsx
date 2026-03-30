'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  QrCode, 
  Home, 
  CreditCard, 
  History, 
  Users, 
  Settings, 
  LogOut,
  ShoppingCart,
  Package,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  mobile: string
  qrCodeId: string
  address?: string
}

interface Subscription {
  id: string
  plan: {
    name: string
    price: number
    maxMembers: number
  }
  monthlyQuota: number
  usedQuota: number
  remainingQuota: number
  endDate: string
}

interface Transaction {
  id: string
  transactionId: string
  totalQuotaPoints: number
  status: string
  createdAt: string
  shop: {
    name: string
    address: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [qrCodeImage, setQrCodeImage] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Fetch user data
    fetchUserData()
    fetchQrCode()
  }, [router])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      if (!token || !userData) return

      const parsedUser = JSON.parse(userData)
      
      // In a real app, you'd fetch this from your API
      // For now, we'll use mock data
      setSubscription({
        id: 'sub_1',
        plan: {
          name: 'Family Pack',
          price: 3999,
          maxMembers: 6
        },
        monthlyQuota: 1000,
        usedQuota: 350,
        remainingQuota: 650,
        endDate: '2024-12-31'
      })

      setRecentTransactions([
        {
          id: '1',
          transactionId: 'TXN202411001',
          totalQuotaPoints: 120,
          status: 'completed',
          createdAt: '2024-11-01T10:30:00Z',
          shop: {
            name: 'Annapurna General Store',
            address: '123 Main Street, Delhi'
          }
        },
        {
          id: '2',
          transactionId: 'TXN202410028',
          totalQuotaPoints: 85,
          status: 'completed',
          createdAt: '2024-10-28T15:45:00Z',
          shop: {
            name: 'Krishna Provision Store',
            address: '456 Market Road, Delhi'
          }
        }
      ])
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQrCode = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) return

      const parsedUser = JSON.parse(userData)
      const response = await fetch(`/api/auth/qrcode?userId=${parsedUser.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setQrCodeImage(data.qrCodeImage)
      }
    } catch (error) {
      console.error('Error fetching QR code:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const quotaPercentage = subscription ? (subscription.usedQuota / subscription.monthlyQuota) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">QR Ration</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/dashboard/subscription" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <CreditCard className="w-4 h-4" />
                  Subscription
                </Link>
                <Link href="/dashboard/transactions" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <History className="w-4 h-4" />
                  Transactions
                </Link>
                <Link href="/dashboard/family" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Users className="w-4 h-4" />
                  Family
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">Manage your ration quota and track your subscriptions</p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Quota</p>
                      <p className="text-2xl font-bold text-foreground">
                        {subscription?.remainingQuota || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">points remaining</p>
                    </div>
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold text-foreground">
                        {subscription?.usedQuota || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">points used</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                      <p className="text-2xl font-bold text-foreground">{recentTransactions.length}</p>
                      <p className="text-xs text-muted-foreground">this month</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quota Overview */}
            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Monthly Quota Overview
                  </CardTitle>
                  <CardDescription>
                    Your ration quota usage for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used: {subscription.usedQuota} points</span>
                      <span>Remaining: {subscription.remainingQuota} points</span>
                    </div>
                    <Progress value={quotaPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>{subscription.monthlyQuota} points</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Current Plan</p>
                      <p className="text-xs text-muted-foreground">{subscription.plan.name}</p>
                    </div>
                    <Badge variant="secondary">
                      ₹{subscription.plan.price}/month
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Next Renewal</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Your latest ration transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{transaction.transactionId}</p>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{transaction.shop.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()} • {transaction.totalQuotaPoints} points
                          </p>
                        </div>
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                    <Link href="/dashboard/transactions">
                      <Button variant="outline" className="w-full">
                        View All Transactions
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                    <p className="text-sm text-muted-foreground">Visit a partner shop to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Your QR Code
                </CardTitle>
                <CardDescription>
                  Show this code at partner shops
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {qrCodeImage ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-48 h-48 bg-white p-2 rounded-lg shadow-sm">
                      <img src={qrCodeImage} alt="Your QR Code" className="w-full h-full" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-muted-foreground">{user.qrCodeId}</p>
                      <p className="text-xs text-muted-foreground">
                        Share this QR code securely with authorized shops only
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-slate-400" />
                    </div>
                    <Button onClick={fetchQrCode} variant="outline" size="sm">
                      Generate QR Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">User Account</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.mobile}</span>
                    </div>
                    {user.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/subscription">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                </Link>
                <Link href="/dashboard/family">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Family Members
                  </Button>
                </Link>
                <Link href="/dashboard/nearby-shops">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Nearby Shops
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}