import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')
    const category = searchParams.get('category')

    let whereClause: any = {
      isActive: true
    }

    if (category) {
      whereClause.category = category
    }

    let products = await db.product.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'
      }
    })

    // If shopId is provided, include inventory information
    if (shopId) {
      products = await db.product.findMany({
        where: whereClause,
        include: {
          inventory: {
            where: {
              shopId
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    }

    return NextResponse.json({
      products: products.map(product => ({
        ...product,
        inStock: shopId && product.inventory && product.inventory.length > 0 
          ? product.inventory[0].quantity > 0 
          : true,
        stockQuantity: shopId && product.inventory && product.inventory.length > 0 
          ? product.inventory[0].quantity 
          : null,
        inventory: undefined // Remove inventory from response
      }))
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, unit, quotaPoints, description } = await request.json()

    // Validate required fields
    if (!name || !category || !unit || quotaPoints === undefined) {
      return NextResponse.json(
        { error: 'Name, category, unit, and quota points are required' },
        { status: 400 }
      )
    }

    // Create product
    const product = await db.product.create({
      data: {
        name,
        category,
        unit,
        quotaPoints,
        description
      }
    })

    return NextResponse.json({
      message: 'Product created successfully',
      product
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}