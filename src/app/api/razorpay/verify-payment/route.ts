import { NextRequest, NextResponse } from 'next/server';
import { razorpayVerifySchema } from '@/lib/validation/schemas';
import { verifyRazorpayPaymentSignature } from '@/lib/payments/razorpay';
import { updateOrderStatus, getOrderById } from '@/services/orderService';
import { mockStore } from '@/lib/supabase/mockStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = razorpayVerifySchema.parse(body);

    // Verify cryptographic HMAC signature
    const isValid = verifyRazorpayPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Untrusted payload.' },
        { status: 400 }
      );
    }

    // Retrieve order and update status to confirmed / paid
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updated = await updateOrderStatus(orderId, 'confirmed');
    if (updated) {
      updated.payment_status = 'paid';
      updated.razorpay_payment_id = razorpayPaymentId;
      updated.razorpay_order_id = razorpayOrderId;
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully and order confirmed.',
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        status: 'confirmed',
        paymentStatus: 'paid',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment verification error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
