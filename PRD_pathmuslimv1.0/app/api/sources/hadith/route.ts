/**
 * GET /api/sources/hadith
 * Returns Hadith references, filterable by collection and grade
 */

import { NextRequest, NextResponse } from 'next/server';
import { SourceService } from '@/lib/services/SourceService';
import { success, error, parsePagination, createPaginationMetadata } from '@/lib/api-response';

const sourceService = new SourceService();

const VALID_GRADES = ['sahih', 'hasan', 'weak', 'da\'if'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const { page, limit } = parsePagination(searchParams);

    const collection = searchParams.collection || undefined;
    const gradeParam = searchParams.grade?.toLowerCase();
    const grade = gradeParam && VALID_GRADES.includes(gradeParam) ? gradeParam : undefined;

    const result = await sourceService.getHadithSources({ collection, grade, page, limit });
    const metadata = createPaginationMetadata(result.total, result.page, result.limit);

    return NextResponse.json(success(result.items, metadata));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('GET /api/sources/hadith error:', err);
    return NextResponse.json(error('INTERNAL_ERROR', message), { status: 500 });
  }
}
