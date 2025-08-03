import { NextRequest, NextResponse } from 'next/server';
import { Ebook } from '@/types';

// Mock database - replace with actual database implementation
let ebooks: Ebook[] = [
  {
    id: '1',
    title: 'Yoruba Grammar Fundamentals',
    author: 'Dr. Adebayo Ogundimu',
    description: 'A comprehensive guide to Yoruba grammar rules and sentence structure.',
    category: 'Grammar',
    language: 'Bilingual',
    pages: 156,
    fileSize: '2.3 MB',
    fileUrl: 'https://example.com/ebooks/yoruba-grammar.pdf',
    coverImageUrl: 'https://example.com/covers/grammar.jpg',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Àkójọpọ̀ Àwọn Àlọ́ Yorùbá',
    author: 'Prof. Kemi Adeyemi',
    description: 'A collection of traditional Yoruba folktales with moral lessons.',
    category: 'Stories',
    language: 'Yoruba',
    pages: 89,
    fileSize: '1.8 MB',
    fileUrl: 'https://example.com/ebooks/yoruba-tales.pdf',
    coverImageUrl: 'https://example.com/covers/tales.jpg',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Yoruba for Beginners',
    author: 'Mrs. Folake Johnson',
    description: 'Start your Yoruba learning journey with basic vocabulary and phrases.',
    category: 'Beginner',
    language: 'English',
    pages: 124,
    fileSize: '3.1 MB',
    fileUrl: 'https://example.com/ebooks/yoruba-beginners.pdf',
    coverImageUrl: 'https://example.com/covers/beginners.jpg',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    title: 'Ìtàn Àtijọ́ Yorùbá',
    author: 'Chief Wole Ogundipe',
    description: 'Ancient Yoruba history and cultural heritage.',
    category: 'Cultural',
    language: 'Yoruba',
    pages: 203,
    fileSize: '4.2 MB',
    fileUrl: 'https://example.com/ebooks/yoruba-history.pdf',
    coverImageUrl: 'https://example.com/covers/history.jpg',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    title: 'Advanced Yoruba Conversation',
    author: 'Dr. Taiwo Adesanya',
    description: 'Master complex Yoruba conversations and idiomatic expressions.',
    category: 'Advanced',
    language: 'Bilingual',
    pages: 178,
    fileSize: '3.7 MB',
    fileUrl: 'https://example.com/ebooks/advanced-conversation.pdf',
    coverImageUrl: 'https://example.com/covers/advanced.jpg',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET - Fetch all ebooks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const language = searchParams.get('language');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let filteredEbooks = ebooks;

    // Filter by category if provided
    if (category && category !== 'All') {
      filteredEbooks = filteredEbooks.filter(ebook => ebook.category === category);
    }

    // Filter by language if provided
    if (language && language !== 'All') {
      filteredEbooks = filteredEbooks.filter(ebook => ebook.language === language);
    }

    // Search in title, author, or description
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEbooks = filteredEbooks.filter(ebook => 
        ebook.title.toLowerCase().includes(searchLower) ||
        ebook.author.toLowerCase().includes(searchLower) ||
        ebook.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filteredEbooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination if provided
    const startIndex = offset ? parseInt(offset) : 0;
    const endIndex = limit ? startIndex + parseInt(limit) : filteredEbooks.length;
    const paginatedEbooks = filteredEbooks.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      ebooks: paginatedEbooks,
      total: filteredEbooks.length,
      offset: startIndex,
      limit: limit ? parseInt(limit) : filteredEbooks.length,
      categories: ['Beginner', 'Intermediate', 'Advanced', 'Cultural', 'Grammar', 'Stories'],
      languages: ['Yoruba', 'English', 'Bilingual']
    });
  } catch (error) {
    console.error('Error fetching ebooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ebooks' },
      { status: 500 }
    );
  }
}

// POST - Create a new ebook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'author', 'description', 'category', 'language', 'pages', 'fileSize', 'fileUrl'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new ebook
    const newEbook: Ebook = {
      id: `ebook_${Date.now()}`,
      title: body.title,
      author: body.author,
      description: body.description,
      category: body.category,
      language: body.language,
      pages: parseInt(body.pages),
      fileSize: body.fileSize,
      fileUrl: body.fileUrl,
      coverImageUrl: body.coverImageUrl || undefined,
      createdAt: new Date().toISOString()
    };

    ebooks.push(newEbook);

    return NextResponse.json({
      success: true,
      ebook: newEbook,
      message: 'Ebook created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating ebook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ebook' },
      { status: 500 }
    );
  }
}

// PUT - Update an ebook
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ebook ID is required' },
        { status: 400 }
      );
    }

    const ebookIndex = ebooks.findIndex(ebook => ebook.id === id);
    if (ebookIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Ebook not found' },
        { status: 404 }
      );
    }

    // Update the ebook
    ebooks[ebookIndex] = {
      ...ebooks[ebookIndex],
      ...updateData,
      id, // Ensure ID doesn't change
    };

    return NextResponse.json({
      success: true,
      ebook: ebooks[ebookIndex],
      message: 'Ebook updated successfully'
    });
  } catch (error) {
    console.error('Error updating ebook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ebook' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an ebook
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ebook ID is required' },
        { status: 400 }
      );
    }

    const ebookIndex = ebooks.findIndex(ebook => ebook.id === id);
    if (ebookIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Ebook not found' },
        { status: 404 }
      );
    }

    // Remove the ebook
    const deletedEbook = ebooks.splice(ebookIndex, 1)[0];

    return NextResponse.json({
      success: true,
      ebook: deletedEbook,
      message: 'Ebook deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ebook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ebook' },
      { status: 500 }
    );
  }
}
