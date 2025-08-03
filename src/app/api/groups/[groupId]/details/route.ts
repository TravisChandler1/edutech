import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;

    // Get group messages
    const messagesQuery = `
      SELECT 
        id,
        group_id,
        sender_id,
        sender_name,
        message_type,
        content,
        file_url,
        file_name,
        file_size,
        reply_to,
        mentions,
        is_edited,
        edited_at,
        sent_at
      FROM group_messages 
      WHERE group_id = $1 
      ORDER BY sent_at ASC
      LIMIT 100
    `;

    const messagesResult = await pool.query(messagesQuery, [groupId]);
    
    const messages = messagesResult.rows.map(row => ({
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
      readBy: [] // TODO: Implement read receipts
    }));

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Group details API error:', error);
    
    // Return fallback data if database tables don't exist yet
    return NextResponse.json({
      success: true,
      messages: []
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId: _groupId } = params;
    const body = await request.json();
    const { action } = body;

    if (action === 'create_tables') {
      // Create necessary tables for group functionality
      const createTablesQuery = `
        -- Create group_messages table
        CREATE TABLE IF NOT EXISTS group_messages (
          id SERIAL PRIMARY KEY,
          group_id VARCHAR(255) NOT NULL,
          sender_id VARCHAR(255) NOT NULL,
          sender_name VARCHAR(255) NOT NULL,
          message_type VARCHAR(50) DEFAULT 'text',
          content TEXT NOT NULL,
          file_url TEXT,
          file_name VARCHAR(255),
          file_size VARCHAR(50),
          reply_to INTEGER REFERENCES group_messages(id),
          mentions TEXT, -- JSON array of user IDs
          is_edited BOOLEAN DEFAULT FALSE,
          edited_at TIMESTAMP,
          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create group_members table
        CREATE TABLE IF NOT EXISTS group_members (
          id SERIAL PRIMARY KEY,
          group_id VARCHAR(255) NOT NULL,
          user_id VARCHAR(255) NOT NULL,
          user_name VARCHAR(255) NOT NULL,
          user_email VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'member',
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_seen TIMESTAMP,
          is_online BOOLEAN DEFAULT FALSE,
          UNIQUE(group_id, user_id)
        );

        -- Create group_invites table
        CREATE TABLE IF NOT EXISTS group_invites (
          id SERIAL PRIMARY KEY,
          group_id VARCHAR(255) NOT NULL,
          inviter_id VARCHAR(255) NOT NULL,
          inviter_name VARCHAR(255) NOT NULL,
          invitee_id VARCHAR(255) NOT NULL,
          invitee_name VARCHAR(255) NOT NULL,
          invitee_email VARCHAR(255) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          responded_at TIMESTAMP,
          expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
        );

        -- Create group_events table
        CREATE TABLE IF NOT EXISTS group_events (
          id SERIAL PRIMARY KEY,
          group_id VARCHAR(255) NOT NULL,
          creator_id VARCHAR(255) NOT NULL,
          creator_name VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          event_type VARCHAR(50) DEFAULT 'study_session',
          scheduled_date TIMESTAMP NOT NULL,
          duration INTEGER DEFAULT 60,
          location VARCHAR(255),
          meeting_link TEXT,
          is_recurring BOOLEAN DEFAULT FALSE,
          recurring_pattern VARCHAR(50),
          max_attendees INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create group_event_attendees table
        CREATE TABLE IF NOT EXISTS group_event_attendees (
          id SERIAL PRIMARY KEY,
          event_id INTEGER REFERENCES group_events(id) ON DELETE CASCADE,
          user_id VARCHAR(255) NOT NULL,
          user_name VARCHAR(255) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          responded_at TIMESTAMP,
          UNIQUE(event_id, user_id)
        );

        -- Create group_files table
        CREATE TABLE IF NOT EXISTS group_files (
          id SERIAL PRIMARY KEY,
          group_id VARCHAR(255) NOT NULL,
          uploader_id VARCHAR(255) NOT NULL,
          uploader_name VARCHAR(255) NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          file_type VARCHAR(100),
          file_size VARCHAR(50),
          file_url TEXT NOT NULL,
          description TEXT,
          category VARCHAR(50) DEFAULT 'document',
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          download_count INTEGER DEFAULT 0,
          is_public BOOLEAN DEFAULT FALSE
        );

        -- Create study_groups table (enhanced version of communities)
        CREATE TABLE IF NOT EXISTS study_groups (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          creator_id VARCHAR(255) NOT NULL,
          creator_name VARCHAR(255) NOT NULL,
          is_private BOOLEAN DEFAULT FALSE,
          max_members INTEGER DEFAULT 50,
          group_image TEXT,
          category VARCHAR(100) DEFAULT 'Study Group',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_group_messages_group_id ON group_messages(group_id);
        CREATE INDEX IF NOT EXISTS idx_group_messages_sent_at ON group_messages(sent_at);
        CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
        CREATE INDEX IF NOT EXISTS idx_group_invites_invitee_id ON group_invites(invitee_id);
        CREATE INDEX IF NOT EXISTS idx_group_events_group_id ON group_events(group_id);
        CREATE INDEX IF NOT EXISTS idx_group_files_group_id ON group_files(group_id);
      `;

      await pool.query(createTablesQuery);

      return NextResponse.json({
        success: true,
        message: 'Group tables created successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    });

  } catch (error) {
    console.error('Group details POST API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    });
  }
}
