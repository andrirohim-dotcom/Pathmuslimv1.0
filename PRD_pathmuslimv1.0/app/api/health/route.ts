import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API server
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-05-25T12:00:00.000Z"
 *                 version:
 *                   type: string
 *                   example: "0.1.0"
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  });
}
