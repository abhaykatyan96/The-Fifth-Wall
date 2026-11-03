import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createValidatedOrder } from '@/services/orderService';
import { verifyAdminSession } from '@/lib/supabase/admin';
import { shippingAddressSchema } from '@/lib/validation/schemas';
import { mockStore } from '@/lib/supabase/mockStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      const userOrders = mockStore.getOrdersByEmail(email);
      return NextResponse.json({ success: true, data: userOrders });
    }

    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const allOrders = await getAllOrders();
    return NextResponse.json({ success: true, data: allOrders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItems, shippingAddress, couponCode, paymentMethod } = body;

    const validatedAddress = shippingAddressSchema.parse(shippingAddress);

    const order = await createValidatedOrder({
      items: cartItems,
      shippingAddress: validatedAddress,
      couponCode,
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
