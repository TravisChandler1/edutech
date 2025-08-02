import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await auth.verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the user is a teacher
    if (user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can access this resource' },
        { status: 403 }
      );
    }

    // Fetch students grouped by their selected plan
    const result = await db.query(
      `SELECT 
        u.id, u.name, u.email, u.selected_plan as "selectedPlan", 
        u.created_at as "createdAt", u.last_login as "lastLogin",
        p.name as "planName", p.level as "planLevel"
       FROM users u
       LEFT JOIN plans p ON u.selected_plan = p.id
       WHERE u.role = 'student' AND u.teacher_approval_status = 'approved'
       ORDER BY p.level, u.name`
    );

    // Group students by their plan
    const studentsByPlan = result.rows.reduce((acc, student) => {
      const planKey = student.selectedPlan || 'no_plan';
      if (!acc[planKey]) {
        acc[planKey] = {
          planId: planKey,
          planName: student.planName || 'No Plan',
          planLevel: student.planLevel || 0,
          students: []
        };
      }
      acc[planKey].students.push({
        id: student.id,
        name: student.name,
        email: student.email,
        createdAt: student.createdAt,
        lastLogin: student.lastLogin
      });
      return acc;
    }, {});

    // Convert to array and sort by plan level
    const sortedPlans = Object.values(studentsByPlan).sort((a: any, b: any) => 
      a.planLevel - b.planLevel
    );

    return NextResponse.json({ data: sortedPlans });
  } catch (error) {
    console.error('Error fetching students by plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
