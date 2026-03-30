import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const qrCodeId = searchParams.get('qrCodeId')

    if (!userId && !qrCodeId) {
      return NextResponse.json(
        { error: 'User ID or QR Code ID is required' },
        { status: 400 }
      )
    }

    // Find user
    let user
    if (qrCodeId) {
      user = await db.user.findUnique({
        where: { qrCodeId },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          qrCodeId: true
        }
      })
    } else {
      user = await db.user.findUnique({
        where: { id: userId! },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          qrCodeId: true
        }
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate QR code data
    const qrData = JSON.stringify({
      userId: user.qrCodeId,
      type: 'USER',
      name: user.name,
      timestamp: new Date().toISOString()
    })

    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return NextResponse.json({
      qrCodeImage,
      qrCodeId: user.qrCodeId,
      qrData
    })

  } catch (error) {
    console.error('QR code generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { qrCodeId } = await request.json()

    if (!qrCodeId) {
      return NextResponse.json(
        { error: 'QR Code ID is required' },
        { status: 400 }
      )
    }

    // Find user by QR code ID
    const user = await db.user.findUnique({
      where: { qrCodeId },
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
        },
        familyMembers: true,
        _count: {
          select: {
            transactions: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid QR code' },
        { status: 404 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'User account is inactive' },
        { status: 403 }
      )
    }

    // Get active subscription or return null
    const activeSubscription = user.subscriptions[0] || null

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        qrCodeId: user.qrCodeId,
        address: user.address
      },
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        plan: activeSubscription.plan,
        monthlyQuota: activeSubscription.monthlyQuota,
        usedQuota: activeSubscription.usedQuota,
        remainingQuota: activeSubscription.monthlyQuota - activeSubscription.usedQuota,
        endDate: activeSubscription.endDate
      } : null,
      familyMembers: user.familyMembers,
      totalTransactions: user._count.transactions
    })

  } catch (error) {
    console.error('QR code verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}