import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    await pool.query('INSERT INTO newsletter (email) VALUES ($1) ON CONFLICT DO NOTHING', [email]);
    return NextResponse.json({ message: 'Subscribed' });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 