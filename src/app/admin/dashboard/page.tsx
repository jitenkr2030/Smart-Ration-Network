'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Home, 
  Users, 
  Store, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut,
  BarChart3,
  ShoppingCart,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Package
} from 'lucide-react'

interface AdminData {
  id: string
  name: string
  email: string
  mobile?: string
  role: string
}

interface Stats {
  totalUsers: number
  totalShops: number
  activeSubscriptions: number
  todayTransactions: number
  monthlyRevenue: number
}

interface User {
  id: string
  name: string
  email: string
  mobile: string
  qrCodeId: string
  isActive: boolean
  createdAt: string
  subscription?: {
    plan: {
      name: string
    }
    status: string
  }
}

interface Shop {
  id: string
  name: string
  email: string
  mobile: string
  ownerName: string
  isActive: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalShops: 0,
    activeSubscriptions: 0,
    todayTransactions: 0,
    monthlyRevenue: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('token')
    const adminData = localStorage.getItem('admin')
    
    if (!token || !adminData) {
      router.push('/admin/login')
      return
    }

    const parsedAdmin = JSON.parse(adminData)
    setAdmin(parsedAdmin)
    
    // Fetch dashboard data
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      // Mock data for demonstration
      setStats({
        totalUsers: 1247,
        totalShops: 89,
        activeSubscriptions: 892,
        todayTransactions: 156,
        monthlyRevenue: 2847500
      })

      setUsers([
        {
          id: '1',
          name: 'Rahul Kumar',
          email: 'rahul@example.com',
          mobile: '9876543210',
          qrCodeId: 'QR-USER-001',
          isActive: true,
          createdAt: '2024-01-15',
          subscription: {
            plan: { name: 'Family Pack' },
            status: 'active'
          }
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          mobile: '9876543211',
          qrCodeId: 'QR-USER-002',
          isActive: true,
          createdAt: '2024-01-20',
          subscription: {
            plan: { name: 'Basic' },
            status: 'active'
          }
        },
        {
          id: '3',
          name: 'Amit Singh',
          email: 'amit@example.com',
          mobile: '9876543212',
          qrCodeId: 'QR-USER-003',
          isActive: false,
          createdAt: '2024-02-01',
          subscription: {
            plan: { name: 'Premium' },
            status: 'expired'
          }
        }
      ])

      setShops([
        {
          id: '1',
          name: 'Annapurna General Store',
          email: 'annapurna@example.com',
          mobile: '9876543213',
          ownerName: 'Ramesh Kumar',
          isActive: true,
          createdAt: '2024-01-10'
        },
        {
          id: '2',
          name: 'Krishna Provision Store',
          email: 'krishna@example.com',
          mobile: '9876543214',
          ownerName: 'Suresh Patel',
          isActive: true,
          createdAt: '2024-01-12'
        },
        {
          id: '3',
          name: 'Maa Durga Kirana',
          email: 'maadurga@example.com',
          mobile: '9876543215',
          ownerName: 'Vijay Singh',
          isActive: false,
          createdAt: '2024-02-05'
        }
      ])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
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
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">QR Ration Admin</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/admin/users" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Users className="w-4 h-4" />
                  Users
                </Link>
                <Link href="/admin/shops" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Store className="w-4 h-4" />
                  Shops
                </Link>
                <Link href="/admin/analytics" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Admin: {admin.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the QR Smart Ration Network</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Partner Shops</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalShops}</p>
                </div>
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeSubscriptions.toLocaleString()}</p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.todayTransactions}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="users" className="mt-8">
          <TabsList>
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="shops">Recent Shops</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest user registrations and activity</CardDescription>
                  </div>
                  <Link href="/admin/users">
                    <Button variant="outline" size="sm">
                      View All Users
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email} • {user.mobile}</p>
                          <p className="text-xs text-muted-foreground">QR: {user.qrCodeId} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.subscription ? (
                          <Badge variant={user.subscription.status === 'active' ? 'default' : 'secondary'}>
                            {user.subscription.plan.name}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No Subscription</Badge>
                        )}
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shops" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Shops</CardTitle>
                    <CardDescription>Latest shop registrations and status</CardDescription>
                  </div>
                  <Link href="/admin/shops">
                    <Button variant="outline" size="sm">
                      View All Shops
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shops.map((shop) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-muted-foreground">Owner: {shop.ownerName}</p>
                          <p className="text-sm text-muted-foreground">{shop.email} • {shop.mobile}</p>
                          <p className="text-xs text-muted-foreground">Joined {new Date(shop.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={shop.isActive ? 'default' : 'secondary'}>
                          {shop.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts and subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  View All Users
                </Button>
              </Link>
              <Link href="/admin/subscriptions">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Subscriptions
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Shop Management
              </CardTitle>
              <CardDescription>
                Oversee partner shops and inventory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/shops">
                <Button variant="outline" className="w-full justify-start">
                  <Store className="w-4 h-4 mr-2" />
                  View All Shops
                </Button>
              </Link>
              <Link href="/admin/inventory">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Inventory Overview
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                System insights and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}