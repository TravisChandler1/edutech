import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { action } = await request.json();
    
    // Check if user is admin
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const communityId = params.id;
    
    if (action === 'approve') {
      // Approve the community
      const updatedCommunity = await db.community.update({
        where: { id: communityId },
        data: { 
          isApproved: true,
          approvedBy: session.user.id,
          approvedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: 'Community approved successfully',
        community: updatedCommunity,
      });
    } 
    
    if (action === 'reject') {
      // Delete the community if rejected
      await db.community.delete({
        where: { id: communityId },
      });

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
