import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString() 
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: 'POST request received successfully!', 
      receivedData: body,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to parse request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';