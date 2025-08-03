import { NextRequest, NextResponse } from 'next/server';
import { PreRecordedClass } from '@/types';

// Mock database - replace with actual database implementation
let preRecordedClasses: PreRecordedClass[] = [
  {
    id: '1',
    teacherId: 'teacher1',
    title: 'Introduction to Yoruba Alphabet',
    description: 'Learn the Yoruba alphabet and basic pronunciation rules.',
    level: 'Novice',
    videoUrl: 'https://example.com/videos/yoruba-alphabet.mp4',
    duration: 45,
    thumbnailUrl: 'https://example.com/thumbnails/alphabet.jpg',
    views: 156,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    teacherId: 'teacher2',
    title: 'Yoruba Family Terms',
    description: 'Master family relationship terms in Yoruba language.',
    level: 'Beginner',
    videoUrl: 'https://example.com/videos/family-terms.mp4',
    duration: 60,
    thumbnailUrl: 'https://example.com/thumbnails/family.jpg',
    views: 89,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    teacherId: 'teacher1',
    title: 'Yoruba Proverbs and Their Meanings',
    description: 'Explore traditional Yoruba proverbs and their cultural significance.',
    level: 'Intermediate',
    videoUrl: 'https://example.com/videos/proverbs.mp4',
    duration: 90,
    thumbnailUrl: 'https://example.com/thumbnails/proverbs.jpg',
    views: 234,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    teacherId: 'teacher3',
    title: 'Advanced Yoruba Conversation',
    description: 'Practice complex conversations and idiomatic expressions.',
    level: 'Advanced',
    videoUrl: 'https://example.com/videos/advanced-conversation.mp4',
    duration: 120,
    thumbnailUrl: 'https://example.com/thumbnails/conversation.jpg',
    views: 67,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET - Fetch all pre-recorded classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const teacherId = searchParams.get('teacherId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let filteredClasses = preRecordedClasses;

    // Filter by level if provided
    if (level) {
      filteredClasses = filteredClasses.filter(cls => cls.level === level);
    }

    // Filter by teacher if provided
    if (teacherId) {
      filteredClasses = filteredClasses.filter(cls => cls.teacherId === teacherId);
    }

    // Sort by views (most popular first) or creation date
    filteredClasses.sort((a, b) => b.views - a.views);

    // Apply pagination if provided
    const startIndex = offset ? parseInt(offset) : 0;
    const endIndex = limit ? startIndex + parseInt(limit) : filteredClasses.length;
    const paginatedClasses = filteredClasses.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      classes: paginatedClasses,
      total: filteredClasses.length,
      offset: startIndex,
      limit: limit ? parseInt(limit) : filteredClasses.length
    });
  } catch (error) {
    console.error('Error fetching pre-recorded classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pre-recorded classes' },
      { status: 500 }
    );
  }
}

// POST - Create a new pre-recorded class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['teacherId', 'title', 'description', 'level', 'videoUrl', 'duration'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new pre-recorded class
    const newClass: PreRecordedClass = {
      id: `recorded_${Date.now()}`,
      teacherId: body.teacherId,
      title: body.title,
      description: body.description,
      level: body.level,
      videoUrl: body.videoUrl,
      duration: parseInt(body.duration),
      thumbnailUrl: body.thumbnailUrl || undefined,
      views: 0,
      createdAt: new Date().toISOString()
    };

    preRecordedClasses.push(newClass);

    return NextResponse.json({
      success: true,
      class: newClass,
      message: 'Pre-recorded class created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating pre-recorded class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create pre-recorded class' },
      { status: 500 }
    );
  }
}

// PUT - Update view count or other class details
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Class ID is required' },
        { status: 400 }
      );
    }

    const classIndex = preRecordedClasses.findIndex(cls => cls.id === id);
    if (classIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Pre-recorded class not found' },
        { status: 404 }
      );
    }

    // Handle view increment
    if (action === 'increment_view') {
      preRecordedClasses[classIndex].views += 1;
    } else {
      // Update other fields
      preRecordedClasses[classIndex] = {
        ...preRecordedClasses[classIndex],
        ...updateData,
        id, // Ensure ID doesn't change
      };
    }

    return NextResponse.json({
      success: true,
      class: preRecordedClasses[classIndex],
      message: 'Pre-recorded class updated successfully'
    });
  } catch (error) {
    console.error('Error updating pre-recorded class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update pre-recorded class' },
      { status: 500 }
    );
  }
}
