import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { db } from './db';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  selectedPlan?: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  selectedCategory?: 'Group' | 'Individual';
  createdAt: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Get user from database with role and preferences
    const result = await db.query(
      `SELECT 
        id, name, email, created_at, 
        role, selected_plan as "selectedPlan", 
        selected_category as "selectedCategory" 
      FROM users 
      WHERE id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'student', // Default to 'student' if role is not set
      selectedPlan: user.selectedPlan || undefined,
      selectedCategory: user.selectedCategory || undefined,
      createdAt: user.created_at
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export const auth = {
  verifyAuth,
  requireAuth,
};