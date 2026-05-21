/**
 * GET /api/sources/scholars
 * Returns scholarly citations, filterable by madhab
 */

import { NextRequest, NextResponse } from 'next/server';
import { SourceService } from '@/lib/services/SourceService';
import { success, error, parsePagination, createPaginationMetadata } from '@/lib/api-response';

const sourceService = new SourceService();

const VALID_MADHABS = ['hanafi', 'maliki', 'shafi', 'shafi\'i', 'hanbali'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const { page, limit } = parsePagination(searchParams);

    const madhabParam = searchParams.madhab?.toLowerCase();
    const madhab = madhabParam && VALID_MADHABS.includes(madhabParam) ? madhabParam : searchParams.madhab || undefined;

    const result = await sourceService.getScholarSources({ madhab, page, limit });
    const metadata = createPaginationMetadata(result.total, result.page, result.limit);

    return NextResponse.json(success(result.items, metadata));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('GET /api/sources/scholars error:', err);
    return NextResponse.json(error('INTERNAL_ERROR', message), { status: 500 });
  }
}
