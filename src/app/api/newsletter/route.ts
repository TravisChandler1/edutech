import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotification, sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
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
    const adminNotification = await sendAdminNotification('newsletterSubscription', {
      name,
      email,
    });

    // Send welcome email to user
    const welcomeEmail = await sendWelcomeEmail(name, email);

    if (adminNotification.success) {
      return NextResponse.json({
        success: true,
        message: 'Newsletter subscription successful',
        adminNotified: adminNotification.success,
        welcomeEmailSent: welcomeEmail.success,
      });
    } else {
      console.error('Failed to send admin notification:', adminNotification.error);
      return NextResponse.json({
        success: true,
        message: 'Newsletter subscription successful, but admin notification failed',
        adminNotified: false,
        welcomeEmailSent: welcomeEmail.success,
      });
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}