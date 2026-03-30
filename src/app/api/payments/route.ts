import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, amount, paymentMethod, paymentDetails } = await request.json()

    // Validate required fields
    if (!subscriptionId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Subscription ID, amount, and payment method are required' },
        { status: 400 }
      )
    }

    // Get subscription details
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: true,
        plan: true
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // In a real implementation, you would integrate with payment gateways like Razorpay, Stripe, etc.
    // For demo purposes, we'll simulate a successful payment
    
    let paymentStatus = 'completed'
    let transactionId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // Simulate payment processing based on method
    if (paymentMethod === 'razorpay') {
      // Mock Razorpay integration
      paymentStatus = 'completed'
    } else if (paymentMethod === 'upi') {
      // Mock UPI payment
      paymentStatus = 'completed'
    } else if (paymentMethod === 'wallet') {
      // Mock wallet payment
      paymentStatus = 'completed'
    }

    if (paymentStatus === 'completed') {
      // Update subscription
      const newEndDate = new Date(subscription.endDate)
      newEndDate.setMonth(newEndDate.getMonth() + subscription.plan.duration)
      
      await db.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'active',
          paymentStatus: 'paid',
          lastPaymentDate: new Date(),
          nextPaymentDate: newEndDate,
          endDate: newEndDate,
          isActive: true
        }
      })

      // Create a payment record (you might want to add a payments table)
      // For now, we'll just return the success response

      return NextResponse.json({
        message: 'Payment processed successfully',
        payment: {
          transactionId,
          amount,
          paymentMethod,
          status: paymentStatus,
          subscriptionId,
          userId: subscription.userId,
          planName: subscription.plan.name,
          nextBillingDate: newEndDate
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Payment processing failed' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const subscriptionId = searchParams.get('subscriptionId')

    if (!userId && !subscriptionId) {
      return NextResponse.json(
        { error: 'User ID or Subscription ID is required' },
        { status: 400 }
      )
    }

    // Get payment history (mock data for now)
    const paymentHistory = [
      {
        id: '1',
        transactionId: 'PAY202411001',
        subscriptionId: subscriptionId || 'sub_1',
        amount: 399900,
        paymentMethod: 'razorpay',
        status: 'completed',
        createdAt: '2024-11-01T10:30:00Z'
      },
      {
        id: '2',
        transactionId: 'PAY202410001',
        subscriptionId: subscriptionId || 'sub_1',
        amount: 399900,
        paymentMethod: 'upi',
        status: 'completed',
        createdAt: '2024-10-01T10:30:00Z'
      }
    ]

    return NextResponse.json({
      payments: paymentHistory
    })

  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}