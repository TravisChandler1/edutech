import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { reference } = await request.json();
  if (!reference) return NextResponse.json({ error: 'Reference required' }, { status: 400 });

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
} 