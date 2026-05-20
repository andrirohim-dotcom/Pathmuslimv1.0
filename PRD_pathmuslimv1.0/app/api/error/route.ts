import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

interface ClientErrorPayload {
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp?: string;
  userAgent?: string;
  url?: string;
}

/**
 * Endpoint for logging client-side errors
 * Used to track application errors that occur in the browser
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ClientErrorPayload;

    // Log the error with full context
    logger.error('Client-side error reported', {
      message: body.message,
      stack: body.stack,
      context: body.context,
      timestamp: body.timestamp,
      userAgent: body.userAgent,
      url: body.url,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // If we can't parse the error, still log it
    logger.error('Failed to process error report', {
      error: error instanceof Error ? error.message : 'Unknown error',
      body: request.body,
    });

    return NextResponse.json(
      { success: false, error: 'Failed to process error report' },
      { status: 400 }
    );
  }
}
