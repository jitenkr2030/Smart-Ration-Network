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
  Search,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  ShoppingCart,
  ArrowLeft,
  User
} from 'lucide-react'

interface ShopData {
  id: string
  name: string
  email: string
  mobile: string
  address: string
  ownerName: string
}

interface Product {
  id: string
  name: string
  category: string
  unit: string
  quotaPoints: number
  quantity: number
}

interface UserInfo {
  id: string
  name: string
  email: string
  mobile: string
  qrCodeId: string
  subscription?: {
    id: string
    plan: {
      name: string
    }
    monthlyQuota: number
    usedQuota: number
    remainingQuota: number
  }
}

interface CartItem {
  productId: string
  name: string
  unit: string
  quotaPoints: number
  quantity: number
  availableQuantity: number
}

export default function ShopTransactions() {
  const [shop, setShop] = useState<ShopData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [scannedUser, setScannedUser] = useState<UserInfo | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [qrInput, setQrInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
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
    
    // Fetch products
    fetchProducts()
  }, [router])

  const fetchProducts = async () => {
    try {
      // Mock product data with inventory
      const mockProducts: Product[] = [
        { id: 'rice-1', name: 'Rice', category: 'grains', unit: 'kg', quotaPoints: 20, quantity: 150 },
        { id: 'wheat-1', name: 'Wheat Flour', category: 'grains', unit: 'kg', quotaPoints: 15, quantity: 200 },
        { id: 'oil-1', name: 'Cooking Oil', category: 'oils', unit: 'liters', quotaPoints: 30, quantity: 45 },
        { id: 'sugar-1', name: 'Sugar', category: 'essentials', unit: 'kg', quotaPoints: 25, quantity: 80 },
        { id: 'salt-1', name: 'Salt', category: 'essentials', unit: 'kg', quotaPoints: 5, quantity: 120 },
        { id: 'pulses-1', name: 'Pulses', category: 'grains', unit: 'kg', quotaPoints: 35, quantity: 60 },
        { id: 'spices-1', name: 'Spices Mix', category: 'spices', unit: 'packets', quotaPoints: 15, quantity: 100 },
        { id: 'tea-1', name: 'Tea', category: 'beverages', unit: 'packets', quotaPoints: 20, quantity: 75 }
      ]
      setProducts(mockProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleScanUser = async () => {
    if (!qrInput.trim()) {
      setResult({ type: 'error', message: 'Please enter a QR code ID' })
      return
    }

    setLoading(true)
    setResult({ type: null, message: '' })

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
      setResult({ type: 'success', message: 'User verified successfully!' })
      setCart([]) // Clear cart when new user is scanned
      
    } catch (error: any) {
      setResult({ type: 'error', message: error.message })
      setScannedUser(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    if (!scannedUser) {
      setResult({ type: 'error', message: 'Please scan a user QR code first' })
      return
    }

    const existingItem = cart.find(item => item.productId === product.id)
    
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        setResult({ type: 'error', message: 'Insufficient stock' })
        return
      }
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        unit: product.unit,
        quotaPoints: product.quotaPoints,
        quantity: 1,
        availableQuantity: product.quantity
      }])
    }
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + delta
        if (newQuantity <= 0) return null
        if (newQuantity > item.availableQuantity) {
          setResult({ type: 'error', message: 'Insufficient stock' })
          return item
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean) as CartItem[])
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId))
  }

  const getTotalQuotaPoints = () => {
    return cart.reduce((total, item) => total + (item.quotaPoints * item.quantity), 0)
  }

  const processTransaction = async () => {
    if (!scannedUser || cart.length === 0) {
      setResult({ type: 'error', message: 'Please scan user and add items to cart' })
      return
    }

    const totalPoints = getTotalQuotaPoints()
    
    if (scannedUser.subscription && totalPoints > scannedUser.subscription.remainingQuota) {
      setResult({ type: 'error', message: 'Insufficient quota points' })
      return
    }

    setProcessing(true)
    setResult({ type: null, message: '' })

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: scannedUser.id,
          shopId: shop!.id,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          paymentMethod: 'qr',
          notes: 'Transaction via shop dashboard'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Transaction failed')
      }

      setResult({ type: 'success', message: `Transaction completed successfully! Transaction ID: ${data.transaction.transactionId}` })
      
      // Reset form
      setTimeout(() => {
        setScannedUser(null)
        setCart([])
        setQrInput('')
        setResult({ type: null, message: '' })
      }, 3000)

    } catch (error: any) {
      setResult({ type: 'error', message: error.message })
    } finally {
      setProcessing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
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
              <Link href="/shop/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">QR Ration Shop</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/shop/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/shop/transactions" className="flex items-center gap-2 text-sm font-medium text-primary">
                  <ShoppingCart className="w-4 h-4" />
                  Transactions
                </Link>
                <Link href="/shop/inventory" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Package className="w-4 h-4" />
                  Inventory
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/shop/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Process Transaction</h1>
          <p className="text-muted-foreground">Scan customer QR code and process ration transactions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Customer Verification
                </CardTitle>
                <CardDescription>
                  Scan customer QR code to begin transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="qr-input">QR Code ID</Label>
                    <Input
                      id="qr-input"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="QR-XXXX-XXXX"
                      className="mt-1"
                      disabled={loading}
                    />
                  </div>
                  <Button onClick={handleScanUser} disabled={loading} className="flex items-center gap-2">
                    {loading ? 'Scanning...' : 'Verify User'}
                  </Button>
                </div>

                {result.type && (
                  <Alert variant={result.type === 'error' ? 'destructive' : 'default'}>
                    {result.type === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{result.message}</AlertDescription>
                  </Alert>
                )}

                {scannedUser && (
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Verified
                      </h4>
                      <Badge variant="secondary">
                        {scannedUser.subscription?.plan.name || 'No Subscription'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <span className="ml-2 font-medium">{scannedUser.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mobile:</span>
                        <span className="ml-2 font-medium">{scannedUser.mobile}</span>
                      </div>
                      {scannedUser.subscription && (
                        <>
                          <div>
                            <span className="text-muted-foreground">Available Points:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {scannedUser.subscription.remainingQuota}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Monthly Quota:</span>
                            <span className="ml-2 font-medium">
                              {scannedUser.subscription.monthlyQuota}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Available Products</CardTitle>
                <CardDescription>
                  Add items to customer's cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quotaPoints} points/{product.unit} • {product.quantity} {product.unit} available
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        disabled={!scannedUser || product.quantity === 0}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Cart */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Transaction Cart
                </CardTitle>
                <CardDescription>
                  Review items before processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add items to begin transaction</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quotaPoints} points/{item.unit}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total Points:</span>
                        <span className="text-xl font-bold text-primary">
                          {getTotalQuotaPoints()}
                        </span>
                      </div>

                      {scannedUser?.subscription && (
                        <div className="text-sm text-muted-foreground mb-4">
                          Customer will have {scannedUser.subscription.remainingQuota - getTotalQuotaPoints()} points remaining
                        </div>
                      )}

                      <Button
                        onClick={processTransaction}
                        disabled={processing || cart.length === 0}
                        className="w-full"
                      >
                        {processing ? 'Processing...' : 'Complete Transaction'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}