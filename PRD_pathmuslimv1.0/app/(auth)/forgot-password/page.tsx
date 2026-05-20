'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!email) {
      setValidationError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword(email);
      setSuccessMessage('Check your email for a password reset link. It may take a few minutes to arrive.');
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
          <p className="text-slate-600">We&apos;ll help you recover your account</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {(validationError || error) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{validationError || error}</p>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Enter the email address associated with your account
              </p>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError(null);
                }}
                disabled={loading}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
                placeholder="your.email@example.com"
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>

        {/* Back to Signup Link */}
        <div className="text-center text-sm text-slate-600 mt-2">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
