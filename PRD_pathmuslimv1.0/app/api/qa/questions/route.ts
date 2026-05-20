import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'Submit question endpoint - not yet implemented' },
    { status: 501 }
  );
}
