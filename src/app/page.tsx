'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QRCode, Smartphone, Store, Users, TrendingUp, Shield } from 'lucide-react'

export default function Home() {
  const [activeRole, setActiveRole] = useState<'user' | 'shop' | 'admin'>('user')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <QRCode className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">QR Smart Ration Network</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#plans" className="text-sm font-medium hover:text-primary transition-colors">Plans</a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            </nav>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Revolutionizing Ration Distribution
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            UPI jaisa Network +
            <br />
            <span className="text-primary">BigBasket jaisa System</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A hybrid QR-based identity system with subscription-based ration supply. 
            Smart, efficient, and transparent distribution for everyone.
          </p>
          
          {/* Role Selection */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant={activeRole === 'user' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setActiveRole('user')}
              className="flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              I'm a User
            </Button>
            <Button
              variant={activeRole === 'shop' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setActiveRole('shop')}
              className="flex items-center gap-2"
            >
              <Store className="w-5 h-5" />
              I'm a Shop Owner
            </Button>
            <Button
              variant={activeRole === 'admin' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setActiveRole('admin')}
              className="flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              I'm an Admin
            </Button>
          </div>

          {/* Role-specific CTA */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeRole === 'user' && <><Users className="w-5 h-5" /> Get Your Ration Card</>}
                {activeRole === 'shop' && <><Store className="w-5 h-5" /> Become a Partner</>}
                {activeRole === 'admin' && <><Shield className="w-5 h-5" /> Admin Dashboard</>}
              </CardTitle>
              <CardDescription>
                {activeRole === 'user' && 'Sign up for QR-based ration distribution with monthly subscription plans'}
                {activeRole === 'shop' && 'Join our network and serve customers with smart ration distribution'}
                {activeRole === 'admin' && 'Manage users, shops, and monitor the entire network'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={activeRole === 'user' ? '/register' : activeRole === 'shop' ? '/register' : '/admin/login'}>
                <Button className="w-full" size="lg">
                  {activeRole === 'user' && 'Create Account'}
                  {activeRole === 'shop' && 'Register Shop'}
                  {activeRole === 'admin' && 'Login to Admin'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Core Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for modern ration distribution management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <QRCode className="w-10 h-10 text-primary mb-2" />
                <CardTitle>QR-based Identity</CardTitle>
                <CardDescription>
                  Unique QR code for every user for instant verification and transactions
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Flexible monthly plans from ₹1999 to ₹5999 for different family sizes
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Smartphone className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Mobile First</CardTitle>
                <CardDescription>
                  Complete mobile app for users and shops with offline support
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Store className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Partner Network</CardTitle>
                <CardDescription>
                  Extensive network of partner shops for convenient access
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Quota Tracking</CardTitle>
                <CardDescription>
                  Real-time quota tracking and monthly allowance management
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Secure System</CardTitle>
                <CardDescription>
                  End-to-end encryption and secure transaction processing
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="plans" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Subscription Plans</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your family's needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Basic</CardTitle>
                <div className="text-3xl font-bold text-primary">₹1999<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <CardDescription>Perfect for individuals and couples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Basic ration essentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Monthly quota tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Access to 5+ partner shops</span>
                </div>
                <Link href="/register">
                  <Button className="w-full mt-6">Choose Basic</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Family Pack</CardTitle>
                <div className="text-3xl font-bold text-primary">₹3999<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <CardDescription>Ideal for families of 4-6 members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Complete family ration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Access to 15+ partner shops</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Monthly reports</span>
                </div>
                <Link href="/register">
                  <Button className="w-full mt-6">Choose Family</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Premium</CardTitle>
                <div className="text-3xl font-bold text-primary">₹5999<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <CardDescription>For large families and special needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Premium ration items</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Dedicated support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Unlimited shop access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Custom quota management</span>
                </div>
                <Link href="/register">
                  <Button className="w-full mt-6">Choose Premium</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <QRCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-bold">QR Ration</h4>
              </div>
              <p className="text-slate-400 text-sm">
                Smart ration distribution for modern India
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 QR Smart Ration Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}