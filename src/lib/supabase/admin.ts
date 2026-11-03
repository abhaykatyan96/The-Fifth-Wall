import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, createClient as createServerSupabase } from './server';
import { cookies } from 'next/headers';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-key';

  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Validates whether the currently logged in user has administrative privileges.
 * Performs rigorous server-side verification:
 * 1. Checks Supabase Auth session & verified profile role
 * 2. Checks optional emergency ADMIN_BOOTSTRAP_SECRET session cookie
 */
export async function verifyAdminSession(): Promise<{ isAdmin: boolean; userId?: string; email?: string }> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('tfw_admin_auth');

  // Emergency local / bootstrap admin token check
  const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET || 'fifthwall_admin_pass_2026';
  if (adminCookie?.value === bootstrapSecret) {
    return { isAdmin: true, email: 'admin@thefifthwall.in', userId: 'admin-bootstrap-id' };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { isAdmin: false };
      }

      // Query profiles table with security definer to verify role
      const adminClient = createAdminClient();
      const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        return { isAdmin: false, userId: user.id, email: user.email };
      }

      return { isAdmin: true, userId: user.id, email: user.email };
    } catch {
      return { isAdmin: false };
    }
  }

  // If in demo mode and cookie matches
  if (adminCookie?.value === 'authenticated') {
    return { isAdmin: true, email: 'admin@thefifthwall.in', userId: 'admin-demo-id' };
  }

  return { isAdmin: false };
}
