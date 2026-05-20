import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'Q&A search endpoint - not yet implemented' },
    { status: 501 }
  );
}
