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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Plus,
  Minus,
  ArrowLeft
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
    id: string
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

interface Product {
  id: string
  name: string
  category: string
  unit: string
  quotaPoints: number
  description?: string
  inStock: boolean
  stockQuantity?: number
}

interface CartItem {
  productId: string
  product: Product
  quantity: number
  quotaPoints: number
}

export default function ShopScanPage() {
  const [shop, setShop] = useState<ShopData | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrInput, setQrInput] = useState('')
  const [scannedUser, setScannedUser] = useState<UserInfo | null>(null)
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [processingTransaction, setProcessingTransaction] = useState(false)
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
      const shopData = localStorage.getItem('user')
      if (!shopData) return

      const parsedShop = JSON.parse(shopData)
      const response = await fetch(`/api/products?shopId=${parsedShop.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
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
      setCart([]) // Clear cart when new user is scanned
      
    } catch (error: any) {
      setScanResult({ type: 'error', message: error.message })
      setScannedUser(null)
    }
  }

  const addToCart = (product: Product) => {
    if (!scannedUser) return

    const existingItem = cart.find(item => item.productId === product.id)
    
    if (existingItem) {
      // Check stock availability
      if (product.stockQuantity && existingItem.quantity >= product.stockQuantity) {
        setScanResult({ type: 'error', message: 'Insufficient stock' })
        return
      }
      
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, quotaPoints: item.quotaPoints + product.quotaPoints }
          : item
      ))
    } else {
      setCart([...cart, {
        productId: product.id,
        product,
        quantity: 1,
        quotaPoints: product.quotaPoints
      }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const item = cart.find(item => item.productId === productId)
    if (!item) return

    // Check stock availability
    if (item.product.stockQuantity && newQuantity > item.product.stockQuantity) {
      setScanResult({ type: 'error', message: 'Insufficient stock' })
      return
    }

    setCart(cart.map(cartItem => 
      cartItem.productId === productId 
        ? { ...cartItem, quantity: newQuantity, quotaPoints: item.product.quotaPoints * newQuantity }
        : cartItem
    ))
  }

  const getTotalQuotaPoints = () => {
    return cart.reduce((sum, item) => sum + item.quotaPoints, 0)
  }

  const handleProcessTransaction = async () => {
    if (!scannedUser || cart.length === 0) return

    const totalPoints = getTotalQuotaPoints()
    
    // Check if user has enough quota
    if (scannedUser.subscription && totalPoints > scannedUser.subscription.remainingQuota) {
      setScanResult({ type: 'error', message: 'Insufficient quota points' })
      return
    }

    setProcessingTransaction(true)

    try {
      const shopData = localStorage.getItem('user')
      if (!shopData) return

      const parsedShop = JSON.parse(shopData)
      
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: scannedUser.id,
          shopId: parsedShop.id,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: 0, // In a real app, this would be calculated
            quotaPoints: item.product.quotaPoints
          })),
          paymentMethod: 'qr',
          notes: 'Ration purchase'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Transaction failed')
      }

      setScanResult({ type: 'success', message: 'Transaction processed successfully!' })
      
      // Clear cart and reset after 2 seconds
      setTimeout(() => {
        setCart([])
        setScannedUser(null)
        setQrInput('')
        setScanResult({ type: null, message: '' })
      }, 2000)

    } catch (error: any) {
      setScanResult({ type: 'error', message: error.message })
    } finally {
      setProcessingTransaction(false)
    }
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
          <p className="text-muted-foreground">Loading scanner...</p>
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
              <Link href="/shop/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
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
            {/* QR Scanner Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Scanner
                </CardTitle>
                <CardDescription>
                  Scan customer QR code to start transaction
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
                      disabled={!!scannedUser}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button 
                      onClick={handleQrScan} 
                      className="flex items-center gap-2"
                      disabled={!!scannedUser}
                    >
                      <Search className="w-4 h-4" />
                      Verify
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" disabled>
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
                      <h4 className="font-semibold">Customer: {scannedUser.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {scannedUser.subscription?.plan.name || 'No Subscription'}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setScannedUser(null)
                            setQrInput('')
                            setCart([])
                            setScanResult({ type: null, message: '' })
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    
                    {scannedUser.subscription && (
                      <div className="grid grid-cols-3 gap-4 text-center p-3 bg-white rounded-lg">
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
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Products Section */}
            {scannedUser && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Products</CardTitle>
                  <CardDescription>
                    Select items to add to transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{product.name}</p>
                            {!product.inStock && (
                              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {product.category} • {product.quotaPoints} points/{product.unit}
                          </p>
                          {product.stockQuantity !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              Stock: {product.stockQuantity} {product.unit}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
                  {scannedUser ? `Items for ${scannedUser.name}` : 'Scan QR to start'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No items in cart</p>
                    <p className="text-sm text-muted-foreground">
                      {scannedUser ? 'Add products to start transaction' : 'Scan customer QR first'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quotaPoints} points • {item.quantity} {item.product.unit}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Points:</span>
                        <span className="text-xl font-bold text-primary">{getTotalQuotaPoints()}</span>
                      </div>
                      
                      {scannedUser.subscription && (
                        <div className="p-2 bg-slate-50 rounded text-xs">
                          <p>Remaining after transaction: {scannedUser.subscription.remainingQuota - getTotalQuotaPoints()} points</p>
                        </div>
                      )}

                      <Button 
                        className="w-full" 
                        onClick={handleProcessTransaction}
                        disabled={processingTransaction || cart.length === 0}
                      >
                        {processingTransaction ? 'Processing...' : 'Process Transaction'}
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