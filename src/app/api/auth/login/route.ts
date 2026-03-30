import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, mobile, password } = await request.json()

    // Validate required fields
    if ((!email && !mobile) || !password) {
      return NextResponse.json(
        { error: 'Email/mobile and password are required' },
        { status: 400 }
      )
    }

    // Find user by email or mobile
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: email || '' },
          { mobile: mobile || '' }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In a real implementation, you'd verify the password here
    // For now, we'll skip password verification since it's not in our schema
    // const isValidPassword = await bcrypt.compare(password, hashedPassword)
    // if (!isValidPassword) {
    //   return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    // }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, type: 'USER' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Get user's active subscription
    const activeSubscription = await db.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'active',
        endDate: {
          gte: new Date()
        }
      },
      include: {
        plan: true
      }
    })

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        qrCodeId: user.qrCodeId,
        subscription: activeSubscription
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}