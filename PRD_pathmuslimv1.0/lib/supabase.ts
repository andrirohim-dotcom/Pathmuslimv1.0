import { createBrowserClient, createServerClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client
 * Use this in client components and React hooks
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server-side Supabase client
 * Use this in API routes and server components
 */
export async function createServerClientInstance() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get the current authenticated user
 */
export async function getUser() {
  const supabase = await createServerClientInstance();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return user;
}

/**
 * Get the current user's session
 */
export async function getSession() {
  const supabase = await createServerClientInstance();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return { data, error };
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createServerClientInstance();

  const { error } = await supabase.auth.signOut();

  return { error };
}

/**
 * Request a password reset email
 */
export async function resetPassword(email: string) {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback?type=recovery`,
  });

  return { data, error };
}

/**
 * Update user password with recovery token
 */
export async function updatePassword(password: string) {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  return { data, error };
}
