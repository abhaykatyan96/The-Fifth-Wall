import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, getProductById, updateAdminProduct, deleteAdminProduct } from '@/services/productService';
import { verifyAdminSession } from '@/lib/supabase/admin';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let product = await getProductBySlug(slug);
    if (!product) {
      product = await getProductById(slug);
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching product';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { slug } = await params;
    const body = await req.json();

    let target = await getProductBySlug(slug);
    if (!target) target = await getProductById(slug);

    if (!target) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Convert rupee fields if passed
    const updates: Record<string, unknown> = { ...body };
    if (typeof body.priceInRupees === 'number') {
      updates.price_in_paise = Math.round(body.priceInRupees * 100);
      delete updates.priceInRupees;
    }
    if (typeof body.compareAtPriceInRupees === 'number') {
      updates.compare_at_price_in_paise = Math.round(body.compareAtPriceInRupees * 100);
      delete updates.compareAtPriceInRupees;
    }

    const updated = await updateAdminProduct(target.id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating product';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { slug } = await params;
    let target = await getProductBySlug(slug);
    if (!target) target = await getProductById(slug);

    if (!target) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const deleted = await deleteAdminProduct(target.id);
    return NextResponse.json({ success: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting product';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
