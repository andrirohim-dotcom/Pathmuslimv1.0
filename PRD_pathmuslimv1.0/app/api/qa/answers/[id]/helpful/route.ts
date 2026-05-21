import { NextRequest, NextResponse } from 'next/server';
import { QARepository } from '@/lib/repositories/QARepository';
import { success, error } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = request.headers.get('x-user-id') || 'anonymous';

  try {
    const result = await QARepository.toggleHelpful(id, userId);
    return NextResponse.json(success(result), { status: 200 });
  } catch (err) {
    console.error('Toggle helpful error:', err);
    return NextResponse.json(
      error('SERVER_ERROR', 'Failed to record helpful vote'),
      { status: 500 }
    );
  }
}
