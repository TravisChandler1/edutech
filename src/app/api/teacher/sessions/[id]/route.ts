import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Helper function to check if user is an authorized teacher
async function getAuthorizedTeacher(request: NextRequest) {
  try {
    const user = await auth.verifyAuth(request);
    if (!user) {
      return { error: 'Unauthorized', status: 401 } as const;
    }

    if (user.role !== 'teacher') {
      return { error: 'Only teachers can manage sessions', status: 403 } as const;
    }

    return { user } as const;
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 } as const;
  }
}

// GET /api/teacher/sessions/[id] - Get session details
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
    // Get session details
    const sessionResult = await db.query(
      `SELECT 
        ls.id, ls.title, ls.description, ls.start_time as "startTime", 
        ls.duration_minutes as "durationMinutes", ls.meeting_url as "meetingUrl",
        ls.status, ls.max_participants as "maxParticipants",
        ls.created_at as "createdAt", ls.updated_at as "updatedAt",
        g.id as "groupId", g.name as "groupName",
        p.id as "planId", p.name as "planName"
      FROM live_sessions ls
      LEFT JOIN groups g ON ls.group_id = g.id
      LEFT JOIN plans p ON ls.plan_id = p.id
      WHERE ls.id = $1 AND ls.created_by = $2`,
      [params.id, user.id]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session not found or not authorized' },
        { status: 404 }
      );
    }

    const session = sessionResult.rows[0];

    // Get participants
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
      data: {
        ...session,
        participants: participantsResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// PATCH /api/teacher/sessions/[id] - Update a session
export async function PATCH(
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
    const {
      title,
      description,
      startTime,
      durationMinutes,
      maxParticipants,
      status
    } = await request.json();

    // Start transaction
    await db.query('BEGIN');

    // First, verify the session exists and belongs to this teacher
    const existingSession = await db.query(
      'SELECT id, status FROM live_sessions WHERE id = $1 AND created_by = $2 FOR UPDATE',
      [params.id, user.id]
    );

    if (existingSession.rows.length === 0) {
      await db.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Session not found or not authorized' },
        { status: 404 }
      );
    }

    // Validate status transition
    const currentStatus = existingSession.rows[0].status;
    if (status && status !== currentStatus) {
      const validTransitions: Record<string, string[]> = {
        scheduled: ['in_progress', 'cancelled'],
        in_progress: ['completed'],
        completed: [],
        cancelled: []
      };

      if (!validTransitions[currentStatus].includes(status)) {
        await db.query('ROLLBACK');
        return NextResponse.json(
          { error: `Cannot transition from ${currentStatus} to ${status}` },
          { status: 400 }
        );
      }
    }

    // Update the session
    const result = await db.query(
      `UPDATE live_sessions
       SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         start_time = COALESCE($3, start_time),
         duration_minutes = COALESCE($4, duration_minutes),
         max_participants = COALESCE($5, max_participants),
         status = COALESCE($6, status),
         updated_at = NOW()
       WHERE id = $7 AND created_by = $8
       RETURNING 
         id, title, description, start_time as "startTime", 
         duration_minutes as "durationMinutes", meeting_url as "meetingUrl",
         status, max_participants as "maxParticipants",
         created_at as "createdAt", updated_at as "updatedAt"`,
      [
        title,
        description,
        startTime ? new Date(startTime).toISOString() : null,
        durationMinutes,
        maxParticipants,
        status,
        params.id,
        user.id
      ]
    );

    if (result.rows.length === 0) {
      await db.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    await db.query('COMMIT');

    // Revalidate the sessions list and detail pages
    revalidatePath('/dashboard/teacher/sessions');
    revalidatePath(`/dashboard/teacher/sessions/${params.id}`);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// DELETE /api/teacher/sessions/[id] - Delete a session
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
    // Start transaction
    await db.query('BEGIN');

    // First, delete all participants
    await db.query(
      'DELETE FROM session_participants WHERE session_id = $1',
      [params.id]
    );

    // Then delete the session
    const result = await db.query(
      'DELETE FROM live_sessions WHERE id = $1 AND created_by = $2 RETURNING id',
      [params.id, user.id]
    );

    if (result.rowCount === 0) {
      await db.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Session not found or not authorized' },
        { status: 404 }
      );
    }

    await db.query('COMMIT');

    // Revalidate the sessions list page
    revalidatePath('/dashboard/teacher/sessions');

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
