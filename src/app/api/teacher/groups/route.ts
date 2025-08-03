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
      return { error: 'Only teachers can manage groups', status: 403 } as const;
    }

    return { user } as const;
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 } as const;
  }
}

// GET /api/teacher/groups - List all groups for the teacher
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
    // Get groups created by this teacher
    const result = await db.query(
      `SELECT 
        g.id, g.name, g.description, g.created_at as "createdAt",
        g.plan_id as "planId", p.name as "planName",
        COUNT(gm.user_id) as "memberCount"
       FROM groups g
       LEFT JOIN group_members gm ON g.id = gm.group_id
       LEFT JOIN plans p ON g.plan_id = p.id
       WHERE g.created_by = $1
       GROUP BY g.id, p.name
       ORDER BY g.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ 
      data: result.rows 
    });

  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

// POST /api/teacher/groups - Create a new group
export async function POST(request: Request) {
  const authResult = await getAuthorizedTeacher(request as unknown as NextRequest);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const { user } = authResult;

  try {

    const { name, description, studentIds, planId } = await request.json();

    // Start transaction
    await db.query('BEGIN');

    // Create the group
    const groupResult = await db.query(
      `INSERT INTO groups (name, description, created_by, plan_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, created_at, plan_id as "planId"`,
      [name, description, user.id, planId || null]
    );

    const group = groupResult.rows[0];

    // Add students to the group
    if (studentIds && studentIds.length > 0) {
      const values = studentIds.map((_studentId: string, index: number) => 
        `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
      ).join(',');
      
      const params = studentIds.flatMap((studentId: string) => [
        group.id, 
        studentId,
        new Date().toISOString()
      ]);

      await db.query(
        `INSERT INTO group_members (group_id, user_id, joined_at)
         VALUES ${values} ON CONFLICT DO NOTHING`,
        params
      );
    }

    await db.query('COMMIT');

    return NextResponse.json({ 
      success: true, 
      data: group 
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    );
  }
}
