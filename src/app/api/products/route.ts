import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createAdminProduct } from '@/services/productService';
import { verifyAdminSession } from '@/lib/supabase/admin';
import { adminProductSchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true';
    const bestseller = searchParams.get('bestseller') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const search = searchParams.get('search') || undefined;
    const finish = searchParams.get('finish') || undefined;
    const style = searchParams.get('style') || undefined;
    const sort = (searchParams.get('sort') as 'newest' | 'price_asc' | 'price_desc' | 'popularity') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) * 100 : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) * 100 : undefined;

    const products = await getProducts({
      categorySlug,
      featured: featured || undefined,
      bestseller: bestseller || undefined,
      newArrival: newArrival || undefined,
      search,
      finish,
      style,
      sort,
      minPriceInPaise: minPrice,
      maxPriceInPaise: maxPrice,
    });

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const validated = adminProductSchema.parse(body);

    const newProduct = await createAdminProduct({
      name: validated.name,
      slug: validated.slug,
      category_id: validated.categoryId,
      short_description: validated.shortDescription || null,
      description: validated.description,
      price_in_paise: Math.round(validated.priceInRupees * 100),
      compare_at_price_in_paise: validated.compareAtPriceInRupees ? Math.round(validated.compareAtPriceInRupees * 100) : null,
      material: validated.material || null,
      dimensions: validated.dimensions || null,
      finish: validated.finish || null,
      color: validated.color || null,
      style: validated.style || null,
      stock_quantity: validated.stockQuantity,
      is_featured: validated.isFeatured,
      is_bestseller: validated.isBestseller,
      is_new_arrival: validated.isNewArrival,
      is_active: validated.isActive,
      primary_image_url: validated.primaryImageUrl,
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
