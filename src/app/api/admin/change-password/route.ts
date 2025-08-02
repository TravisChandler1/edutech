import { NextRequest, NextResponse } from 'next/server';
import { db as pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Verify authentication
    const authUser = await verifyAuth(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user from database
    const userResult = await pool.query(
      `SELECT id, password_hash, role
       FROM users
       WHERE id = $1`,
      [authUser.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
