'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  PieChart,
  Activity,
  DollarSign,
  ShoppingCart,
  UserPlus,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download
} from 'lucide-react'

interface AdminData {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
}

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalShops: number
    activeSubscriptions: number
    monthlyRevenue: number
    totalTransactions: number
    averageTransactionValue: number
  }
  growth: {
    userGrowth: number
    shopGrowth: number
    revenueGrowth: number
    transactionGrowth: number
  }
  subscriptionBreakdown: Array<{
    planName: string
    count: number
    revenue: number
    percentage: number
  }>
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  monthlyTrends: Array<{
    month: string
    users: number
    shops: number
    revenue: number
    transactions: number
  }>
}

export default function AdminAnalytics() {
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

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
    
    // Fetch analytics data
    fetchAnalytics()
  }, [router, timeRange])

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalUsers: 1247,
          totalShops: 89,
          activeSubscriptions: 892,
          monthlyRevenue: 2847600,
          totalTransactions: 5634,
          averageTransactionValue: 506
        },
        growth: {
          userGrowth: 15.3,
          shopGrowth: 8.7,
          revenueGrowth: 22.1,
          transactionGrowth: 18.9
        },
        subscriptionBreakdown: [
          { planName: 'Basic', count: 342, revenue: 684300, percentage: 38.3 },
          { planName: 'Family Pack', count: 445, revenue: 1779555, percentage: 49.9 },
          { planName: 'Premium', count: 105, revenue: 629745, percentage: 11.8 }
        ],
        topProducts: [
          { name: 'Rice', quantity: 2340, revenue: 468000 },
          { name: 'Wheat Flour', quantity: 1890, revenue: 283500 },
          { name: 'Cooking Oil', quantity: 890, revenue: 267000 },
          { name: 'Pulses', quantity: 670, revenue: 234500 },
          { name: 'Sugar', quantity: 560, revenue: 140000 }
        ],
        monthlyTrends: [
          { month: 'Jun', users: 980, shops: 72, revenue: 2145000, transactions: 4200 },
          { month: 'Jul', users: 1050, shops: 76, revenue: 2310000, transactions: 4520 },
          { month: 'Aug', users: 1120, shops: 81, revenue: 2489000, transactions: 4890 },
          { month: 'Sep', users: 1180, shops: 84, revenue: 2656000, transactions: 5230 },
          { month: 'Oct', users: 1210, shops: 87, revenue: 2789000, transactions: 5480 },
          { month: 'Nov', users: 1247, shops: 89, revenue: 2847600, transactions: 5634 }
        ]
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    router.push('/')
  }

  const exportData = () => {
    // Mock export functionality
    alert('Export functionality would download analytics data as CSV/Excel')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!admin || !analytics) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">QR Ration Admin</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
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
                <Link href="/admin/analytics" className="flex items-center gap-2 text-sm font-medium text-primary">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into system performance and usage</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-600" />
                +{analytics.growth.userGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Shops</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalShops}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-600" />
                +{analytics.growth.shopGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(analytics.overview.monthlyRevenue / 100).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-600" />
                +{analytics.growth.revenueGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-600" />
                +{analytics.growth.transactionGrowth}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                  <CardDescription>Breakdown of active subscriptions by plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.subscriptionBreakdown.map((plan) => (
                      <div key={plan.planName} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{plan.planName}</span>
                          <span className="text-sm text-muted-foreground">{plan.count} users</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${plan.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{plan.percentage}% of total</span>
                          <span>₹{(plan.revenue / 100).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Plan</CardTitle>
                  <CardDescription>Monthly revenue contribution by subscription tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.subscriptionBreakdown.map((plan) => (
                      <div key={plan.planName} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{plan.planName}</p>
                          <p className="text-sm text-muted-foreground">{plan.count} subscribers</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{(plan.revenue / 100).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{plan.percentage}% share</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Most purchased products by quantity and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.quantity.toLocaleString()} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{(product.revenue / 100).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>System growth and usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">User Growth</h4>
                    <div className="grid grid-cols-6 gap-4">
                      {analytics.monthlyTrends.map((trend) => (
                        <div key={trend.month} className="text-center">
                          <div className="w-full bg-slate-200 rounded-t-lg relative">
                            <div
                              className="bg-blue-600 rounded-t-lg absolute bottom-0 w-full"
                              style={{ height: `${(trend.users / 1500) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs font-medium mt-2">{trend.month}</p>
                          <p className="text-xs text-muted-foreground">{trend.users}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Revenue Trend</h4>
                    <div className="grid grid-cols-6 gap-4">
                      {analytics.monthlyTrends.map((trend) => (
                        <div key={trend.month} className="text-center">
                          <div className="w-full bg-slate-200 rounded-t-lg relative">
                            <div
                              className="bg-green-600 rounded-t-lg absolute bottom-0 w-full"
                              style={{ height: `${(trend.revenue / 3000000) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs font-medium mt-2">{trend.month}</p>
                          <p className="text-xs text-muted-foreground">₹{(trend.revenue / 100000).toFixed(1)}L</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>System performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Average Transaction Value</span>
                    <span className="font-bold">₹{analytics.overview.averageTransactionValue}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Active Subscription Rate</span>
                    <span className="font-bold">
                      {((analytics.overview.activeSubscriptions / analytics.overview.totalUsers) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Transactions per User</span>
                    <span className="font-bold">
                      {(analytics.overview.totalTransactions / analytics.overview.totalUsers).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Revenue per User</span>
                    <span className="font-bold">
                      ₹{Math.round(analytics.overview.monthlyRevenue / analytics.overview.activeSubscriptions)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                  <CardDescription>Month-over-month growth rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>User Growth</span>
                    <Badge variant="default" className="bg-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      {analytics.growth.userGrowth}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Shop Growth</span>
                    <Badge variant="default" className="bg-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      {analytics.growth.shopGrowth}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Revenue Growth</span>
                    <Badge variant="default" className="bg-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      {analytics.growth.revenueGrowth}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Transaction Growth</span>
                    <Badge variant="default" className="bg-green-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      {analytics.growth.transactionGrowth}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}