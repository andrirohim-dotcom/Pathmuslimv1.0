import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. It may have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-6 rounded-lg transition"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-slate-600 text-sm">
            Can&apos;t find what you&apos;re looking for?{' '}
            <a href="mailto:support@pathmuslim.com" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
