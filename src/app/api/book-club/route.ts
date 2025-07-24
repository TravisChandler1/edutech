import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, level } = await request.json();

    // Validate input
    if (!name || !email || !level) {
      return NextResponse.json(
        { error: 'Name, email, and level are required' },
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
    const adminNotification = await sendAdminNotification('bookClubRegistration', {
      name,
      email,
      level,
      amount: '₦5,000', // Fixed amount for book club
    });

    if (adminNotification.success) {
      return NextResponse.json({
        success: true,
        message: 'Book club registration successful',
        adminNotified: true,
      });
    } else {
      console.error('Failed to send admin notification:', adminNotification.error);
      return NextResponse.json({
        success: true,
        message: 'Book club registration successful, but admin notification failed',
        adminNotified: false,
      });
    }
  } catch (error) {
    console.error('Book club registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}