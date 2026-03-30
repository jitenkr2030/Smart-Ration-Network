import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const shopId = searchParams.get('shopId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let whereClause = {}
    if (userId) whereClause = { ...whereClause, userId }
    if (shopId) whereClause = { ...whereClause, shopId }

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
      take: limit,
      skip: offset
    })

    const total = await db.transaction.count({ where: whereClause })

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
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

    // Get user's active subscription
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        endDate: {
          gte: new Date()
        }
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Calculate total quota points and validate items
    let totalQuotaPoints = 0
    const transactionItems = []

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        )
      }

      const itemPoints = product.quotaPoints * item.quantity
      totalQuotaPoints += itemPoints

      transactionItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.quotaPoints * 100, // Convert to paise (mock pricing)
        quotaPoints: itemPoints
      })
    }

    // Check if user has enough quota
    if (subscription.usedQuota + totalQuotaPoints > subscription.monthlyQuota) {
      return NextResponse.json(
        { error: 'Insufficient quota points' },
        { status: 400 }
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
        subscriptionId: subscription.id,
        totalQuotaPoints,
        status: 'completed',
        paymentMethod: paymentMethod || 'qr',
        notes
      },
      include: {
        user: true,
        shop: true,
        subscription: {
          include: {
            plan: true
          }
        }
      }
    })

    // Create transaction items
    for (const item of transactionItems) {
      await db.transactionItem.create({
        data: {
          transactionId: transaction.id,
          ...item
        }
      })
    }

    // Update subscription quota
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        usedQuota: subscription.usedQuota + totalQuotaPoints
      }
    })

    // Update shop inventory (decrement stock)
    for (const item of items) {
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
            quantity: Math.max(0, inventory.quantity - item.quantity)
          }
        })
      }
    }

    return NextResponse.json({
      message: 'Transaction completed successfully',
      transaction: {
        ...transaction,
        items: transactionItems
      },
      remainingQuota: subscription.monthlyQuota - (subscription.usedQuota + totalQuotaPoints)
    })

  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}