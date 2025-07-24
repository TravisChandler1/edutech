import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, service, amount, paymentMethod, transactionId } = await request.json();

    // Validate input
    if (!name || !email || !service || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Name, email, service, amount, and payment method are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send admin notification
    const adminNotification = await sendAdminNotification('paymentReceived', {
      name,
      email,
      service,
      amount,
      paymentMethod,
      transactionId,
    });

    if (adminNotification.success) {
      return NextResponse.json({
        success: true,
        message: 'Payment notification sent successfully',
        adminNotified: true,
      });
    } else {
      console.error('Failed to send admin notification:', adminNotification.error);
      return NextResponse.json({
        success: false,
        message: 'Failed to send payment notification',
        adminNotified: false,
        error: adminNotification.error,
      });
    }
  } catch (error) {
    console.error('Payment notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}