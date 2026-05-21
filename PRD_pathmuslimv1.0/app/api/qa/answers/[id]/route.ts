import { NextRequest, NextResponse } from 'next/server';
import { QARepository } from '@/lib/repositories/QARepository';
import { success, error } from '@/lib/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const detail = await QARepository.getAnswerById(id);

    if (!detail) {
      return NextResponse.json(
        error('NOT_FOUND', 'Answer not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(success(detail), { status: 200 });
  } catch (err) {
    console.error('Get answer error:', err);
    return NextResponse.json(
      error('SERVER_ERROR', 'Failed to retrieve answer'),
      { status: 500 }
    );
  }
}
