import { NextRequest, NextResponse } from 'next/server';
import { QARepository, QACategoryValue } from '@/lib/repositories/QARepository';
import { QAService } from '@/lib/services/QAService';
import { success, error } from '@/lib/api-response';

const VALID_CATEGORIES: QACategoryValue[] = ['family', 'work', 'spirituality', 'health', 'relationships', 'other'];

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(error('VALIDATION_ERROR', 'Invalid JSON body'), { status: 400 });
  }

  const { title, content, category, is_sensitive } = body as {
    title?: string;
    content?: string;
    category?: string;
    is_sensitive?: boolean;
  };

  // Validate required fields
  const validationErrors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length < 10) {
    validationErrors.push('title must be at least 10 characters');
  }
  if (title && title.trim().length > 200) {
    validationErrors.push('title must be at most 200 characters');
  }
  if (!content || typeof content !== 'string' || content.trim().length < 20) {
    validationErrors.push('content must be at least 20 characters');
  }
  if (content && content.trim().length > 2000) {
    validationErrors.push('content must be at most 2000 characters');
  }
  if (!category || !VALID_CATEGORIES.includes(category as QACategoryValue)) {
    validationErrors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        ...error('VALIDATION_ERROR', 'Validation failed'),
        messages: validationErrors,
      },
      { status: 400 }
    );
  }

  try {
    // Check for duplicate questions
    const duplicateId = await QAService.detectDuplicate(title!.trim());
    if (duplicateId) {
      return NextResponse.json(
        {
          success: false,
          error: 'DUPLICATE',
          message: 'A similar question already exists. Please see the existing answer.',
          similar_question_id: duplicateId,
        },
        { status: 409 }
      );
    }

    // Use anonymous user id for now (auth not enforced in Phase 4)
    const userId = request.headers.get('x-user-id') || 'anonymous';

    const result = await QARepository.submitQuestion(
      {
        title: title!.trim(),
        content: content!.trim(),
        category: category as QACategoryValue,
        is_sensitive: typeof is_sensitive === 'boolean' ? is_sensitive : false,
      },
      userId
    );

    return NextResponse.json(
      success({
        tracking_id: result.tracking_id,
        status: result.status,
        message:
          'Thank you for your question! Our team will research and provide sourced answers within 48 hours. JazakAllahu Khayran.',
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error('Submit question error:', err);
    return NextResponse.json(
      error('SERVER_ERROR', 'Failed to submit question'),
      { status: 500 }
    );
  }
}
