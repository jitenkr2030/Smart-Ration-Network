import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all active subscription plans
    const plans = await db.subscriptionPlan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        price: 'asc'
      }
    })

    return NextResponse.json({
      plans: plans.map(plan => ({
        ...plan,
        features: JSON.parse(plan.features || '[]')
      }))
    })

  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, duration, maxMembers, features } = await request.json()

    // Validate required fields
    if (!name || !price || !duration || !maxMembers) {
      return NextResponse.json(
        { error: 'Name, price, duration, and maxMembers are required' },
        { status: 400 }
      )
    }

    // Create subscription plan
    const plan = await db.subscriptionPlan.create({
      data: {
        name,
        description,
        price: price * 100, // Convert to paise
        duration,
        maxMembers,
        features: JSON.stringify(features || [])
      }
    })

    return NextResponse.json({
      message: 'Subscription plan created successfully',
      plan: {
        ...plan,
        features: JSON.parse(plan.features)
      }
    })

  } catch (error) {
    console.error('Error creating subscription plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}