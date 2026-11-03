import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createAdminCategory } from '@/services/categoryService';
import { verifyAdminSession } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
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
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });
    }

    const category = await createAdminCategory({
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      image_url: body.image_url || null,
      display_order: body.display_order || 0,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
