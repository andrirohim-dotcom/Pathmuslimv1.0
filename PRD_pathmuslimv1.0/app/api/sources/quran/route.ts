/**
 * GET /api/sources/quran
 * Returns Quranic source references, filterable by surah number
 */

import { NextRequest, NextResponse } from 'next/server';
import { SourceService } from '@/lib/services/SourceService';
import { success, error, parsePagination, createPaginationMetadata } from '@/lib/api-response';

const sourceService = new SourceService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const { page, limit } = parsePagination(searchParams);

    const surahParam = searchParams.surah;
    let surah: number | undefined;
    if (surahParam) {
      const parsed = parseInt(surahParam, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 114) {
        return NextResponse.json(
          error('INVALID_PARAM', 'surah must be a number between 1 and 114'),
          { status: 400 }
        );
      }
      surah = parsed;
    }

    const result = await sourceService.getQuranSources({ surah, page, limit });
    const metadata = createPaginationMetadata(result.total, result.page, result.limit);

    return NextResponse.json(success(result.items, metadata));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('GET /api/sources/quran error:', err);
    return NextResponse.json(error('INTERNAL_ERROR', message), { status: 500 });
  }
}
