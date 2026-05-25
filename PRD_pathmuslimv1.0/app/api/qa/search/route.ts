import { NextRequest, NextResponse } from 'next/server';
import { QARepository, QACategoryValue, SortOption } from '@/lib/repositories/QARepository';
import { QAService } from '@/lib/services/QAService';
import { success, error } from '@/lib/api-response';

const VALID_CATEGORIES: QACategoryValue[] = ['family', 'work', 'spirituality', 'health', 'relationships', 'other'];
const VALID_SORTS: SortOption[] = ['relevance', 'recent', 'helpful'];

/**
 * @swagger
 * /api/qa/search:
 *   get:
 *     summary: Search Q&A knowledge base
 *     description: Search Islamic Q&A pairs with optional filtering by category and sorting
 *     tags:
 *       - Q&A
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query (minimum 2 characters, or use category filter for browsing)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [family, work, spirituality, health, relationships, other]
 *         description: Filter by category
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [relevance, recent, helpful]
 *           default: relevance
 *         description: Sort results by relevance, recency, or helpfulness
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
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     answers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/QAAnswer'
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category') ?? '';
  const sortParam = (searchParams.get('sort') ?? 'relevance') as SortOption;
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
  const limitParam = parseInt(searchParams.get('limit') ?? '10', 10);

  // Require q with at least 2 chars, OR category filter (browse mode)
  if (!q && !categoryParam) {
    return NextResponse.json(
      error('VALIDATION_ERROR', 'Search query q is required (min 2 chars), or provide a category filter'),
      { status: 400 }
    );
  }

  if (q && q.length < 2) {
    return NextResponse.json(
      error('VALIDATION_ERROR', 'Search query must be at least 2 characters'),
      { status: 400 }
    );
  }

  const category = VALID_CATEGORIES.includes(categoryParam as QACategoryValue)
    ? (categoryParam as QACategoryValue)
    : undefined;

  const sort = VALID_SORTS.includes(sortParam) ? sortParam : 'relevance';
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = isNaN(limitParam) || limitParam < 1 || limitParam > 50 ? 10 : limitParam;

  try {
    const result = await QARepository.searchAnswers(q, { category, sort, page, limit });

    const rankedAnswers =
      sort === 'relevance'
        ? QAService.rankResults(result.answers, q)
        : result.answers;

    return NextResponse.json(
      {
        ...success({ answers: rankedAnswers, total: result.total, page: result.page }),
        query: q,
        category: category ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('QA search error:', err);
    return NextResponse.json(
      error('SERVER_ERROR', 'Failed to search Q&A knowledge base'),
      { status: 500 }
    );
  }
}
