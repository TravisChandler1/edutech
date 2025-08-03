import { NextResponse } from 'next/server';
import { db as pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user information with plan details
    let userResult;
    try {
      userResult = await pool.query(`
        SELECT 
          id,
          name,
          email,
          phone,
          role,
          selected_plan,
          selected_category,
          payment_status,
          created_at,
          updated_at
        FROM users 
        WHERE id = $1
      `, [userId]);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      // Return mock data if database is not available
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          name: 'Demo User',
          email: 'demo@example.com',
          phone: null,
          role: 'student',
          selectedPlan: 'Free',
          selectedCategory: 'Group',
          paymentStatus: 'pending',
          planFeatures: getPlanFeatures('Free')
        },
        groups: [],
        classes: [],
        bookClubSessions: [],
        savedBooks: [],
        stats: {
          totalGroups: 0,
          totalClasses: 0,
          totalBookSessions: 0,
          totalSavedBooks: 0
        }
      });
    }

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Initialize empty arrays for data that might not exist in database yet
    let groups: any[] = [];
    let classes: any[] = [];
    let bookClubSessions: any[] = [];
    let savedBooks: any[] = [];

    // Try to get user's groups (gracefully handle if table doesn't exist)
    try {
      const groupsResult = await pool.query(`
        SELECT 
          g.id,
          g.name,
          g.description,
          g.level as category,
          g.location,
          g.created_at,
          g.is_private,
          g.max_members,
          g.meeting_schedule,
          g.next_meeting,
          g.plan_id,
          g.created_by,
          u.name as creator_name,
          gm.joined_at,
          gm.role as member_role,
          (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
          (SELECT MAX(sent_at) FROM group_messages WHERE group_id = g.id) as last_activity
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        LEFT JOIN users u ON g.created_by = u.id
        WHERE gm.user_id = $1
        ORDER BY gm.joined_at DESC
      `, [userId]);
      
      groups = groupsResult.rows.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        category: group.category || 'General',
        location: group.location || 'Online',
        created_at: group.created_at,
        is_private: group.is_private || false,
        max_members: group.max_members || 10,
        meeting_schedule: group.meeting_schedule || 'To be determined',
        next_meeting: group.next_meeting || null,
        member_count: parseInt(group.member_count) || 1,
        member_role: group.member_role || 'member',
        creator_name: group.creator_name || 'Unknown',
        last_activity: group.last_activity || group.created_at
      }));
    } catch (error) {
      console.error('Error fetching groups:', error);
      console.log('Groups table not found or error fetching groups, using empty array');
    }

    // Try to get user's live classes (gracefully handle if table doesn't exist)
    try {
      const classesResult = await pool.query(`
        SELECT 
          lc.id,
          lc.title,
          lc.description,
          lc.level,
          lc.scheduled_time,
          lc.duration,
          lc.max_participants,
          lc.current_participants,
          lc.meet_link,
          lc.status,
          lce.enrolled_at
        FROM live_classes lc
        JOIN live_class_enrollments lce ON lc.id = lce.class_id
        WHERE lce.user_id = $1 AND lc.status = 'active'
        ORDER BY lc.scheduled_time ASC
      `, [userId]);
      classes = classesResult.rows;
    } catch (error) {
      console.log('Live classes table not found, using empty array');
    }

    // Try to get user's book club sessions (gracefully handle if table doesn't exist)
    try {
      const bookClubResult = await pool.query(`
        SELECT 
          bcs.id,
          bcs.book_title,
          bcs.session_type,
          bcs.scheduled_time,
          bcs.duration,
          bcs.description,
          bcs.status,
          bcsp.joined_at
        FROM book_club_sessions bcs
        JOIN book_club_session_participants bcsp ON bcs.id = bcsp.session_id
        WHERE bcsp.user_id = $1 AND bcs.status = 'scheduled'
        ORDER BY bcs.scheduled_time ASC
      `, [userId]);
      bookClubSessions = bookClubResult.rows;
    } catch (error) {
      console.log('Book club sessions table not found, using empty array');
    }

    // Try to get user's saved ebooks (gracefully handle if table doesn't exist)
    try {
      const ebooksResult = await pool.query(`
        SELECT 
          e.id,
          e.title,
          e.author,
          e.category,
          e.language,
          e.pages,
          e.file_size,
          sb.saved_at,
          sb.reading_progress
        FROM ebooks e
        JOIN saved_books sb ON e.id = sb.ebook_id
        WHERE sb.user_id = $1
        ORDER BY sb.saved_at DESC
      `, [userId]);
      savedBooks = ebooksResult.rows;
    } catch (error) {
      console.log('Ebooks table not found, using empty array');
    }

    // Determine user's plan features
    const planFeatures = getPlanFeatures(user.selected_plan || 'Free');

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        selectedPlan: user.selected_plan || 'Free',
        selectedCategory: user.selected_category || 'Group',
        paymentStatus: user.payment_status || 'pending',
        planFeatures: planFeatures
      },
      groups: groups,
      classes: classes,
      bookClubSessions: bookClubSessions,
      savedBooks: savedBooks,
      stats: {
        totalGroups: groups.length,
        totalClasses: classes.length,
        totalBookSessions: bookClubSessions.length,
        totalSavedBooks: savedBooks.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

function getPlanFeatures(plan: string) {
  const features = {
    'Free': {
      maxGroups: 1,
      maxClasses: 2,
      bookClubAccess: true,
      liveClassAccess: false,
      communityAccess: true,
      ebookAccess: true
    },
    'Novice': {
      maxGroups: 1,
      maxClasses: 2,
      bookClubAccess: true,
      liveClassAccess: false,
      communityAccess: true,
      ebookAccess: true
    },
    'Beginner': {
      maxGroups: 3,
      maxClasses: 5,
      bookClubAccess: true,
      liveClassAccess: true,
      communityAccess: true,
      ebookAccess: true
    },
    'Intermediate': {
      maxGroups: 5,
      maxClasses: 10,
      bookClubAccess: true,
      liveClassAccess: true,
      communityAccess: true,
      ebookAccess: true
    },
    'Advanced': {
      maxGroups: -1, // unlimited
      maxClasses: -1, // unlimited
      bookClubAccess: true,
      liveClassAccess: true,
      communityAccess: true,
      ebookAccess: true
    }
  };

  return features[plan as keyof typeof features] || features['Free'];
}
