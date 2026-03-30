import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create subscription plans
  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'basic-plan-1' },
    update: {},
    create: {
      id: 'basic-plan-1',
      name: 'Basic',
      description: 'Perfect for individuals and couples',
      price: 199900, // ₹1999 in paise
      duration: 1, // 1 month
      maxMembers: 2,
      features: JSON.stringify([
        'Basic ration essentials',
        'Monthly quota tracking',
        'Access to 5+ partner shops',
        'Email support'
      ])
    }
  })

  const familyPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'family-plan-1' },
    update: {},
    create: {
      id: 'family-plan-1',
      name: 'Family Pack',
      description: 'Ideal for families of 4-6 members',
      price: 399900, // ₹3999 in paise
      duration: 1, // 1 month
      maxMembers: 6,
      features: JSON.stringify([
        'Complete family ration',
        'Priority support',
        'Access to 15+ partner shops',
        'Monthly reports',
        'Family member management'
      ])
    }
  })

  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'premium-plan-1' },
    update: {},
    create: {
      id: 'premium-plan-1',
      name: 'Premium',
      description: 'For large families and special needs',
      price: 599900, // ₹5999 in paise
      duration: 1, // 1 month
      maxMembers: 10,
      features: JSON.stringify([
        'Premium ration items',
        'Dedicated support',
        'Unlimited shop access',
        'Custom quota management',
        'Advanced analytics',
        'Priority delivery'
      ])
    }
  })

  // Create some products
  const products = [
    { id: 'rice-1', name: 'Rice', category: 'grains', unit: 'kg', quotaPoints: 20, description: 'Premium quality rice' },
    { id: 'wheat-1', name: 'Wheat Flour', category: 'grains', unit: 'kg', quotaPoints: 15, description: 'Whole wheat flour' },
    { id: 'oil-1', name: 'Cooking Oil', category: 'oils', unit: 'liters', quotaPoints: 30, description: 'Refined cooking oil' },
    { id: 'sugar-1', name: 'Sugar', category: 'essentials', unit: 'kg', quotaPoints: 25, description: 'Refined sugar' },
    { id: 'salt-1', name: 'Salt', category: 'essentials', unit: 'kg', quotaPoints: 5, description: 'Iodized salt' },
    { id: 'pulses-1', name: 'Pulses', category: 'grains', unit: 'kg', quotaPoints: 35, description: 'Mixed pulses' },
    { id: 'spices-1', name: 'Spices Mix', category: 'spices', unit: 'packets', quotaPoints: 15, description: 'Essential spice mix' },
    { id: 'tea-1', name: 'Tea', category: 'beverages', unit: 'packets', quotaPoints: 20, description: 'Tea packets' }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product
    })
  }

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@user.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@user.com',
      mobile: '9876543210',
      address: '123 Demo Street, Delhi, India',
      qrCodeId: 'QR-DEMO-USER-001'
    }
  })

  // Create demo shop
  const demoShop = await prisma.shop.upsert({
    where: { email: 'demo@shop.com' },
    update: {},
    create: {
      name: 'Annapurna General Store',
      email: 'demo@shop.com',
      mobile: '9876543211',
      address: '456 Market Road, Delhi, India',
      ownerName: 'Shop Owner',
      gstNumber: 'GSTDEMO12345',
      licenseNumber: 'LICDEMO67890'
    }
  })

  // Create demo subscription for demo user
  const demoSubscription = await prisma.subscription.upsert({
    where: { id: 'demo-subscription-1' },
    update: {},
    create: {
      id: 'demo-subscription-1',
      userId: demoUser.id,
      planId: familyPlan.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active',
      monthlyQuota: 1000,
      usedQuota: 350,
      paymentStatus: 'paid',
      lastPaymentDate: new Date(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })

  // Create demo admin
  const demoAdmin = await prisma.admin.upsert({
    where: { email: 'admin@qr-ration.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@qr-ration.com',
      mobile: '9876543212',
      role: 'super_admin',
      permissions: JSON.stringify(['all'])
    }
  })

  // Create demo inventory for demo shop
  const allProducts = await prisma.product.findMany()
  for (const product of allProducts) {
    await prisma.inventory.upsert({
      where: {
        shopId_productId: {
          shopId: demoShop.id,
          productId: product.id
        }
      },
      update: {},
      create: {
        shopId: demoShop.id,
        productId: product.id,
        quantity: Math.floor(Math.random() * 500) + 100, // Random quantity between 100-600
        reorderLevel: 50
      }
    })
  }

  console.log('Database seeded successfully!')
  console.log('Demo User Credentials:')
  console.log('Email: demo@user.com')
  console.log('Mobile: 9876543210')
  console.log('Password: demo123')
  console.log('')
  console.log('Demo Shop Credentials:')
  console.log('Email: demo@shop.com')
  console.log('Mobile: 9876543211')
  console.log('Password: demo123')
  console.log('')
  console.log('Admin Credentials:')
  console.log('Email: admin@qr-ration.com')
  console.log('Mobile: 9876543212')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })