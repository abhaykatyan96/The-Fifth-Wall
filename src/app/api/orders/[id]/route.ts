import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/services/orderService';
import { verifyAdminSession } from '@/lib/supabase/admin';
import { OrderStatus } from '@/types/database';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching order';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, trackingNumber, courierPartner } = body;

    const updated = await updateOrderStatus(id, status as OrderStatus, trackingNumber, courierPartner);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order could not be found or updated' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating order';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
