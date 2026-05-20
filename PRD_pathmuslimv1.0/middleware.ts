import { NextRequest, NextResponse } from 'next/server';
import { logger, generateRequestId } from '@/lib/logger';

/**
 * Middleware for request logging and error handling
 */
export function middleware(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  // Log incoming request
  logger.info(`[${requestId}] ${request.method} ${request.nextUrl.pathname}`, {
    requestId,
    method: request.method,
    pathname: request.nextUrl.pathname,
    userAgent: request.headers.get('user-agent'),
  });

  // Add request ID to response headers
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', requestId);

  // Log response time
  const duration = Date.now() - startTime;
  logger.info(`[${requestId}] Request completed in ${duration}ms`, {
    requestId,
    duration,
    pathname: request.nextUrl.pathname,
  });

  return response;
}

/**
 * Configure which routes this middleware applies to
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
