import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')

    if (!shopId) {
      return NextResponse.json(
        { error: 'Shop ID is required' },
        { status: 400 }
      )
    }

    const inventory = await db.inventory.findMany({
      where: {
        shopId
      },
      include: {
        product: true
      },
      orderBy: {
        lastUpdated: 'desc'
      }
    })

    // Get low stock items
    const lowStockItems = inventory.filter(item => 
      item.quantity <= item.reorderLevel
    )

    return NextResponse.json({
      inventory,
      lowStockItems: lowStockItems.length,
      totalItems: inventory.length
    })

  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { shopId, productId, quantity, reorderLevel } = await request.json()

    // Validate required fields
    if (!shopId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Shop ID, product ID, and quantity are required' },
        { status: 400 }
      )
    }

    // Upsert inventory
    const inventory = await db.inventory.upsert({
      where: {
        shopId_productId: {
          shopId,
          productId
        }
      },
      update: {
        quantity,
        reorderLevel: reorderLevel || 50,
        lastUpdated: new Date()
      },
      create: {
        shopId,
        productId,
        quantity,
        reorderLevel: reorderLevel || 50
      },
      include: {
        product: true
      }
    })

    return NextResponse.json({
      message: 'Inventory updated successfully',
      inventory
    })

  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}