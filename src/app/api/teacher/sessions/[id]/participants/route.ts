import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Helper function to check if user is an authorized teacher
async function getAuthorizedTeacher(request: NextRequest) {
  try {
    const user = await auth.verifyAuth(request);
    if (!user) {
      return { error: 'Unauthorized', status: 401 } as const;
    }

    if (user.role !== 'teacher') {
      return { error: 'Only teachers can manage session participants', status: 403 } as const;
    }

    return { user } as const;
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 } as const;
  }
}

// GET /api/teacher/sessions/[id]/participants - Get session participants
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await getAuthorizedTeacher(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const { user } = authResult;

  try {
    // Verify the session exists and belongs to this teacher
    const sessionResult = await db.query(
      'SELECT id FROM live_sessions WHERE id = $1 AND created_by = $2',
      [params.id, user.id]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session not found or not authorized' },
        { status: 404 }
      );
    }

    // Get participants with their details
    const participantsResult = await db.query(
      `SELECT 
        u.id, u.name, u.email, u.avatar_url as "avatarUrl",
        sp.joined_at as "joinedAt", sp.left_at as "leftAt"
      FROM session_participants sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.session_id = $1
      ORDER BY sp.joined_at`,
      [params.id]
    );

    return NextResponse.json({
      data: participantsResult.rows
    });

  } catch (error) {
    console.error('Error fetching session participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session participants' },
      { status: 500 }
    );
  }
}

// POST /api/teacher/sessions/[id]/participants - Add participants to a session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await getAuthorizedTeacher(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const { user } = authResult;

  try {
    const { userIds } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs array is required' },
        { status: 400 }
      );
    }

    // Verify the session exists and belongs to this teacher
    const sessionResult = await db.query(
      'SELECT id, max_participants FROM live_sessions WHERE id = $1 AND created_by = $2',
      [params.id, user.id]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session not found or not authorized' },
        { status: 404 }
      );
    }

    const session = sessionResult.rows[0];

    // Check if adding these users would exceed max participants
    if (session.max_participants) {
      const currentCountResult = await db.query(
        'SELECT COUNT(*) as count FROM session_participants WHERE session_id = $1',
        [params.id]
      );
      const currentCount = parseInt(currentCountResult.rows[0].count, 10);
      
      if (currentCount + userIds.length > session.max_participants) {
        return NextResponse.json(
          { error: `Adding these users would exceed the maximum number of participants (${session.max_participants})` },
          { status: 400 }
        );
      }
    }

    // Add participants
    const values = userIds.map((_userId: string, index: number) => 
      `($1, $${index + 2}, NOW())`
    ).join(',');
    
    const result = await db.query(
      `INSERT INTO session_participants (session_id, user_id, joined_at)
       VALUES ${values}
       ON CONFLICT (session_id, user_id) DO NOTHING
       RETURNING user_id`,
      [params.id, ...userIds]
    );

    return NextResponse.json({
      success: true,
      data: {
        added: result.rowCount,
        total: userIds.length
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding session participants:', error);
    return NextResponse.json(
      { error: 'Failed to add session participants' },
      { status: 500 }
    );
  }
}

// DELETE /api/teacher/sessions/[id]/participants - Remove participants from a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await getAuthorizedTeacher(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const { user } = authResult;

  try {
    const { userIds } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs array is required' },
        { status: 400 }
      );
    }

    // Verify the session exists and belongs to this teacher
    const sessionResult = await db.query(
      'SELECT id FROM live_sessions WHERE id = $1 AND created_by = $2',
      [params.id, user.id]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session not found or not authorized' },
        { status: 404 }
      );
    }

    // Remove participants
    const result = await db.query(
      `DELETE FROM session_participants 
       WHERE session_id = $1 AND user_id = ANY($2::uuid[])
       RETURNING user_id`,
      [params.id, userIds]
    );

    return NextResponse.json({
      success: true,
      data: {
        removed: result.rowCount,
        total: userIds.length
      }
    });

  } catch (error) {
    console.error('Error removing session participants:', error);
    return NextResponse.json(
      { error: 'Failed to remove session participants' },
      { status: 500 }
    );
  }
}
