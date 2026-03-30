'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Home, 
  CreditCard, 
  History, 
  Users, 
  Settings, 
  LogOut,
  QRCode,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw
} from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  mobile: string
  qrCodeId: string
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  maxMembers: number
  features: string[]
}

interface Subscription {
  id: string
  plan: SubscriptionPlan
  startDate: string
  endDate: string
  status: string
  monthlyQuota: number
  usedQuota: number
  remainingQuota: number
  paymentStatus: string
  lastPaymentDate: string
  nextPaymentDate: string
}

interface Payment {
  id: string
  transactionId: string
  amount: number
  paymentMethod: string
  status: string
  createdAt: string
}

export default function SubscriptionPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
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
    
    // Fetch subscription data
    fetchSubscriptionData()
    fetchPlans()
    fetchPaymentHistory()
  }, [router])

  const fetchSubscriptionData = async () => {
    try {
      // Mock subscription data
      const mockSubscription: Subscription = {
        id: 'sub_1',
        plan: {
          id: 'family-plan-1',
          name: 'Family Pack',
          description: 'Ideal for families of 4-6 members',
          price: 399900,
          duration: 1,
          maxMembers: 6,
          features: [
            'Complete family ration',
            'Priority support',
            'Access to 15+ partner shops',
            'Monthly reports',
            'Family member management'
          ]
        },
        startDate: '2024-11-01T00:00:00Z',
        endDate: '2024-12-01T00:00:00Z',
        status: 'active',
        monthlyQuota: 1000,
        usedQuota: 350,
        remainingQuota: 650,
        paymentStatus: 'paid',
        lastPaymentDate: '2024-11-01T10:30:00Z',
        nextPaymentDate: '2024-12-01T00:00:00Z'
      }

      setSubscription(mockSubscription)
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    }
  }

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription-plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
  }

  const fetchPaymentHistory = async () => {
    try {
      // Mock payment history
      const mockPayments: Payment[] = [
        {
          id: '1',
          transactionId: 'PAY202411001',
          amount: 399900,
          paymentMethod: 'razorpay',
          status: 'completed',
          createdAt: '2024-11-01T10:30:00Z'
        },
        {
          id: '2',
          transactionId: 'PAY202410001',
          amount: 399900,
          paymentMethod: 'upi',
          status: 'completed',
          createdAt: '2024-10-01T10:30:00Z'
        },
        {
          id: '3',
          transactionId: 'PAY202409001',
          amount: 199900,
          paymentMethod: 'wallet',
          status: 'completed',
          createdAt: '2024-09-01T10:30:00Z'
        }
      ]

      setPayments(mockPayments)
    } catch (error) {
      console.error('Error fetching payment history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradePlan = async (planId: string) => {
    setProcessing(true)
    setResult({ type: null, message: '' })

    try {
      // In a real implementation, this would process the payment and upgrade the plan
      // For demo purposes, we'll simulate the upgrade
      
      const selectedPlan = plans.find(p => p.id === planId)
      if (!selectedPlan) {
        throw new Error('Plan not found')
      }

      // Simulate payment processing
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: subscription?.id,
          amount: selectedPlan.price,
          paymentMethod: 'razorpay',
          paymentDetails: {}
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      setResult({ 
        type: 'success', 
        message: `Successfully upgraded to ${selectedPlan.name}! Transaction ID: ${data.payment.transactionId}` 
      })

      // Refresh subscription data
      setTimeout(() => {
        fetchSubscriptionData()
        fetchPaymentHistory()
        setResult({ type: null, message: '' })
      }, 2000)

    } catch (error: any) {
      setResult({ type: 'error', message: error.message })
    } finally {
      setProcessing(false)
    }
  }

  const handleRenewSubscription = async () => {
    if (!subscription) return

    setProcessing(true)
    setResult({ type: null, message: '' })

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          amount: subscription.plan.price,
          paymentMethod: 'razorpay',
          paymentDetails: {}
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Renewal failed')
      }

      setResult({ 
        type: 'success', 
        message: `Subscription renewed successfully! Transaction ID: ${data.payment.transactionId}` 
      })

      // Refresh subscription data
      setTimeout(() => {
        fetchSubscriptionData()
        fetchPaymentHistory()
        setResult({ type: null, message: '' })
      }, 2000)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subscription data...</p>
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
                  <QRCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">QR Ration</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/dashboard/subscription" className="flex items-center gap-2 text-sm font-medium text-primary">
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
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Management</h1>
          <p className="text-muted-foreground">Manage your subscription plan and payment methods</p>
        </div>

        {result.type && (
          <Alert className={`mb-6 ${result.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            {result.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Current Plan</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade Plan</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {subscription ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Current Subscription
                        </CardTitle>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Your active subscription plan and usage details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{subscription.plan.name}</h3>
                        <p className="text-muted-foreground mb-4">{subscription.plan.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Monthly Price:</span>
                              <span className="font-medium">₹{subscription.plan.price / 100}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Billing Cycle:</span>
                              <span className="font-medium">{subscription.plan.duration} month(s)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Max Members:</span>
                              <span className="font-medium">{subscription.plan.maxMembers}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Started:</span>
                              <span className="font-medium">
                                {new Date(subscription.startDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Renews:</span>
                              <span className="font-medium">
                                {new Date(subscription.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payment Status:</span>
                              <Badge variant={subscription.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                                {subscription.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Plan Features</h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {subscription.plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-4">Quota Usage</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Used: {subscription.usedQuota} points</span>
                            <span>Remaining: {subscription.remainingQuota} points</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                              className="bg-primary h-3 rounded-full"
                              style={{ width: `${(subscription.usedQuota / subscription.monthlyQuota) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <span>{subscription.monthlyQuota} points (monthly quota)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleRenewSubscription} disabled={processing}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {processing ? 'Processing...' : 'Renew Now'}
                        </Button>
                        <Button variant="outline">
                          Download Invoice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Active Subscription</CardTitle>
                      <CardDescription>
                        You don't have an active subscription. Choose a plan to get started.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/dashboard/subscription?tab=upgrade">
                        <Button>Choose a Plan</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{subscription?.remainingQuota || 0}</p>
                      <p className="text-sm text-muted-foreground">Points Remaining</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{subscription?.usedQuota || 0}</p>
                      <p className="text-sm text-muted-foreground">Points Used</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{subscription?.monthlyQuota || 0}</p>
                      <p className="text-sm text-muted-foreground">Monthly Quota</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Billing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {subscription ? new Date(subscription.nextPaymentDate).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">Next payment date</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            ₹{subscription ? subscription.plan.price / 100 : 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Amount to be charged</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upgrade">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={subscription?.plan.id === plan.id ? 'border-primary' : ''}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">
                      ₹{plan.price / 100}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    {subscription?.plan.id === plan.id && (
                      <Badge variant="default" className="mx-auto">Current Plan</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full" 
                      disabled={subscription?.plan.id === plan.id || processing}
                      onClick={() => handleUpgradePlan(plan.id)}
                    >
                      {subscription?.plan.id === plan.id ? 'Current Plan' : 
                       processing ? 'Processing...' : 'Upgrade Now'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Your recent payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.transactionId}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.paymentMethod.toUpperCase()} • {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{payment.amount / 100}</p>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No payment history</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}