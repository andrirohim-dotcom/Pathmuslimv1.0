'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, userData, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigationLinks = [
    { href: '/dashboard/learning', label: 'Learning', requiresAuth: true },
    { href: '/dashboard/qa', label: 'Q&A', requiresAuth: true },
    { href: '/dashboard/sources', label: 'Sources', requiresAuth: true },
    { href: '/dashboard/progress', label: 'Progress', requiresAuth: true },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">PathMuslim</h1>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-700 hover:text-blue-600 transition text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {!user && !loading && (
              <>
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-blue-600 transition text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {user && (
              <>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {userData?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                      <div className="p-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">
                          {userData?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-slate-600">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        Settings
                      </Link>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleSignOut();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-slate-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-blue-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-slate-700 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
