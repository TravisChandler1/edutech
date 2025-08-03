import { NextRequest, NextResponse } from 'next/server';
import { BookClubSession } from '@/types';

// Mock database - replace with actual database implementation
let bookClubSessions: BookClubSession[] = [
  {
    id: '1',
    bookId: 'book1',
    title: 'Àkójọpọ̀ Àwọn Àlọ́ Yorùbá Discussion',
    description: 'A collection of traditional Yoruba folktales that teach moral lessons and cultural values.',
    sessionType: 'live_discussion',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    hostId: 'teacher1',
    participants: ['user1', 'user2'],
    maxParticipants: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    bookId: 'book2',
    title: 'Ìtàn Òdùduwà Study Group',
    description: 'The legendary story of Oduduwa, the progenitor of the Yoruba people.',
    sessionType: 'group_chat',
    scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    hostId: 'teacher2',
    participants: ['user3'],
    maxParticipants: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    bookId: 'book3',
    title: 'Ewì Yorùbá Àtijọ́ Poetry Circle',
    description: 'Classical Yoruba poetry exploring themes of love, nature, and spirituality.',
    sessionType: 'live_discussion',
    scheduledDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 75,
    hostId: 'teacher1',
    participants: [],
    maxParticipants: 12,
    createdAt: new Date().toISOString()
  }
];

// GET - Fetch all book club sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionType = searchParams.get('sessionType');
    const hostId = searchParams.get('hostId');
    const upcoming = searchParams.get('upcoming');

    let filteredSessions = bookClubSessions;

    // Filter by session type if provided
    if (sessionType) {
      filteredSessions = filteredSessions.filter(session => session.sessionType === sessionType);
    }

    // Filter by host if provided
    if (hostId) {
      filteredSessions = filteredSessions.filter(session => session.hostId === hostId);
    }

    // Filter upcoming sessions if requested
    if (upcoming === 'true') {
      const now = new Date();
      filteredSessions = filteredSessions.filter(session => new Date(session.scheduledDate) > now);
    }

    // Sort by scheduled date (earliest first)
    filteredSessions.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

    return NextResponse.json({
      success: true,
      sessions: filteredSessions,
      total: filteredSessions.length
    });
  } catch (error) {
    console.error('Error fetching book club sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book club sessions' },
      { status: 500 }
    );
  }
}

// POST - Create a new book club session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['bookId', 'title', 'description', 'sessionType', 'scheduledDate', 'duration', 'hostId', 'maxParticipants'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate session type
    if (!['group_chat', 'live_discussion'].includes(body.sessionType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid session type. Must be "group_chat" or "live_discussion"' },
        { status: 400 }
      );
    }

    // Validate scheduled date is in the future
    if (new Date(body.scheduledDate) <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Scheduled date must be in the future' },
        { status: 400 }
      );
    }

    // Create new book club session
    const newSession: BookClubSession = {
      id: `session_${Date.now()}`,
      bookId: body.bookId,
      title: body.title,
      description: body.description,
      sessionType: body.sessionType,
      scheduledDate: body.scheduledDate,
      duration: parseInt(body.duration),
      hostId: body.hostId,
      participants: [],
      maxParticipants: parseInt(body.maxParticipants),
      createdAt: new Date().toISOString()
    };

    bookClubSessions.push(newSession);

    return NextResponse.json({
      success: true,
      session: newSession,
      message: 'Book club session created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating book club session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create book club session' },
      { status: 500 }
    );
  }
}

// PUT - Update a book club session or manage participants
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, userId, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const sessionIndex = bookClubSessions.findIndex(session => session.id === id);
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Book club session not found' },
        { status: 404 }
      );
    }

    const session = bookClubSessions[sessionIndex];

    // Handle participant actions
    if (action === 'join' && userId) {
      if (session.participants.includes(userId)) {
        return NextResponse.json(
          { success: false, error: 'User is already a participant' },
          { status: 409 }
        );
      }
      
      if (session.participants.length >= session.maxParticipants) {
        return NextResponse.json(
          { success: false, error: 'Session is full' },
          { status: 409 }
        );
      }

      session.participants.push(userId);
    } else if (action === 'leave' && userId) {
      const participantIndex = session.participants.indexOf(userId);
      if (participantIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'User is not a participant' },
          { status: 404 }
        );
      }
      
      session.participants.splice(participantIndex, 1);
    } else {
      // Update other session fields
      bookClubSessions[sessionIndex] = {
        ...session,
        ...updateData,
        id, // Ensure ID doesn't change
      };
    }

    return NextResponse.json({
      success: true,
      session: bookClubSessions[sessionIndex],
      message: action ? `Successfully ${action}ed session` : 'Book club session updated successfully'
    });
  } catch (error) {
    console.error('Error updating book club session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update book club session' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a book club session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const sessionIndex = bookClubSessions.findIndex(session => session.id === id);
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Book club session not found' },
        { status: 404 }
      );
    }

    // Remove the session
    const deletedSession = bookClubSessions.splice(sessionIndex, 1)[0];

    return NextResponse.json({
      success: true,
      session: deletedSession,
      message: 'Book club session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting book club session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete book club session' },
      { status: 500 }
    );
  }
}
