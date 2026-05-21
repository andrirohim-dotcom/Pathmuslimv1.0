import { NextResponse } from 'next/server';
import { QARepository } from '@/lib/repositories/QARepository';
import { success, error } from '@/lib/api-response';

export async function GET() {
  try {
    const categories = await QARepository.getCategories();
    return NextResponse.json(success({ categories }), { status: 200 });
  } catch (err) {
    console.error('Get categories error:', err);
    return NextResponse.json(
      error('SERVER_ERROR', 'Failed to retrieve categories'),
      { status: 500 }
    );
  }
}
