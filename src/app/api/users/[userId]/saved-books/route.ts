import { NextRequest, NextResponse } from 'next/server';
import { SavedBook } from '@/types';

// Mock database - replace with actual database implementation
let savedBooks: SavedBook[] = [
  {
    id: '1',
    userId: 'user1',
    ebookId: '1',
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingProgress: 45,
    lastReadAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: 'user1',
    ebookId: '3',
    savedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    readingProgress: 78,
    lastReadAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    userId: 'user2',
    ebookId: '2',
    savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingProgress: 23,
    lastReadAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET - Fetch saved books for a specific user
export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Filter saved books by user ID
    const userSavedBooks = savedBooks.filter(savedBook => savedBook.userId === userId);

    // Sort by last read date (most recent first)
    userSavedBooks.sort((a, b) => {
      const dateA = a.lastReadAt ? new Date(a.lastReadAt).getTime() : 0;
      const dateB = b.lastReadAt ? new Date(b.lastReadAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      savedBooks: userSavedBooks,
      total: userSavedBooks.length
    });
  } catch (error) {
    console.error('Error fetching saved books:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved books' },
      { status: 500 }
    );
  }
}

// POST - Save a book for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!body.ebookId) {
      return NextResponse.json(
        { success: false, error: 'Ebook ID is required' },
        { status: 400 }
      );
    }

    // Check if book is already saved by this user
    const existingSavedBook = savedBooks.find(
      savedBook => savedBook.userId === userId && savedBook.ebookId === body.ebookId
    );

    if (existingSavedBook) {
      return NextResponse.json(
        { success: false, error: 'Book is already saved' },
        { status: 409 }
      );
    }

    // Create new saved book entry
    const newSavedBook: SavedBook = {
      id: `saved_${Date.now()}`,
      userId,
      ebookId: body.ebookId,
      savedAt: new Date().toISOString(),
      readingProgress: 0,
      lastReadAt: undefined
    };

    savedBooks.push(newSavedBook);

    return NextResponse.json({
      success: true,
      savedBook: newSavedBook,
      message: 'Book saved successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save book' },
      { status: 500 }
    );
  }
}

// PUT - Update reading progress for a saved book
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!body.ebookId) {
      return NextResponse.json(
        { success: false, error: 'Ebook ID is required' },
        { status: 400 }
      );
    }

    // Find the saved book
    const savedBookIndex = savedBooks.findIndex(
      savedBook => savedBook.userId === userId && savedBook.ebookId === body.ebookId
    );

    if (savedBookIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Saved book not found' },
        { status: 404 }
      );
    }

    // Update reading progress
    if (body.readingProgress !== undefined) {
      savedBooks[savedBookIndex].readingProgress = Math.max(0, Math.min(100, body.readingProgress));
      savedBooks[savedBookIndex].lastReadAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      savedBook: savedBooks[savedBookIndex],
      message: 'Reading progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating reading progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reading progress' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a saved book
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const { searchParams } = new URL(request.url);
    const ebookId = searchParams.get('ebookId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!ebookId) {
      return NextResponse.json(
        { success: false, error: 'Ebook ID is required' },
        { status: 400 }
      );
    }

    // Find and remove the saved book
    const savedBookIndex = savedBooks.findIndex(
      savedBook => savedBook.userId === userId && savedBook.ebookId === ebookId
    );

    if (savedBookIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Saved book not found' },
        { status: 404 }
      );
    }

    const deletedSavedBook = savedBooks.splice(savedBookIndex, 1)[0];

    return NextResponse.json({
      success: true,
      savedBook: deletedSavedBook,
      message: 'Saved book removed successfully'
    });
  } catch (error) {
    console.error('Error removing saved book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove saved book' },
      { status: 500 }
    );
  }
}
