import { NextRequest, NextResponse } from 'next/server';
import { ModuleRepository } from '@/lib/repositories/ModuleRepository';
import { success, error } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const moduleId = params.id;

    if (!moduleId) {
      return NextResponse.json(
        error('INVALID_REQUEST', 'Module ID is required'),
        { status: 400 }
      );
    }

    // Get module
    const module = await ModuleRepository.getModuleById(moduleId, userId);

    if (!module) {
      return NextResponse.json(
        error('NOT_FOUND', 'Module not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(success(module));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error(`GET /api/learning/modules/[id] error:`, err);

    return NextResponse.json(
      error('INTERNAL_ERROR', errorMessage, { details: String(err) }),
      { status: 500 }
    );
  }
}
