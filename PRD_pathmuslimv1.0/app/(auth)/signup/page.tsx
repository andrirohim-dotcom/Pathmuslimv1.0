'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const validateForm = (): boolean => {
    // Check all fields are filled
    if (!formData.email || !formData.password || !formData.fullName) {
      setValidationError('All fields are required');
      return false;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    // Check password length
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return false;
    }

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }

    // Check full name length
    if (formData.fullName.length < 2) {
      setValidationError('Full name must be at least 2 characters');
      return false;
    }

    // Check terms agreement
    if (!agreedToTerms) {
      setValidationError('You must agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      // Error is already set in AuthContext
      console.error('Signup error:', err);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">PathMuslim</h1>
          <p className="text-slate-600">Start your Islamic learning journey</p>
        </div>

        {displayError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{displayError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
              placeholder="At least 8 characters"
              required
            />
            <p className="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
              placeholder="Re-enter your password"
              required
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              disabled={loading}
              className="mt-1 w-4 h-4 border-slate-300 rounded disabled:cursor-not-allowed"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                terms and conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
