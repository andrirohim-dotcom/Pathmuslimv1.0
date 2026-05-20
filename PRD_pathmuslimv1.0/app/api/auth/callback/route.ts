import { NextRequest, NextResponse } from 'next/server';
import { createServerClientInstance } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Handle Supabase Auth callbacks
 * Processes access_token and refresh_token from auth flow
 * Sets secure HTTP-only cookies and redirects to appropriate page
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  logger.info('Auth callback received', {
    type,
    hasCode: !!code,
    hasError: !!error,
  });

  // Handle errors
  if (error) {
    logger.error(`Auth callback error: ${error}`, {
      error,
      errorDescription,
    });

    const errorUrl = new URL('/login', requestUrl.origin);
    errorUrl.searchParams.set('error', error);
    if (errorDescription) {
      errorUrl.searchParams.set('message', errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  // Handle recovery/password reset callback
  if (type === 'recovery' && code) {
    try {
      const supabase = await createServerClientInstance();

      // Exchange code for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        logger.error('Failed to exchange code for session', { error: exchangeError });
        return NextResponse.redirect(
          new URL('/forgot-password?error=failed_to_reset', requestUrl.origin)
        );
      }

      logger.info('Recovery code exchanged successfully');
      return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin));
    } catch (err) {
      logger.error('Auth callback error during recovery', { error: err });
      return NextResponse.redirect(
        new URL('/forgot-password?error=callback_failed', requestUrl.origin)
      );
    }
  }

  // Handle magic link callback
  if (type === 'magiclink' && code) {
    try {
      const supabase = await createServerClientInstance();

      // Exchange code for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        logger.error('Failed to exchange magic link code', { error: exchangeError });
        return NextResponse.redirect(
          new URL('/login?error=invalid_link', requestUrl.origin)
        );
      }

      logger.info('Magic link exchanged successfully');
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    } catch (err) {
      logger.error('Auth callback error during magic link', { error: err });
      return NextResponse.redirect(
        new URL('/login?error=callback_failed', requestUrl.origin)
      );
    }
  }

  // Handle standard OAuth callback
  if (code) {
    try {
      const supabase = await createServerClientInstance();

      // Exchange code for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        logger.error('Failed to exchange auth code', { error: exchangeError });
        return NextResponse.redirect(
          new URL('/login?error=auth_failed', requestUrl.origin)
        );
      }

      logger.info('Auth code exchanged successfully, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    } catch (err) {
      logger.error('Auth callback error', { error: err });
      return NextResponse.redirect(
        new URL('/login?error=callback_failed', requestUrl.origin)
      );
    }
  }

  logger.warn('Auth callback called with no code or error');
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}
