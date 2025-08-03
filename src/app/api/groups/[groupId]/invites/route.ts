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
    const { inviterId, inviterName, inviteeId, inviteeName, inviteeEmail } = await request.json();

    // Check if user is already invited or a member
    const existingInviteQuery = `
      SELECT id FROM group_invites 
      WHERE group_id = $1 AND invitee_id = $2 AND status = 'pending'
    `;
    const existingInvite = await pool.query(existingInviteQuery, [groupId, inviteeId]);

    if (existingInvite.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'User already has a pending invite'
      });
    }

    const existingMemberQuery = `
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `;
    const existingMember = await pool.query(existingMemberQuery, [groupId, inviteeId]);

    if (existingMember.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'User is already a member of this group'
      });
    }

    // Create the invite
    const insertQuery = `
      INSERT INTO group_invites (
        group_id, inviter_id, inviter_name, invitee_id, invitee_name, invitee_email
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      groupId, inviterId, inviterName, inviteeId, inviteeName, inviteeEmail
    ]);

    const invite = result.rows[0];

    // TODO: Send email notification to invitee
    // await sendInviteNotification(inviteeEmail, inviterName, groupName);

    return NextResponse.json({
      success: true,
      invite: {
        id: invite.id,
        groupId: invite.group_id,
        inviterId: invite.inviter_id,
        inviterName: invite.inviter_name,
        inviteeId: invite.invitee_id,
        inviteeName: invite.invitee_name,
        inviteeEmail: invite.invitee_email,
        status: invite.status,
        sentAt: invite.sent_at,
        expiresAt: invite.expires_at
      }
    });

  } catch (error) {
    console.error('Send invite API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send invite'
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
      SELECT * FROM group_invites 
      WHERE group_id = $1 
      ORDER BY sent_at DESC
    `;

    const result = await pool.query(query, [groupId]);
    
    const invites = result.rows.map(row => ({
      id: row.id,
      groupId: row.group_id,
      inviterId: row.inviter_id,
      inviterName: row.inviter_name,
      inviteeId: row.invitee_id,
      inviteeName: row.invitee_name,
      inviteeEmail: row.invitee_email,
      status: row.status,
      sentAt: row.sent_at,
      respondedAt: row.responded_at,
      expiresAt: row.expires_at
    }));

    return NextResponse.json({
      success: true,
      invites
    });

  } catch (error) {
    console.error('Get invites API error:', error);
    return NextResponse.json({
      success: true,
      invites: []
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;
    const { inviteId, status, userId, userName, userEmail } = await request.json();

    // Update invite status
    const updateQuery = `
      UPDATE group_invites 
      SET status = $1, responded_at = CURRENT_TIMESTAMP 
      WHERE id = $2 AND group_id = $3
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [status, inviteId, groupId]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invite not found'
      });
    }

    // If accepted, add user to group members
    if (status === 'accepted') {
      const addMemberQuery = `
        INSERT INTO group_members (group_id, user_id, user_name, user_email, role)
        VALUES ($1, $2, $3, $4, 'member')
        ON CONFLICT (group_id, user_id) DO NOTHING
      `;

      await pool.query(addMemberQuery, [groupId, userId, userName, userEmail]);

      // Add system message to group chat
      const systemMessageQuery = `
        INSERT INTO group_messages (group_id, sender_id, sender_name, message_type, content)
        VALUES ($1, 'system', 'System', 'system', $2)
      `;

      await pool.query(systemMessageQuery, [
        groupId,
        `${userName} joined the group`
      ]);
    }

    return NextResponse.json({
      success: true,
      invite: result.rows[0]
    });

  } catch (error) {
    console.error('Update invite API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update invite'
    });
  }
}
