import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    // Verify the user is authenticated using our JWT system
    const authResult = await verifyAuth(request as any);
    
    if (!authResult) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, email, currentPassword, newPassword } = await request.json();
    
    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Get the current user from the database
    const user = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [authResult.id]
    );

    if (user.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentUser = user.rows[0];
    
    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password_hash
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
    };

    // If new password provided, hash it and add to update data
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(newPassword, salt);
    }

    // Update user in database
    const result = await db.query(
      `UPDATE users 
       SET name = $1, email = $2${newPassword ? ', password_hash = $4' : ''}
       WHERE id = $3 
       RETURNING id, name, email, role, selected_plan as "selectedPlan", selected_category as "selectedCategory"`,
      newPassword 
        ? [name, email, currentUser.id, updateData.password_hash]
        : [name, email, currentUser.id]
    );

    if (result.rows.length === 0) {
      throw new Error('Failed to update user');
    }

    const updatedUser = result.rows[0];

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        selectedPlan: updatedUser.selectedPlan,
        selectedCategory: updatedUser.selectedCategory,
      },
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
