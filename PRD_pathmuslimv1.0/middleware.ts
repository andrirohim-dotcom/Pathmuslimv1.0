import { NextRequest, NextResponse } from 'next/server';
import { logger, generateRequestId } from '@/lib/logger';

/**
 * Protected routes that require authentication
 * Unauthenticated users are redirected to /login
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/learning',
  '/qa',
  '/sources',
  '/progress',
  '/profile',
  '/settings',
];

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/api/auth',
];

/**
 * Middleware for request logging, error handling, and authentication
 */
export function middleware(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  const pathname = request.nextUrl.pathname;

  // Log incoming request
  logger.info(`[${requestId}] ${request.method} ${pathname}`, {
    requestId,
    method: request.method,
    pathname,
    userAgent: request.headers.get('user-agent'),
  });

  // Get authentication token from cookies
  const token = request.cookies.get('sb-access-token')?.value;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    logger.warn(`[${requestId}] Unauthorized access to ${pathname}`, {
      requestId,
      pathname,
    });
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if authenticated user tries to access login/signup
  if ((pathname === '/login' || pathname === '/signup') && token) {
    logger.info(`[${requestId}] Authenticated user redirected from ${pathname} to /dashboard`, {
      requestId,
      pathname,
    });
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add request ID to response headers
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', requestId);

  // Log response time
  const duration = Date.now() - startTime;
  logger.info(`[${requestId}] Request completed in ${duration}ms`, {
    requestId,
    duration,
    pathname,
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
