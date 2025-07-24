import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(request: Request) {
  const { name, email, level } = await request.json();
  if (!name || !email || !level) return NextResponse.json({ error: 'All fields required' }, { status: 400 });

  try {
    await pool.query('INSERT INTO book_club (name, email, level) VALUES ($1, $2, $3)', [name, email, level]);
    return NextResponse.json({ message: 'Registration saved' });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 