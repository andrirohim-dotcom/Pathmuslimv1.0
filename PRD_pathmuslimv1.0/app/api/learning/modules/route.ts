import { NextRequest, NextResponse } from 'next/server';
import { ModuleRepository } from '@/lib/repositories/ModuleRepository';
import { success, error, parsePagination, createPaginationMetadata } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(error('UNAUTHORIZED', 'No authentication token'), {
        status: 401,
      });
    }

    // In production, verify the JWT token here
    // For now, extract user ID from a custom header or JWT payload
    const userId = request.headers.get('x-user-id') || 'mock-user-id';

    // Parse pagination
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const { page, limit, offset } = parsePagination(searchParams);

    // Get modules
    const { modules, total } = await ModuleRepository.getAllModules(userId, page, limit);

    const metadata = createPaginationMetadata(total, page, limit);

    return NextResponse.json(success(modules, metadata));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('GET /api/learning/modules error:', err);

    return NextResponse.json(
      error('INTERNAL_ERROR', errorMessage, { details: String(err) }),
      { status: 500 }
    );
  }
}
