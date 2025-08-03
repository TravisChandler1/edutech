import { NextResponse } from 'next/server';
import { db as pool } from '@/lib/db';

export async function GET() {
  try {
    // Get all users with their plan information
    const usersResult = await pool.query(`
      SELECT 
        id,
        name,
        email,
        phone,
        role,
        selected_plan,
        selected_category,
        payment_status,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `);

    const users = usersResult.rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      selectedPlan: user.selected_plan || 'Free',
      selectedCategory: user.selected_category || 'Group',
      paymentStatus: user.payment_status || 'pending',
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }));

    // Get additional statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
        COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teacher_count,
        COUNT(CASE WHEN role = 'student' THEN 1 END) as student_count,
        COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as paid_users,
        COUNT(CASE WHEN selected_plan != 'Free' AND selected_plan IS NOT NULL THEN 1 END) as premium_users
      FROM users
    `);

    return NextResponse.json({
      success: true,
      users: users,
      stats: statsResult.rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
