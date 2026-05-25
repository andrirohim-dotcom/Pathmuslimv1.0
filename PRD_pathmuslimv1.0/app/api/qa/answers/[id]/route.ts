import { NextRequest, NextResponse } from 'next/server';
import { QARepository } from '@/lib/repositories/QARepository';
import { success, error } from '@/lib/api-response';

/**
 * @swagger
 * /api/qa/answers/{id}:
 *   get:
 *     summary: Get a specific Q&A answer
 *     description: Retrieve full details of a single Q&A answer by ID, including sources and references
 *     tags:
 *       - Q&A
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Answer ID
 *     responses:
 *       200:
 *         description: Answer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/QAAnswer'
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Server error
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const detail = await QARepository.getAnswerById(id);

    if (!detail) {
      return NextResponse.json(
        error('NOT_FOUND', 'Answer not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(success(detail), { status: 200 });
  } catch (err) {
    console.error('Get answer error:', err);
    return NextResponse.json(
      error('SERVER_ERROR', 'Failed to retrieve answer'),
      { status: 500 }
    );
  }
}
