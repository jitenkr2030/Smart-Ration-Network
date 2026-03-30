'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Home, 
  Users, 
  Store, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  ShoppingCart,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react'

interface AdminData {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
}

interface SystemStats {
  totalUsers: number
  totalShops: number
  activeSubscriptions: number
  monthlyRevenue: number
  totalTransactions: number
  pendingApprovals: number
}

interface RecentUser {
  id: string
  name: string
  email: string
  mobile: string
  createdAt: string
  subscriptionStatus: string
}

interface RecentShop {
  id: string
  name: string
  email: string
  ownerName: string
  createdAt: string
  status: string
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    totalShops: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    pendingApprovals: 0
  })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentShops, setRecentShops] = useState<RecentShop[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
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
      setSystemStats({
        totalUsers: 1247,
        totalShops: 89,
        activeSubscriptions: 892,
        monthlyRevenue: 2847600,
        totalTransactions: 5634,
        pendingApprovals: 12
      })

      setRecentUsers([
        {
          id: '1',
          name: 'Rahul Kumar',
          email: 'rahul.kumar@email.com',
          mobile: '9876543210',
          createdAt: '2024-11-15T10:30:00Z',
          subscriptionStatus: 'active'
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          mobile: '9876543211',
          createdAt: '2024-11-15T09:45:00Z',
          subscriptionStatus: 'pending'
        },
        {
          id: '3',
          name: 'Amit Singh',
          email: 'amit.singh@email.com',
          mobile: '9876543212',
          createdAt: '2024-11-14T16:20:00Z',
          subscriptionStatus: 'active'
        }
      ])

      setRecentShops([
        {
          id: '1',
          name: 'New General Store',
          email: 'newstore@email.com',
          ownerName: 'Ramesh Kumar',
          createdAt: '2024-11-15T11:00:00Z',
          status: 'pending'
        },
        {
          id: '2',
          name: 'City Provision Store',
          email: 'cityprovision@email.com',
          ownerName: 'Suresh Patel',
          createdAt: '2024-11-14T14:30:00Z',
          status: 'active'
        }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    router.push('/')
  }

  const filteredUsers = recentUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredShops = recentShops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <Link href="/admin/subscriptions" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <CreditCard className="w-4 h-4" />
                  Subscriptions
                </Link>
                <Link href="/admin/analytics" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {admin.name}</span>
              <Badge variant="secondary">{admin.role}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management controls</p>
        </div>

        {/* System Stats */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{systemStats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Shops</p>
                  <p className="text-2xl font-bold text-foreground">{systemStats.totalShops}</p>
                </div>
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Subs</p>
                  <p className="text-2xl font-bold text-foreground">{systemStats.activeSubscriptions}</p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₹{(systemStats.monthlyRevenue / 100).toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{systemStats.totalTransactions.toLocaleString()}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{systemStats.pendingApprovals}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users or shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Recent Activity Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="shops">Recent Shops</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent User Registrations
                </CardTitle>
                <CardDescription>
                  Latest users who have joined the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.mobile}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                          {user.subscriptionStatus}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full">
                      View All Users
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shops">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Recent Shop Registrations
                </CardTitle>
                <CardDescription>
                  Latest shops that have joined the partner network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredShops.map((shop) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-muted-foreground">{shop.email}</p>
                          <p className="text-xs text-muted-foreground">Owner: {shop.ownerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={shop.status === 'active' ? 'default' : 'secondary'}>
                          {shop.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(shop.createdAt).toLocaleDateString()}
                        </p>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Link href="/admin/shops">
                    <Button variant="outline" className="w-full">
                      View All Shops
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent System Activity
                </CardTitle>
                <CardDescription>
                  Latest transactions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: '1', type: 'transaction', user: 'Rahul Kumar', shop: 'Annapurna Store', amount: 350, time: '2 mins ago', status: 'completed' },
                    { id: '2', type: 'subscription', user: 'Priya Sharma', plan: 'Family Pack', amount: 3999, time: '15 mins ago', status: 'completed' },
                    { id: '3', type: 'registration', user: 'Amit Singh', type: 'User Registration', amount: 0, time: '1 hour ago', status: 'pending' }
                  ].map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === 'transaction' ? 'bg-blue-100' :
                          activity.type === 'subscription' ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          {activity.type === 'transaction' ? (
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                          ) : activity.type === 'subscription' ? (
                            <CreditCard className="w-5 h-5 text-green-600" />
                          ) : (
                            <UserPlus className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type === 'transaction' ? `Transaction at ${activity.shop}` :
                             activity.type === 'subscription' ? `Subscribed to ${activity.plan}` :
                             `New ${activity.type}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">₹{activity.amount}</span>
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Link href="/admin/transactions">
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}