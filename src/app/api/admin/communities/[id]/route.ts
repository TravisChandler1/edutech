import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth.requireAuth(request);
    const { action } = await request.json();
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const communityId = params.id;
    
    if (action === 'approve') {
      // Approve the community
      const result = await db.query(
        `UPDATE communities 
         SET is_approved = true, 
             approved_by = $1, 
             approved_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [user.id, communityId]
      );

      return NextResponse.json({
        message: 'Community approved successfully',
        community: result.rows[0],
      });
    } 
    
    if (action === 'reject') {
      // Delete the community if rejected
      await db.query(
        'DELETE FROM communities WHERE id = $1',
        [communityId]
      );

      return NextResponse.json({
        message: 'Community rejected and deleted successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing community action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
