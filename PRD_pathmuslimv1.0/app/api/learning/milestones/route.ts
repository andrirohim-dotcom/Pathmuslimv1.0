import { NextRequest, NextResponse } from 'next/server';
import { MilestoneService } from '@/lib/services/MilestoneService';
import { success, error } from '@/lib/api-response';

/**
 * @swagger
 * /api/learning/milestones:
 *   get:
 *     summary: Get user milestones
 *     description: Returns user's achieved milestones and progress toward next milestone
 *     tags:
 *       - Learning
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milestones data retrieved successfully
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
 *                     achieved:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Milestone'
 *                     next:
 *                       $ref: '#/components/schemas/Milestone'
 *       401:
 *         description: Authentication required
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(error('UNAUTHORIZED', 'No authentication token'), {
        status: 401,
      });
    }

    const userId = request.headers.get('x-user-id') || 'mock-user-id';

    const result = await MilestoneService.getUserMilestones(userId);

    return NextResponse.json(
      success({
        achieved: result.achieved.map((a) => ({
          id: a.milestone.id,
          name: a.milestone.name,
          description: a.milestone.description,
          trigger_condition: a.milestone.trigger_condition,
          achievement_at: a.achievement_at,
        })),
        next: result.next
          ? {
              name: result.next.milestone.name,
              description: result.next.milestone.description,
              trigger_condition: result.next.milestone.trigger_condition,
              modules_remaining: result.next.modules_remaining,
            }
          : null,
      })
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('GET /api/learning/milestones error:', err);

    return NextResponse.json(
      error('INTERNAL_ERROR', errorMessage, { details: String(err) }),
      { status: 500 }
    );
  }
}
