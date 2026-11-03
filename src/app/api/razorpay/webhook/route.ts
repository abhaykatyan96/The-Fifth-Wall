import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay';
import { updateOrderStatus, getOrderById } from '@/services/orderService';

// Set of processed payment IDs to prevent duplicate webhook processing (idempotency)
const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing Razorpay webhook signature' }, { status: 400 });
    }

    const rawBody = await req.text();
    const isSignatureValid = verifyRazorpayWebhookSignature(rawBody, signature);

    if (!isSignatureValid) {
      console.warn('[Razorpay Webhook] Invalid signature rejected');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event?.event_id || event?.payload?.payment?.entity?.id;

    if (eventId && processedEvents.has(eventId)) {
      // Duplicate event already handled
      return NextResponse.json({ status: 'already_processed' }, { status: 200 });
    }

    if (eventId) {
      processedEvents.add(eventId);
    }

    const eventType = event.event;
    console.log(`[Razorpay Webhook Event] ${eventType}`);

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.notes?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const order = await getOrderById(orderId);
        if (order) {
          const updated = await updateOrderStatus(order.id, 'confirmed');
          if (updated) {
            updated.payment_status = 'paid';
            if (paymentId) updated.razorpay_payment_id = paymentId;
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.notes?.order_id;
      if (orderId) {
        const order = await getOrderById(orderId);
        if (order) {
          order.payment_status = 'failed';
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
