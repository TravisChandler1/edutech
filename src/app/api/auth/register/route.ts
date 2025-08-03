import { NextRequest, NextResponse } from 'next/server';
import { db as pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log('Registration API called');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed:', { ...body, password: '[REDACTED]' });
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { 
      name, 
      email, 
      password, 
      role, 
      selectedPlan, 
      selectedCategory, 
      bio, 
      qualifications, 
      experience 
    } = body;
    
    // Validate input
    if (!name || !email || !password || !role) {
      console.log('Validation failed: missing required fields');
      return NextResponse.json({ error: 'Name, email, password, and role are required' }, { status: 400 });
    }

    // Validate role
    if (!['student', 'teacher'].includes(role)) {
      console.log('Validation failed: invalid role');
      return NextResponse.json({ error: 'Role must be either student or teacher' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email format');
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      console.log('Validation failed: password too short');
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    console.log('Validation passed, checking database connection...');

    // Test database connection
    try {
      await pool.query('SELECT 1');
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Ensure tables exist
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'pending')),
          selected_plan VARCHAR(20) CHECK (selected_plan IN ('Novice', 'Beginner', 'Intermediate', 'Advanced')),
          selected_category VARCHAR(20) CHECK (selected_category IN ('Group', 'Individual')),
          email_verified BOOLEAN DEFAULT FALSE,
          profile_image VARCHAR(500),
          bio TEXT,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS teacher_approval_requests (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          selected_plan VARCHAR(20) CHECK (selected_plan IN ('Novice', 'Beginner', 'Intermediate', 'Advanced')),
          selected_category VARCHAR(20) CHECK (selected_category IN ('Group', 'Individual')),
          bio TEXT,
          qualifications TEXT,
          experience TEXT,
          requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          reviewed_by INTEGER,
          reviewed_at TIMESTAMP,
          rejection_reason TEXT
        )
      `);
      
      console.log('Tables ensured to exist');
    } catch (tableError) {
      console.error('Error creating tables:', tableError);
      return NextResponse.json({ error: 'Database setup failed' }, { status: 500 });
    }

    // Check if user already exists
    console.log('Checking if user exists...');
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('User already exists');
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }

    // Hash password
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);
    const createdAt = new Date().toISOString();
    
    if (role === 'teacher') {
      console.log('Creating teacher approval request...');
      
      try {
        const result = await pool.query(
          `INSERT INTO teacher_approval_requests 
           (name, email, password_hash, selected_plan, selected_category, bio, qualifications, experience, requested_at, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING id, name, email, requested_at`,
          [name, email, passwordHash, selectedPlan, selectedCategory, bio, qualifications, experience, createdAt, 'pending']
        );

        const request = result.rows[0];
        console.log('Teacher approval request created:', request.id);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Teacher registration submitted for approval. You will be notified once your account is reviewed.',
          requiresApproval: true,
          request: {
            id: request.id,
            name: request.name
          }
        });
      } catch (error) {
        console.error('Error creating teacher approval request:', error);
        return NextResponse.json({ error: 'Failed to create teacher approval request' }, { status: 500 });
      }
    } else {
      // Handle student registration
      console.log('Creating student account...');
      
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // Insert user
        const userResult = await client.query(
          `INSERT INTO users (
            name, email, password_hash, role, status, email_verified, 
            selected_plan, selected_category, payment_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id, name, email, role, status, email_verified, selected_plan, selected_category, created_at`,
          [
            name,
            email,
            passwordHash, // Use passwordHash instead of hashedPassword
            'student',
            'active',
            false,
            selectedPlan || 'Novice',
            selectedCategory || 'Group',
            'pending'
          ]
        );

        const user = userResult.rows[0];
        await client.query('COMMIT');
        
        return NextResponse.json({
          success: true,
          message: 'Student account created successfully',
          requiresApproval: false,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            selectedPlan: user.selected_plan,
            selectedCategory: user.selected_category,
            createdAt: user.created_at
          }
        });
      } catch (studentError) {
        await client.query('ROLLBACK');
        console.error('Error creating student account:', studentError);
        return NextResponse.json({ error: 'Failed to create student account' }, { status: 500 });
      } finally {
        client.release();
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';