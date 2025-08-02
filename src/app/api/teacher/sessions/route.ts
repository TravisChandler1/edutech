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

// GET /api/teacher/sessions - List all sessions for the teacher
export async function GET(request: NextRequest) {
  const authResult = await getAuthorizedTeacher(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'upcoming';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build the base query
    let query = `
      SELECT 
        ls.id, ls.title, ls.description, ls.start_time as "startTime", 
        ls.duration_minutes as "durationMinutes", ls.meeting_url as "meetingUrl",
        ls.status, ls.max_participants as "maxParticipants",
        ls.created_at as "createdAt", ls.updated_at as "updatedAt",
        g.id as "groupId", g.name as "groupName",
        p.id as "planId", p.name as "planName",
        COUNT(DISTINCT sp.user_id) as "participantCount"
      FROM live_sessions ls
      LEFT JOIN groups g ON ls.group_id = g.id
      LEFT JOIN plans p ON ls.plan_id = p.id
      LEFT JOIN session_participants sp ON ls.id = sp.session_id
      WHERE ls.created_by = $1
    `;

    const queryParams: any[] = [user.id];
    let paramIndex = 2;

    // Add status filter
    if (status === 'upcoming') {
      query += ` AND ls.status = 'scheduled' AND ls.start_time > NOW()`;
    } else if (status === 'past') {
      query += ` AND (ls.status = 'completed' OR ls.start_time < NOW())`;
    } else if (status) {
      query += ` AND ls.status = $${paramIndex++}`;
      queryParams.push(status);
    }

    // Group by and order
    query += `
      GROUP BY ls.id, g.id, p.id
      ORDER BY ls.start_time ${status === 'past' ? 'DESC' : 'ASC'}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    
    queryParams.push(limit, offset);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM live_sessions 
      WHERE created_by = $1
      ${status === 'upcoming' ? "AND status = 'scheduled' AND start_time > NOW()" : ''}
      ${status === 'past' ? "AND (status = 'completed' OR start_time < NOW())" : ''}
    `;

    const [sessionsResult, countResult] = await Promise.all([
      db.query(query, queryParams),
      db.query(countQuery, [user.id])
    ]);

    const total = parseInt(countResult.rows[0]?.total || '0');
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: sessionsResult.rows,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST /api/teacher/sessions - Create a new live session
export async function POST(request: NextRequest) {
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
      groupId,
      planId
    } = await request.json();

    // Validate required fields
    if (!title || !startTime || !durationMinutes) {
      return NextResponse.json(
        { error: 'Title, start time, and duration are required' },
        { status: 400 }
      );
    }

    // Validate start time is in the future
    const startDate = new Date(startTime);
    if (startDate <= new Date()) {
      return NextResponse.json(
        { error: 'Start time must be in the future' },
        { status: 400 }
      );
    }

    // Generate a unique meeting URL (in a real app, this would be from a video conferencing API)
    const meetingUrl = `https://meet.example.com/${Math.random().toString(36).substring(2, 15)}`;

    // Start transaction
    await db.query('BEGIN');

    // Insert the new session
    const result = await db.query(
      `INSERT INTO live_sessions (
        title, description, start_time, duration_minutes, 
        max_participants, meeting_url, created_by, group_id, plan_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING 
        id, title, description, start_time as "startTime", 
        duration_minutes as "durationMinutes", meeting_url as "meetingUrl",
        status, max_participants as "maxParticipants",
        created_at as "createdAt", updated_at as "updatedAt"`,
      [
        title,
        description || null,
        startDate.toISOString(),
        durationMinutes,
        maxParticipants || null,
        meetingUrl,
        user.id,
        groupId || null,
        planId || null
      ]
    );

    const session = result.rows[0];

    // If this is a group session, add all group members as participants
    if (groupId) {
      await db.query(
        `INSERT INTO session_participants (session_id, user_id, joined_at)
         SELECT $1, user_id, NOW()
         FROM group_members
         WHERE group_id = $2
         ON CONFLICT (session_id, user_id) DO NOTHING`,
        [session.id, groupId]
      );
    }

    await db.query('COMMIT');

    // Revalidate the sessions list page
    revalidatePath('/dashboard/teacher/sessions');

    return NextResponse.json({
      success: true,
      data: session
    }, { status: 201 });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
