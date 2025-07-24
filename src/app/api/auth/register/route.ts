import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const createdAt = new Date().toISOString();
    
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at',
      [name, email, passwordHash, createdAt]
    );

    const user = result.rows[0];
    
    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}