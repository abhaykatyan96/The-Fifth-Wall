import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId.includes('dummy') || keyId.includes('luxurydemo')) {
    // In demo mode or unconfigured mode
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Creates an official Razorpay order on the backend.
 * All amounts are in integer paise (e.g. ₹24,800.00 = 2480000 paise).
 */
export async function createRazorpayOrder(params: {
  amountInPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string } | null> {
  const client = getRazorpayClient();

  if (!client) {
    // Test mode fallback identifier
    return {
      id: `order_tfw_test_${Date.now()}`,
      amount: params.amountInPaise,
      currency: params.currency || 'INR',
    };
  }

  const order = await client.orders.create({
    amount: params.amountInPaise,
    currency: params.currency || 'INR',
    receipt: params.receipt,
    notes: params.notes,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

/**
 * Verifies Razorpay payment signature cryptographically:
 * HMAC_SHA256(order_id + "|" + razorpay_payment_id, secret)
 */
export function verifyRazorpayPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret || secret.includes('dummy') || secret.includes('luxurydemo')) {
    // For test simulation when keys are test placeholders
    return Boolean(params.razorpayPaymentId && params.razorpayOrderId);
  }

  const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === params.razorpaySignature;
}

/**
 * Verifies Razorpay Webhook signature:
 * HMAC_SHA256(raw_body, webhook_secret)
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}
