import { NextRequest, NextResponse } from 'next/server';
import { db as pool } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = await verifyAuth(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { selectedPlan, selectedCategory } = await request.json();
    
    // Validate input
    if (!selectedPlan || !selectedCategory) {
      return NextResponse.json(
        { error: 'Selected plan and category are required' },
        { status: 400 }
      );
    }

    // Validate plan values
    const validPlans = ['Novice', 'Beginner', 'Intermediate', 'Advanced'];
    const validCategories = ['Group', 'Individual'];
    
    if (!validPlans.includes(selectedPlan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }
    
    if (!validCategories.includes(selectedCategory)) {
      return NextResponse.json(
        { error: 'Invalid category selected' },
        { status: 400 }
      );
    }

    // Update user plan in database
    const result = await pool.query(
      `UPDATE users 
       SET selected_plan = $1, selected_category = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, role, selected_plan, selected_category, created_at`,
      [selectedPlan, selectedCategory, authUser.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Plan updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        selectedPlan: updatedUser.selected_plan,
        selectedCategory: updatedUser.selected_category,
        createdAt: updatedUser.created_at
      }
    });
  } catch (error) {
    console.error('Plan update error:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';