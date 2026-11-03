import { NextRequest, NextResponse } from 'next/server';
import { razorpayOrderCreateSchema } from '@/lib/validation/schemas';
import { createRazorpayOrder } from '@/lib/payments/razorpay';
import { createValidatedOrder } from '@/services/orderService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = razorpayOrderCreateSchema.parse(body);

    // 1. Create order in pending status with server-calculated totals
    const order = await createValidatedOrder({
      items: validated.cartItems,
      shippingAddress: validated.shippingAddress,
      couponCode: validated.couponCode,
      paymentMethod: 'razorpay',
    });

    // 2. Generate official Razorpay Order for exact integer paise amount
    const razorpayOrder = await createRazorpayOrder({
      amountInPaise: order.total_in_paise,
      currency: 'INR',
      receipt: order.order_number,
      notes: {
        order_id: order.id,
        order_number: order.order_number,
        customer_email: order.customer_email,
      },
    });

    if (!razorpayOrder) {
      return NextResponse.json({ success: false, error: 'Could not create payment session' }, { status: 500 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_luxurydemo123';

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        razorpayOrderId: razorpayOrder.id,
        amountInPaise: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to initialize payment';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
