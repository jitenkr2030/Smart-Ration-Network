'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { QrCode, User, Store, Shield, Check, AlertCircle, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState('user')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    aadhaarNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    ownerName: '',
    gstNumber: '',
    licenseNumber: '',
    shopAddress: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [qrCode, setQrCode] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      const endpoint = activeTab === 'user' ? '/api/auth/register' : '/api/auth/shop/register'
      const payload = activeTab === 'user' 
        ? {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            aadhaarNumber: formData.aadhaarNumber,
            address: formData.address,
            password: formData.password
          }
        : {
            name: formData.shopName,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.shopAddress,
            ownerName: formData.ownerName,
            gstNumber: formData.gstNumber,
            licenseNumber: formData.licenseNumber,
            password: formData.password
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setSuccess('Registration successful! Your QR code has been generated.')
      setQrCode(data.qrCodeImage)
      
      // Store token in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push(activeTab === 'user' ? '/dashboard' : '/shop/dashboard')
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <QrCode className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">QR Smart Ration Network</h1>
          </div>
          <p className="text-muted-foreground">Join the smart ration distribution system</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Register as a user or shop partner to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User
                  </TabsTrigger>
                  <TabsTrigger value="shop" className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Shop Partner
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          required
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="aadhaarNumber">Aadhaar Number (Optional)</Label>
                      <Input
                        id="aadhaarNumber"
                        name="aadhaarNumber"
                        type="text"
                        value={formData.aadhaarNumber}
                        onChange={handleInputChange}
                        placeholder="12-digit Aadhaar number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        placeholder="Your complete address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          placeholder="Min. 8 characters"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          placeholder="Re-enter password"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create User Account'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="shop" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="shopName">Shop Name</Label>
                      <Input
                        id="shopName"
                        name="shopName"
                        type="text"
                        value={formData.shopName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your shop name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        name="ownerName"
                        type="text"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                        placeholder="Shop owner's full name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          required
                          placeholder="10-digit mobile number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="shop@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                        <Input
                          id="gstNumber"
                          name="gstNumber"
                          type="text"
                          value={formData.gstNumber}
                          onChange={handleInputChange}
                          placeholder="GSTIN number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          placeholder="Business license"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shopAddress">Shop Address</Label>
                      <textarea
                        id="shopAddress"
                        name="shopAddress"
                        value={formData.shopAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        placeholder="Complete shop address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          placeholder="Min. 8 characters"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          placeholder="Re-enter password"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Register Shop'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert className="mt-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4">
                  <Check className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Your Digital Identity
                </CardTitle>
                <CardDescription>
                  Once registered, you'll get a unique QR code that serves as your digital ration card
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {qrCode ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-64 h-64 bg-white p-4 rounded-lg shadow-sm">
                      <img src={qrCode} alt="Your QR Code" className="w-full h-full" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-sm">
                        QR ID Generated
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Save this QR code safely. You'll need it for all ration transactions.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-64 h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-slate-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your QR code will appear here after successful registration
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits of Joining</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Instant QR Verification</p>
                    <p className="text-sm text-muted-foreground">No more physical cards needed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Monthly Subscription Plans</p>
                    <p className="text-sm text-muted-foreground">Flexible plans for every family size</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Real-time Quota Tracking</p>
                    <p className="text-sm text-muted-foreground">Track your monthly ration allowance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Wide Partner Network</p>
                    <p className="text-sm text-muted-foreground">Access shops near you</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}