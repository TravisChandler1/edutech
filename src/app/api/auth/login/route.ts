import { NextRequest, NextResponse } from 'next/server';
import { db as pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const { searchParams } = new URL(request.url);
    const isAdminLogin = searchParams.get('admin') === 'true';
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email with role information (check both direct role and user_roles table)
    const result = await pool.query(
      `SELECT 
        u.id, u.name, u.email, u.password_hash, u.created_at, u.role as direct_role,
        r.name as role_name, r.permissions
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = result.rows[0];
    
    // Determine the user's role (prefer direct_role, fallback to role_name)
    const userRole = user.direct_role || user.role_name || 'user';

    // For admin login, verify admin role
    if (isAdminLogin && userRole !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate JWT token with role information
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: userRole,
        permissions: user.permissions || []
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: isAdminLogin ? '8h' : '7d' } // Shorter session for admin
    );

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: isAdminLogin ? 'Admin login successful' : 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole,
        createdAt: user.created_at
      }
    });

    // Set httpOnly cookie with appropriate expiration
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: isAdminLogin ? 8 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 8 hours for admin, 7 days for regular users
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}