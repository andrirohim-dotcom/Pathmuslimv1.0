import { NextRequest, NextResponse } from 'next/server';
import { ModuleRepository } from '@/lib/repositories/ModuleRepository';
import { success, error } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(error('UNAUTHORIZED', 'No authentication token'), {
        status: 401,
      });
    }

    // Extract user ID from header (in production, from JWT)
    const userId = request.headers.get('x-user-id') || 'mock-user-id';
    const resolvedParams = await params;
    const moduleId = resolvedParams.id;

    if (!moduleId) {
      return NextResponse.json(
        error('INVALID_REQUEST', 'Module ID is required'),
        { status: 400 }
      );
    }

    // Parse request body
    let assessmentScore: number | undefined;
    try {
      const body = await request.json();
      if (body.assessment_score !== undefined) {
        assessmentScore = body.assessment_score;

        // Validate assessment score
        if (typeof assessmentScore !== 'number' || assessmentScore < 0 || assessmentScore > 100) {
          return NextResponse.json(
            error('VALIDATION_ERROR', 'Assessment score must be between 0 and 100'),
            { status: 400 }
          );
        }
      }
    } catch (parseErr) {
      // Empty body is okay, assessment_score is optional
    }

    // Complete the module
    const {
      progress,
      nextModule,
      progressSummary,
      milestoneUnlocked,
    } = await ModuleRepository.completeModule(moduleId, userId, assessmentScore);

    // Return detailed completion response
    return NextResponse.json(
      success({
        module_id: moduleId,
        is_completed: true,
        completed_at: progress.completed_at,
        assessment_score: progress.assessment_score,
        next_module: nextModule,
        progress_summary: progressSummary,
        milestone_unlocked: milestoneUnlocked,
      })
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error(`POST /api/learning/modules/[id]/complete error:`, err);

    // Check specific error cases
    if (errorMessage.includes('Prerequisites')) {
      return NextResponse.json(
        error('PREREQUISITES_NOT_MET', 'Module prerequisites have not been met'),
        { status: 400 }
      );
    }

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        error('NOT_FOUND', 'Module not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(
      error('INTERNAL_ERROR', errorMessage, { details: String(err) }),
      { status: 500 }
    );
  }
}
