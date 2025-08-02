import { NextRequest, NextResponse } from 'next/server';
import { db as pool } from '@/lib/db';
import { auth } from '@/lib/auth';
import { emailService } from '@/lib/email/email.service';

// GET - Fetch all pending teacher approval requests
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await auth.verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const result = await pool.query(`
      SELECT 
        id, name, email, selected_plan, selected_category, 
        bio, qualifications, experience, requested_at, status,
        reviewed_by, reviewed_at, rejection_reason
      FROM teacher_approval_requests 
      ORDER BY requested_at DESC
    `);

    return NextResponse.json({ 
      success: true, 
      requests: result.rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        selectedPlan: row.selected_plan,
        selectedCategory: row.selected_category,
        bio: row.bio,
        qualifications: row.qualifications,
        experience: row.experience,
        requestedAt: row.requested_at,
        status: row.status,
        reviewedBy: row.reviewed_by,
        reviewedAt: row.reviewed_at,
        rejectionReason: row.rejection_reason
      }))
    });
  } catch (error) {
    console.error('Error fetching teacher approval requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Approve or reject a teacher request
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await auth.verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { requestId, action, rejectionReason } = await request.json();

    if (!requestId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Request ID and valid action (approve/reject) are required' }, { status: 400 });
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json({ error: 'Rejection reason is required when rejecting' }, { status: 400 });
    }

    const reviewedAt = new Date().toISOString();

    if (action === 'approve') {
      // Get the teacher request details
      const requestResult = await pool.query(
        'SELECT * FROM teacher_approval_requests WHERE id = $1 AND status = $2',
        [requestId, 'pending']
      );

      if (requestResult.rows.length === 0) {
        return NextResponse.json({ error: 'Teacher request not found or already processed' }, { status: 404 });
      }

      const teacherRequest = requestResult.rows[0];

      // Start transaction
      await pool.query('BEGIN');

      try {
        // Create the teacher user account
        const userResult = await pool.query(`
          INSERT INTO users 
          (name, email, password_hash, role, selected_plan, selected_category, 
           bio, status, teacher_approval_status, approved_by, approved_at, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
          RETURNING id, name, email, role
        `, [
          teacherRequest.name,
          teacherRequest.email,
          teacherRequest.password_hash,
          'teacher',
          teacherRequest.selected_plan,
          teacherRequest.selected_category,
          teacherRequest.bio,
          'active',
          'approved',
          user.id,
          reviewedAt,
          reviewedAt
        ]);

        // Update the approval request status
        await pool.query(`
          UPDATE teacher_approval_requests 
          SET status = $1, reviewed_by = $2, reviewed_at = $3 
          WHERE id = $4
        `, ['approved', user.id, reviewedAt, requestId]);

        // Get user details for email
        const userResultForEmail = await pool.query(
          'SELECT name, email FROM users WHERE id = $1',
          [userResult.rows[0].id]
        );

        if (userResultForEmail.rows.length > 0) {
          const userForEmail = userResultForEmail.rows[0];
          // Send approval email
          await emailService.sendTeacherApprovalEmail(
            userForEmail.email,
            userForEmail.name,
            true
          );
        }

        await pool.query('COMMIT');

        const newTeacher = userResult.rows[0];

        return NextResponse.json({
          success: true,
          message: 'Teacher approved successfully',
          teacher: {
            id: newTeacher.id,
            name: newTeacher.name,
            email: newTeacher.email,
            role: newTeacher.role
          }
        });
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    } else {
      // Reject the teacher request
      await pool.query(`
        UPDATE teacher_approval_requests 
        SET status = $1, reviewed_by = $2, reviewed_at = $3, rejection_reason = $4 
        WHERE id = $5 AND status = $6
      `, ['rejected', user.id, reviewedAt, rejectionReason, requestId, 'pending']);

      // Get user details for email
      const userResultForEmail = await pool.query(
        'SELECT name, email FROM users WHERE id = (SELECT user_id FROM teacher_approval_requests WHERE id = $1)',
        [requestId]
      );

      if (userResultForEmail.rows.length > 0) {
        const userForEmail = userResultForEmail.rows[0];
        // Send rejection email
        await emailService.sendTeacherApprovalEmail(
          userForEmail.email,
          userForEmail.name,
          false,
          rejectionReason
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Teacher request rejected'
      });
    }
  } catch (error) {
    console.error('Error processing teacher approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
