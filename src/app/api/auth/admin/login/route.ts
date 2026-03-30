import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find admin by email
    const admin = await db.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Admin account is inactive' },
        { status: 403 }
      )
    }

    // In a real implementation, you'd verify the password here
    // For demo purposes, we'll check against the demo password
    if (password !== 'admin123' && email !== 'admin@qr-ration.com') {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    await db.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email, 
        role: admin.role,
        type: 'ADMIN'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      message: 'Admin login successful',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: JSON.parse(admin.permissions || '[]')
      },
      token
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}