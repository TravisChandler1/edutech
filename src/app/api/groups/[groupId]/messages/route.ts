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
    const { senderId, senderName, messageType, content, fileUrl, fileName, fileSize, replyTo, mentions } = await request.json();

    // Insert message into database
    const insertQuery = `
      INSERT INTO group_messages (
        group_id, sender_id, sender_name, message_type, content, 
        file_url, file_name, file_size, reply_to, mentions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      groupId,
      senderId,
      senderName,
      messageType || 'text',
      content,
      fileUrl || null,
      fileName || null,
      fileSize || null,
      replyTo || null,
      mentions ? JSON.stringify(mentions) : null
    ];

    const result = await pool.query(insertQuery, values);
    const messageRow = result.rows[0];

    // Update group's last activity
    await pool.query(
      'UPDATE study_groups SET last_activity = CURRENT_TIMESTAMP WHERE id = $1',
      [groupId]
    );

    const message = {
      id: messageRow.id,
      groupId: messageRow.group_id,
      senderId: messageRow.sender_id,
      senderName: messageRow.sender_name,
      messageType: messageRow.message_type,
      content: messageRow.content,
      fileUrl: messageRow.file_url,
      fileName: messageRow.file_name,
      fileSize: messageRow.file_size,
      replyTo: messageRow.reply_to,
      mentions: messageRow.mentions ? JSON.parse(messageRow.mentions) : [],
      isEdited: messageRow.is_edited,
      editedAt: messageRow.edited_at,
      sentAt: messageRow.sent_at,
      readBy: []
    };

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Send message API error:', error);
    
    // If table doesn't exist, create it and retry
    if (error instanceof Error && error.message.includes('does not exist')) {
      try {
        // Create tables first
        await fetch(`${request.url.split('/messages')[0]}/details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create_tables' })
        });

        // Retry the message insertion
        return POST(request, { params });
      } catch (retryError) {
        console.error('Retry failed:', retryError);
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to send message'
    });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const query = `
      SELECT 
        id, group_id, sender_id, sender_name, message_type, content,
        file_url, file_name, file_size, reply_to, mentions,
        is_edited, edited_at, sent_at
      FROM group_messages 
      WHERE group_id = $1 
      ORDER BY sent_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [groupId, limit, offset]);
    
    const messages = result.rows.reverse().map(row => ({
      id: row.id,
      groupId: row.group_id,
      senderId: row.sender_id,
      senderName: row.sender_name,
      messageType: row.message_type,
      content: row.content,
      fileUrl: row.file_url,
      fileName: row.file_name,
      fileSize: row.file_size,
      replyTo: row.reply_to,
      mentions: row.mentions ? JSON.parse(row.mentions) : [],
      isEdited: row.is_edited,
      editedAt: row.edited_at,
      sentAt: row.sent_at,
      readBy: []
    }));

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Get messages API error:', error);
    return NextResponse.json({
      success: true,
      messages: []
    });
  }
}
