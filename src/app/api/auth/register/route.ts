import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import QRCode from 'qrcode'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, aadhaarNumber, address, password } = await request.json()

    // Validate required fields
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: 'Name, email, mobile, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { mobile }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or mobile already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate unique QR code ID
    const qrCodeId = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Generate QR code data
    const qrData = JSON.stringify({
      userId: qrCodeId,
      type: 'USER',
      timestamp: new Date().toISOString()
    })

    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrData)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        mobile,
        aadhaarNumber,
        address,
        qrCodeId,
        // Note: We're not storing password in the User model as per schema
        // In production, you'd want to add a password field or use a separate auth table
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        qrCodeId: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, type: 'USER' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      message: 'User registered successfully',
      user,
      token,
      qrCodeImage,
      qrCodeId
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}