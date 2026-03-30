import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const shopId = searchParams.get('shopId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    let whereClause = {}
    
    if (userId) {
      whereClause = { ...whereClause, userId }
    }
    
    if (shopId) {
      whereClause = { ...whereClause, shopId }
    }

    const transactions = await db.transaction.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true,
            address: true
          }
        },
        subscription: {
          include: {
            plan: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const total = await db.transaction.count({
      where: whereClause
    })

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, shopId, items, paymentMethod, notes } = await request.json()

    // Validate required fields
    if (!userId || !shopId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'User ID, shop ID, and items are required' },
        { status: 400 }
      )
    }

    // Get user and active subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: 'active',
            endDate: {
              gte: new Date()
            }
          },
          include: {
            plan: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const activeSubscription = user.subscriptions[0]
    if (!activeSubscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Check if user has enough quota
    const totalQuotaPoints = items.reduce((sum: number, item: any) => sum + (item.quotaPoints * item.quantity), 0)
    
    if (activeSubscription.usedQuota + totalQuotaPoints > activeSubscription.monthlyQuota) {
      return NextResponse.json(
        { error: 'Insufficient quota points' },
        { status: 400 }
      )
    }

    // Verify shop exists
    const shop = await db.shop.findUnique({
      where: { id: shopId }
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        transactionId,
        userId,
        shopId,
        subscriptionId: activeSubscription.id,
        totalQuotaPoints,
        status: 'completed',
        paymentMethod: paymentMethod || 'qr',
        notes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    })

    // Create transaction items and update inventory
    for (const item of items) {
      // Create transaction item
      await db.transactionItem.create({
        data: {
          transactionId: transaction.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice || 0,
          quotaPoints: item.quotaPoints
        }
      })

      // Update inventory
      const inventory = await db.inventory.findUnique({
        where: {
          shopId_productId: {
            shopId,
            productId: item.productId
          }
        }
      })

      if (inventory) {
        await db.inventory.update({
          where: {
            shopId_productId: {
              shopId,
              productId: item.productId
            }
          },
          data: {
            quantity: Math.max(0, inventory.quantity - item.quantity),
            lastUpdated: new Date()
          }
        })
      }
    }

    // Update user's used quota
    await db.subscription.update({
      where: { id: activeSubscription.id },
      data: {
        usedQuota: activeSubscription.usedQuota + totalQuotaPoints
      }
    })

    return NextResponse.json({
      message: 'Transaction completed successfully',
      transaction,
      remainingQuota: activeSubscription.monthlyQuota - (activeSubscription.usedQuota + totalQuotaPoints)
    })

  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}