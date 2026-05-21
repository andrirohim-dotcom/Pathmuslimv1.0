'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { User } from '@/lib/types';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  userData: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Initialize auth state on mount and listen for changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Get current session
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Fetch user profile from database if authenticated
        if (currentSession?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', currentSession.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 = no rows returned, which is fine for new users
            throw profileError;
          }

          if (profile) {
            setUserData(profile as User);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize auth';
        setError(message);
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setError(null);

      // Fetch user profile on auth change
      if (currentSession?.user) {
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', currentSession.user.id)
            .single();

          if (profile) {
            setUserData(profile as User);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserData(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      setLoading(true);

      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase.from('users').insert({
          auth_id: data.user.id,
          email,
          full_name: fullName,
        });

        if (profileError) {
          throw profileError;
        }

        // Create user settings
        await supabase.from('user_settings').insert({
          user_id: data.user.id,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      setUser(null);
      setSession(null);
      setUserData(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/callback?type=recovery`,
      });

      if (resetError) {
        throw resetError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userData,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
