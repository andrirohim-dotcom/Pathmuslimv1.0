'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for monitoring
    logger.error('Application error', {
      error: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-4 max-w-md">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-red-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h1>
        <p className="text-slate-600 mb-6">
          We&apos;re sorry for the inconvenience. An unexpected error occurred while processing your request.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-semibold text-red-900 mb-2">Error Details (Development Only):</p>
            <p className="text-xs text-red-800 font-mono break-words mb-2">{error.message}</p>
            {error.digest && <p className="text-xs text-red-700">Error ID: {error.digest}</p>}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-6 rounded-lg transition"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-slate-600 text-sm">
            Need help?{' '}
            <a href="mailto:support@pathmuslim.com" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
