import { isSupabaseConfigured, createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mockStore } from '@/lib/supabase/mockStore';
import { Category } from '@/types/database';

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // Fallback
    }
  }

  return mockStore.getCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
      if (!error && data) return data as Category;
    } catch {
      // Fallback
    }
  }

  const cat = mockStore.getCategoryBySlug(slug);
  return cat || null;
}

export async function createAdminCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient.from('categories').insert([category]).select().single();
      if (!error && data) return data as Category;
    } catch {
      // Fallback
    }
  }

  return mockStore.createCategory(category);
}
