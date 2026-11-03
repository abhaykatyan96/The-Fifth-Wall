import { isSupabaseConfigured, createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mockStore } from '@/lib/supabase/mockStore';
import { Product } from '@/types/database';

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  search?: string;
  minPriceInPaise?: number;
  maxPriceInPaise?: number;
  finish?: string;
  style?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popularity';
}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase.from('products').select('*, category:categories(*)').eq('is_active', true);

      if (options?.featured) query = query.eq('is_featured', true);
      if (options?.bestseller) query = query.eq('is_bestseller', true);
      if (options?.newArrival) query = query.eq('is_new_arrival', true);
      if (options?.minPriceInPaise !== undefined) query = query.gte('price_in_paise', options.minPriceInPaise);
      if (options?.maxPriceInPaise !== undefined) query = query.lte('price_in_paise', options.maxPriceInPaise);

      if (options?.sort === 'price_asc') {
        query = query.order('price_in_paise', { ascending: true });
      } else if (options?.sort === 'price_desc') {
        query = query.order('price_in_paise', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let items = data as Product[];
        if (options?.categorySlug) {
          items = items.filter((p) => p.category?.slug === options.categorySlug);
        }
        if (options?.search) {
          const q = options.search.toLowerCase();
          items = items.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }
        return items;
      }
    } catch {
      // Fallback to mockStore
    }
  }

  return mockStore.getProducts(options);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!error && data) return data as Product;
    } catch {
      // Fallback
    }
  }

  const found = mockStore.getProductBySlug(slug);
  return found || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single();

      if (!error && data) return data as Product;
    } catch {
      // Fallback
    }
  }

  const found = mockStore.getProductById(id);
  return found || null;
}

export async function createAdminProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient.from('products').insert([productData]).select().single();
      if (!error && data) return data as Product;
    } catch {
      // Fallback
    }
  }

  return mockStore.createProduct(productData);
}

export async function updateAdminProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient.from('products').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Product;
    } catch {
      // Fallback
    }
  }

  return mockStore.updateProduct(id, updates);
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const { error } = await adminClient.from('products').delete().eq('id', id);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  return mockStore.deleteProduct(id);
}
