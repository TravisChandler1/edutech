import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth.verifyAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const communityId = params.id;

    // Fetch community with member count and check if current user is a member
    const result = await db.query(`
      SELECT c.*, 
        u.id as creator_id, 
        u.name as creator_name,
        (
          SELECT COUNT(*) 
          FROM community_members cm 
          WHERE cm.community_id = c.id
        ) as member_count,
        (
          SELECT COUNT(*) 
          FROM community_members cm 
          WHERE cm.community_id = c.id AND cm.user_id = $1
        ) > 0 as is_member
      FROM communities c
      LEFT JOIN users u ON c.creator_id = u.id
      WHERE c.id = $2 AND c.is_approved = true
    `, [user.id, communityId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    const community = result.rows[0];
    const isMember = community.is_member;
    
    // Remove members array from response to avoid sending unnecessary data
    const { members, ...communityData } = community;

    return NextResponse.json({
      ...communityData,
      isMember,
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth.verifyAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const communityId = params.id;
    const { action } = await request.json();

    // Check if community exists and is approved
    const communityResult = await db.query(`
      SELECT * FROM communities 
      WHERE id = $1 AND is_approved = true
    `, [communityId]);

    if (communityResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Community not found or not approved' },
        { status: 404 }
      );
    }

    const community = communityResult.rows[0];

    if (action === 'join') {
      // Add user to community members
      await db.query(`
        INSERT INTO community_members (community_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (community_id, user_id) DO NOTHING
      `, [communityId, user.id]);

      return NextResponse.json({
        message: 'Successfully joined the community',
      });
    }

    if (action === 'leave') {
      // Remove user from community members
      // But don't remove if user is the creator
      if (community.creator_id === user.id) {
        return NextResponse.json(
          { error: 'Community creator cannot leave the community' },
          { status: 400 }
        );
      }

      await db.query(`
        DELETE FROM community_members
        WHERE community_id = $1 AND user_id = $2
      `, [communityId, user.id]);

      return NextResponse.json({
        message: 'Successfully left the community',
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
