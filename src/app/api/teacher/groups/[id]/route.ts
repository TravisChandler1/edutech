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
      return { error: 'Only teachers can manage groups', status: 403 } as const;
    }

    return { user } as const;
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 } as const;
  }
}

// GET /api/teacher/groups/[id] - Get group details
// PATCH /api/teacher/groups/[id] - Update group
// DELETE /api/teacher/groups/[id] - Delete group
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
    // Get group details with member count
    const groupResult = await db.query(
      `SELECT 
        g.id, g.name, g.description, g.created_at as "createdAt",
        g.plan_id as "planId", p.name as "planName",
        COUNT(gm.user_id) as "memberCount"
       FROM groups g
       LEFT JOIN group_members gm ON g.id = gm.group_id
       LEFT JOIN plans p ON g.plan_id = p.id
       WHERE g.id = $1 AND g.created_by = $2
       GROUP BY g.id, p.name`,
      [params.id, user.id]
    );

    if (groupResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    const group = groupResult.rows[0];

    // Get group members
    const membersResult = await db.query(
      `SELECT 
        u.id, u.name, u.email, u.avatar_url as "avatarUrl",
        p.name as "planName"
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       LEFT JOIN plans p ON u.selected_plan = p.id
       WHERE gm.group_id = $1
       ORDER BY u.name`,
      [params.id]
    );

    return NextResponse.json({
      data: {
        ...group,
        members: membersResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch group' },
      { status: 500 }
    );
  }
}

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
    const { name, description, studentIds } = await request.json();

    // Start transaction
    await db.query('BEGIN');

    // Update the group
    const groupResult = await db.query(
      `UPDATE groups 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           updated_at = NOW()
       WHERE id = $3 AND created_by = $4
       RETURNING id, name, description, plan_id as "planId"`,
      [name, description, params.id, user.id]
    );

    if (groupResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Group not found or not authorized' },
        { status: 404 }
      );
    }

    const group = groupResult.rows[0];

    // Update group members if provided
    if (Array.isArray(studentIds)) {
      // First, remove all current members
      await db.query(
        'DELETE FROM group_members WHERE group_id = $1',
        [params.id]
      );

      // Then add the new members
      if (studentIds.length > 0) {
        const values = studentIds.map((studentId: string, index: number) => 
          `($1, $${index + 2}, NOW())`
        ).join(',');
        
        await db.query(
          `INSERT INTO group_members (group_id, user_id, joined_at)
           VALUES ${values}`,
          [params.id, ...studentIds]
        );
      }
    }

    await db.query('COMMIT');

    // Revalidate the groups page
    revalidatePath('/dashboard/teacher/groups');
    revalidatePath(`/dashboard/teacher/groups/${params.id}`);

    return NextResponse.json({ 
      success: true, 
      data: group 
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error updating group:', error);
    return NextResponse.json(
      { error: 'Failed to update group' },
      { status: 500 }
    );
  }
}

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

    // First, delete all group members
    await db.query(
      'DELETE FROM group_members WHERE group_id = $1',
      [params.id]
    );

    // Then delete the group
    const result = await db.query(
      'DELETE FROM groups WHERE id = $1 AND created_by = $2 RETURNING id',
      [params.id, user.id]
    );

    if (result.rowCount === 0) {
      await db.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Group not found or not authorized' },
        { status: 404 }
      );
    }

    await db.query('COMMIT');

    // Revalidate the groups page
    revalidatePath('/dashboard/teacher/groups');

    return NextResponse.json({
      success: true,
      message: 'Group deleted successfully'
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    );
  }
}
