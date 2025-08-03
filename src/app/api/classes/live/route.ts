import { NextRequest, NextResponse } from 'next/server';
import { LiveClass } from '@/types';

// Mock database - replace with actual database implementation
let liveClasses: LiveClass[] = [
  {
    id: '1',
    teacherId: 'teacher1',
    title: 'Yoruba Greetings and Basic Phrases',
    description: 'Learn essential Yoruba greetings and common phrases used in daily conversations.',
    level: 'Novice',
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    maxStudents: 25,
    enrolledStudents: ['student1', 'student2'],
    isLive: false,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    meetingPassword: 'yoruba123',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    teacherId: 'teacher2',
    title: 'Yoruba Numbers and Counting',
    description: 'Master Yoruba numerals and counting systems from 1 to 100.',
    level: 'Beginner',
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    maxStudents: 20,
    enrolledStudents: ['student3', 'student4', 'student5'],
    isLive: false,
    meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
    meetingPassword: 'count456',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    teacherId: 'teacher1',
    title: 'Advanced Yoruba Grammar',
    description: 'Deep dive into complex Yoruba grammar structures and sentence formation.',
    level: 'Advanced',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    maxStudents: 15,
    enrolledStudents: ['student6'],
    isLive: false,
    meetingLink: 'https://meet.google.com/adv-gram-mar',
    meetingPassword: 'grammar789',
    createdAt: new Date().toISOString()
  }
];

// GET - Fetch all live classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const teacherId = searchParams.get('teacherId');

    let filteredClasses = liveClasses;

    // Filter by level if provided
    if (level) {
      filteredClasses = filteredClasses.filter(cls => cls.level === level);
    }

    // Filter by teacher if provided
    if (teacherId) {
      filteredClasses = filteredClasses.filter(cls => cls.teacherId === teacherId);
    }

    return NextResponse.json({
      success: true,
      classes: filteredClasses,
      total: filteredClasses.length
    });
  } catch (error) {
    console.error('Error fetching live classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live classes' },
      { status: 500 }
    );
  }
}

// POST - Create a new live class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['teacherId', 'title', 'description', 'level', 'scheduledDate', 'duration', 'maxStudents', 'meetingLink'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate Google Meet link format
    if (!body.meetingLink.includes('meet.google.com')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Google Meet link format' },
        { status: 400 }
      );
    }

    // Create new live class
    const newClass: LiveClass = {
      id: `live_${Date.now()}`,
      teacherId: body.teacherId,
      title: body.title,
      description: body.description,
      level: body.level,
      scheduledDate: body.scheduledDate,
      duration: parseInt(body.duration),
      maxStudents: parseInt(body.maxStudents),
      enrolledStudents: [],
      isLive: false,
      meetingLink: body.meetingLink,
      meetingPassword: body.meetingPassword || undefined,
      createdAt: new Date().toISOString()
    };

    liveClasses.push(newClass);

    return NextResponse.json({
      success: true,
      class: newClass,
      message: 'Live class created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating live class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create live class' },
      { status: 500 }
    );
  }
}

// PUT - Update a live class
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Class ID is required' },
        { status: 400 }
      );
    }

    const classIndex = liveClasses.findIndex(cls => cls.id === id);
    if (classIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Live class not found' },
        { status: 404 }
      );
    }

    // Validate Google Meet link if being updated
    if (updateData.meetingLink && !updateData.meetingLink.includes('meet.google.com')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Google Meet link format' },
        { status: 400 }
      );
    }

    // Update the class
    liveClasses[classIndex] = {
      ...liveClasses[classIndex],
      ...updateData,
      id, // Ensure ID doesn't change
    };

    return NextResponse.json({
      success: true,
      class: liveClasses[classIndex],
      message: 'Live class updated successfully'
    });
  } catch (error) {
    console.error('Error updating live class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update live class' },
      { status: 500 }
    );
  }
}
