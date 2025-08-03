import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;
    const { 
      creatorId, 
      creatorName, 
      title, 
      description, 
      eventType, 
      scheduledDate, 
      duration, 
      location, 
      meetingLink,
      maxAttendees 
    } = await request.json();

    // Create the event
    const insertQuery = `
      INSERT INTO group_events (
        group_id, creator_id, creator_name, title, description, 
        event_type, scheduled_date, duration, location, meeting_link, max_attendees
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      groupId, creatorId, creatorName, title, description,
      eventType, scheduledDate, duration, location, meetingLink, maxAttendees
    ]);

    const event = result.rows[0];

    // Add creator as first attendee
    const addAttendeeQuery = `
      INSERT INTO group_event_attendees (event_id, user_id, user_name, status)
      VALUES ($1, $2, $3, 'going')
    `;

    await pool.query(addAttendeeQuery, [event.id, creatorId, creatorName]);

    // Add system message to group chat
    const systemMessageQuery = `
      INSERT INTO group_messages (group_id, sender_id, sender_name, message_type, content)
      VALUES ($1, 'system', 'System', 'event', $2)
    `;

    await pool.query(systemMessageQuery, [
      groupId,
      `${creatorName} created a new event: ${title}`
    ]);

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        groupId: event.group_id,
        creatorId: event.creator_id,
        creatorName: event.creator_name,
        title: event.title,
        description: event.description,
        eventType: event.event_type,
        scheduledDate: event.scheduled_date,
        duration: event.duration,
        location: event.location,
        meetingLink: event.meeting_link,
        isRecurring: event.is_recurring,
        recurringPattern: event.recurring_pattern,
        maxAttendees: event.max_attendees,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        attendees: [{
          userId: creatorId,
          userName: creatorName,
          status: 'going',
          respondedAt: new Date().toISOString()
        }]
      }
    });

  } catch (error) {
    console.error('Create event API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create event'
    });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;

    const query = `
      SELECT 
        e.*,
        json_agg(
          json_build_object(
            'userId', a.user_id,
            'userName', a.user_name,
            'status', a.status,
            'respondedAt', a.responded_at
          )
        ) as attendees
      FROM group_events e
      LEFT JOIN group_event_attendees a ON e.id = a.event_id
      WHERE e.group_id = $1
      GROUP BY e.id
      ORDER BY e.scheduled_date ASC
    `;

    const result = await pool.query(query, [groupId]);
    
    const events = result.rows.map(row => ({
      id: row.id,
      groupId: row.group_id,
      creatorId: row.creator_id,
      creatorName: row.creator_name,
      title: row.title,
      description: row.description,
      eventType: row.event_type,
      scheduledDate: row.scheduled_date,
      duration: row.duration,
      location: row.location,
      meetingLink: row.meeting_link,
      isRecurring: row.is_recurring,
      recurringPattern: row.recurring_pattern,
      maxAttendees: row.max_attendees,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      attendees: row.attendees.filter((a: any) => a.userId !== null)
    }));

    return NextResponse.json({
      success: true,
      events
    });

  } catch (error) {
    console.error('Get events API error:', error);
    return NextResponse.json({
      success: true,
      events: []
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId: _groupId } = params;
    const { eventId, userId, userName, status } = await request.json();

    // Update or insert attendee status
    const upsertAttendeeQuery = `
      INSERT INTO group_event_attendees (event_id, user_id, user_name, status, responded_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (event_id, user_id) 
      DO UPDATE SET status = $4, responded_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(upsertAttendeeQuery, [eventId, userId, userName, status]);

    return NextResponse.json({
      success: true,
      attendee: {
        userId: result.rows[0].user_id,
        userName: result.rows[0].user_name,
        status: result.rows[0].status,
        respondedAt: result.rows[0].responded_at
      }
    });

  } catch (error) {
    console.error('Update event attendance API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update attendance'
    });
  }
}
