'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Store, 
  Home, 
  QrCode, 
  Package, 
  History, 
  Settings, 
  LogOut,
  Users,
  TrendingUp,
  Search,
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShoppingCart,
  BarChart3
} from 'lucide-react'

interface ShopData {
  id: string
  name: string
  email: string
  mobile: string
  address: string
  ownerName: string
}

interface UserInfo {
  id: string
  name: string
  email: string
  mobile: string
  qrCodeId: string
  address?: string
  subscription?: {
    plan: {
      name: string
    }
    monthlyQuota: number
    usedQuota: number
    remainingQuota: number
    endDate: string
  }
  familyMembers: Array<{
    name: string
    age: number
    relationship: string
  }>
}

export default function ShopDashboard() {
  const [shop, setShop] = useState<ShopData | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrInput, setQrInput] = useState('')
  const [scannedUser, setScannedUser] = useState<UserInfo | null>(null)
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
  const [todayStats, setTodayStats] = useState({
    transactions: 0,
    revenue: 0,
    customers: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Check if shop is logged in
    const token = localStorage.getItem('token')
    const shopData = localStorage.getItem('user')
    
    if (!token || !shopData) {
      router.push('/login')
      return
    }

    const parsedShop = JSON.parse(shopData)
    setShop(parsedShop)
    
    // Fetch today's stats
    fetchTodayStats()
  }, [router])

  const fetchTodayStats = async () => {
    // Mock data for today's stats
    setTodayStats({
      transactions: 24,
      revenue: 15960,
      customers: 18
    })
    setLoading(false)
  }

  const handleQrScan = async () => {
    if (!qrInput.trim()) {
      setScanResult({ type: 'error', message: 'Please enter a QR code ID' })
      return
    }

    try {
      const response = await fetch('/api/auth/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qrCodeId: qrInput.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid QR code')
      }

      setScannedUser(data.user)
      setScanResult({ type: 'success', message: 'User verified successfully!' })
      
    } catch (error: any) {
      setScanResult({ type: 'error', message: error.message })
      setScannedUser(null)
    }
  }

  const handleProcessTransaction = () => {
    if (!scannedUser) return
    
    // In a real app, this would process the transaction
    setScanResult({ type: 'success', message: 'Transaction processed successfully!' })
    setTimeout(() => {
      setScannedUser(null)
      setQrInput('')
      setScanResult({ type: null, message: '' })
    }, 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

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

  if (!shop) {
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
                  <Store className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">QR Ration Shop</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/shop/dashboard" className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/shop/scan" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <QrCode className="w-4 h-4" />
                  Scan QR
                </Link>
                <Link href="/shop/inventory" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Package className="w-4 h-4" />
                  Inventory
                </Link>
                <Link href="/shop/transactions" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <History className="w-4 h-4" />
                  Transactions
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {shop.ownerName}</span>
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
              <h1 className="text-3xl font-bold text-foreground mb-2">{shop.name}</h1>
              <p className="text-muted-foreground">Manage your shop inventory and process customer transactions</p>
            </div>

            {/* Today's Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Today's Sales</p>
                      <p className="text-2xl font-bold text-foreground">{todayStats.transactions}</p>
                      <p className="text-xs text-muted-foreground">transactions</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold text-foreground">₹{todayStats.revenue}</p>
                      <p className="text-xs text-muted-foreground">today</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Customers</p>
                      <p className="text-2xl font-bold text-foreground">{todayStats.customers}</p>
                      <p className="text-xs text-muted-foreground">served today</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* QR Scanner Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Quick QR Scanner
                </CardTitle>
                <CardDescription>
                  Scan customer QR code to process ration transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="qr-input">Enter QR Code ID</Label>
                    <Input
                      id="qr-input"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="QR-XXXX-XXXX"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleQrScan} className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Verify
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Scan
                    </Button>
                  </div>
                </div>

                {scanResult.type && (
                  <Alert variant={scanResult.type === 'error' ? 'destructive' : 'default'}>
                    {scanResult.type === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{scanResult.message}</AlertDescription>
                  </Alert>
                )}

                {scannedUser && (
                  <div className="border rounded-lg p-4 bg-slate-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Customer Information</h4>
                      <Badge variant="secondary">
                        {scannedUser.subscription?.plan.name || 'No Subscription'}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p className="font-medium">{scannedUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                        <p className="font-medium">{scannedUser.mobile}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">QR Code ID</p>
                        <p className="font-medium font-mono text-sm">{scannedUser.qrCodeId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Family Members</p>
                        <p className="font-medium">{scannedUser.familyMembers.length} members</p>
                      </div>
                    </div>

                    {scannedUser.subscription && (
                      <div className="border-t pt-4">
                        <h5 className="font-medium mb-2">Subscription Details</h5>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-primary">{scannedUser.subscription.remainingQuota}</p>
                            <p className="text-xs text-muted-foreground">Points Left</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-orange-600">{scannedUser.subscription.usedQuota}</p>
                            <p className="text-xs text-muted-foreground">Points Used</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600">{scannedUser.subscription.monthlyQuota}</p>
                            <p className="text-xs text-muted-foreground">Total Points</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleProcessTransaction} className="flex-1">
                        Process Transaction
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setScannedUser(null)
                        setQrInput('')
                        setScanResult({ type: null, message: '' })
                      }}>
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest transactions at your shop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: '1', customer: 'Rahul Kumar', points: 120, time: '10:30 AM', status: 'completed' },
                    { id: '2', customer: 'Priya Sharma', points: 85, time: '09:45 AM', status: 'completed' },
                    { id: '3', customer: 'Amit Singh', points: 200, time: '09:15 AM', status: 'completed' }
                  ].map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{transaction.customer}</p>
                        <p className="text-xs text-muted-foreground">{transaction.time} • {transaction.points} points</p>
                      </div>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  ))}
                  <Link href="/shop/transactions">
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shop Info */}
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{shop.name}</p>
                    <p className="text-sm text-muted-foreground">Partner Shop</p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-sm"><span className="font-medium">Owner:</span> {shop.ownerName}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {shop.email}</p>
                  <p className="text-sm"><span className="font-medium">Mobile:</span> {shop.mobile}</p>
                  <p className="text-sm"><span className="font-medium">Address:</span> {shop.address}</p>
                </div>
                
                <Link href="/shop/settings">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Shop Settings
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
                <Link href="/shop/scan">
                  <Button variant="outline" className="w-full justify-start">
                    <QrCode className="w-4 h-4 mr-2" />
                    Scan QR Code
                  </Button>
                </Link>
                <Link href="/shop/inventory">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Inventory
                  </Button>
                </Link>
                <Link href="/shop/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Inventory Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">Low Stock Items</p>
                  <p className="text-xs text-orange-600 mt-1">2 items need restocking</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rice</span>
                    <span className="text-orange-600">45 kg left</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cooking Oil</span>
                    <span className="text-orange-600">12 L left</span>
                  </div>
                </div>
                <Link href="/shop/inventory">
                  <Button variant="outline" size="sm" className="w-full">
                    Update Inventory
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