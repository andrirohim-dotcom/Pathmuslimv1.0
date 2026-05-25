import { NextRequest, NextResponse } from 'next/server';
import { SourceService } from '@/lib/services/SourceService';
import { success, error, parsePagination, createPaginationMetadata } from '@/lib/api-response';

/**
 * @swagger
 * /api/sources/quran:
 *   get:
 *     summary: Get Quranic sources
 *     description: Retrieve Quranic verses and references, optionally filtered by surah (chapter)
 *     tags:
 *       - Sources
 *     parameters:
 *       - in: query
 *         name: surah
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 114
 *         description: Surah number (1-114) to filter by specific chapter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Quranic sources retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Source'
 *       400:
 *         description: Invalid query parameters (e.g., surah out of range)
 */

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
