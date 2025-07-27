import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const communityId = params.id;

    // Fetch community with member count and if current user is a member
    const community = await db.community.findUnique({
      where: { id: communityId, isApproved: true },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    const isMember = community.members.some(member => member.id === session.user.id);
    
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const communityId = params.id;
    const { action } = await request.json();

    // Check if community exists and is approved
    const community = await db.community.findUnique({
      where: { id: communityId, isApproved: true },
    });

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found or not approved' },
        { status: 404 }
      );
    }

    if (action === 'join') {
      // Add user to community members
      await db.community.update({
        where: { id: communityId },
        data: {
          members: {
            connect: { id: session.user.id },
          },
        },
      });

      return NextResponse.json({
        message: 'Successfully joined the community',
      });
    }

    if (action === 'leave') {
      // Remove user from community members
      // But don't remove if user is the creator
      if (community.creatorId === session.user.id) {
        return NextResponse.json(
          { error: 'Community creator cannot leave the community' },
          { status: 400 }
        );
      }

      await db.community.update({
        where: { id: communityId },
        data: {
          members: {
            disconnect: { id: session.user.id },
          },
        },
      });

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
