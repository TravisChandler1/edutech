import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await auth.requireAuth(request);
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Fetch pending communities using raw SQL
    const result = await db.query(`
      SELECT c.*, 
        u.id as creator_id, 
        u.name as creator_name, 
        u.email as creator_email
      FROM communities c
      LEFT JOIN users u ON c.creator_id = u.id
      WHERE c.is_approved = false
      ORDER BY c.created_at ASC
    `);

    // Format the response to include creator info
    const pendingCommunities = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      isApproved: row.is_approved,
      createdAt: row.created_at,
      creator: {
        id: row.creator_id,
        name: row.creator_name,
        email: row.creator_email
      }
    }));

    return NextResponse.json(pendingCommunities);
  } catch (error) {
    console.error('Error fetching pending communities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
