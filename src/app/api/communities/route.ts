import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-utils';
import db, { pool } from '@/lib/db-utils';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch approved communities
    const communities = await db.findApprovedCommunities();

    return NextResponse.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description, category } = await request.json();

    // Validate input
    if (!name?.trim() || !description?.trim() || !category) {
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    // Check if community name already exists
    const existingCommunity = await pool.query(
      'SELECT id FROM communities WHERE LOWER(name) = LOWER($1)',
      [name.trim()]
    );

    if (existingCommunity.rows.length > 0) {
      return NextResponse.json(
        { error: 'A community with this name already exists' },
        { status: 409 }
      );
    }

    // Create new community
    const newCommunity = await db.createCommunity({
      name,
      description,
      category,
      creatorId: session.user.id,
    });
    
    // Add creator as a member
    await db.addCommunityMember(newCommunity.id, session.user.id);

    // Format the response to match the expected Community interface
    const communityResponse = {
      id: newCommunity.id,
      name: newCommunity.name,
      description: newCommunity.description,
      creatorId: newCommunity.creator_id,
      category: newCommunity.category,
      isApproved: newCommunity.is_approved,
      createdAt: newCommunity.created_at,
      creator: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      },
      _count: {
        members: 1 // The creator is the first member
      }
    };

    return NextResponse.json(
      { 
        message: 'Community created successfully and pending approval',
        community: communityResponse
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
