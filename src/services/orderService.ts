import { isSupabaseConfigured, createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mockStore } from '@/lib/supabase/mockStore';
import { Order, OrderStatus, ShippingAddressInput } from '@/types/database';
import { getProductById } from './productService';
import { sendOrderConfirmationEmail } from '@/lib/email/resend';

export async function createValidatedOrder(params: {
  userId?: string | null;
  items: { productId: string; variantId?: string | null; quantity: number }[];
  shippingAddress: ShippingAddressInput;
  couponCode?: string | null;
  paymentMethod: 'razorpay' | 'cod';
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
}): Promise<Order> {
  let subtotalInPaise = 0;
  const orderItems = [];

  // Calculate prices strictly server-side to prevent tampering
  for (const item of params.items) {
    const product = await getProductById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const unitPrice = product.price_in_paise;
    const itemTotal = unitPrice * item.quantity;
    subtotalInPaise += itemTotal;

    orderItems.push({
      id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      order_id: '',
      product_id: product.id,
      variant_id: item.variantId || null,
      product_name: product.name,
      product_image: product.primary_image_url,
      variant_name: null,
      quantity: item.quantity,
      unit_price_in_paise: unitPrice,
      total_price_in_paise: itemTotal,
      created_at: new Date().toISOString(),
    });
  }

  // Calculate discount server-side
  let discountInPaise = 0;
  if (params.couponCode) {
    const coupon = mockStore.getCoupon(params.couponCode);
    if (coupon && coupon.is_active && subtotalInPaise >= coupon.minimum_order_in_paise) {
      if (coupon.discount_type === 'percentage') {
        const calculated = Math.round((subtotalInPaise * coupon.discount_value) / 100);
        discountInPaise = coupon.max_discount_in_paise ? Math.min(calculated, coupon.max_discount_in_paise) : calculated;
      } else {
        discountInPaise = coupon.discount_value;
      }
    }
  }

  // Free shipping above ₹4,999 (499900 paise)
  const settings = mockStore.getSiteSettings();
  const freeThreshold = settings.free_shipping_threshold_paise || 499900;
  const shippingInPaise = subtotalInPaise >= freeThreshold ? 0 : settings.flat_shipping_rate_paise || 49900;
  const totalInPaise = Math.max(0, subtotalInPaise - discountInPaise + shippingInPaise);

  const orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'> = {
    user_id: params.userId || null,
    customer_name: params.shippingAddress.fullName || params.shippingAddress.full_name || 'Client',
    customer_email: params.shippingAddress.email,
    customer_phone: params.shippingAddress.phone,
    shipping_address: params.shippingAddress,
    delivery_instructions: params.shippingAddress.deliveryInstructions || params.shippingAddress.delivery_instructions || null,
    subtotal_in_paise: subtotalInPaise,
    discount_in_paise: discountInPaise,
    coupon_code: params.couponCode || null,
    shipping_in_paise: shippingInPaise,
    total_in_paise: totalInPaise,
    status: params.paymentMethod === 'cod' ? 'confirmed' : 'pending',
    payment_status: params.paymentMethod === 'cod' ? 'pending' : (params.razorpayPaymentId ? 'paid' : 'pending'),
    payment_method: params.paymentMethod,
    razorpay_order_id: params.razorpayOrderId || null,
    razorpay_payment_id: params.razorpayPaymentId || null,
    items: orderItems,
  };

  let savedOrder: Order;

  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const randomHex = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `TFW-2026-${randomHex}`;

      const { data, error } = await adminClient
        .from('orders')
        .insert([{ ...orderData, order_number: orderNumber }])
        .select()
        .single();

      if (!error && data) {
        savedOrder = data as Order;
        // Insert items
        const itemsWithOrderId = orderItems.map((it) => ({ ...it, order_id: savedOrder.id }));
        await adminClient.from('order_items').insert(itemsWithOrderId);
      } else {
        savedOrder = mockStore.createOrder(orderData);
      }
    } catch {
      savedOrder = mockStore.createOrder(orderData);
    }
  } else {
    savedOrder = mockStore.createOrder(orderData);
  }

  // Trigger transactional email
  try {
    await sendOrderConfirmationEmail(savedOrder);
  } catch (emailErr) {
    console.warn('Could not dispatch confirmation email:', emailErr);
  }

  return savedOrder;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .or(`id.eq.${id},order_number.eq.${id}`)
        .single();

      if (!error && data) return data as Order;
    } catch {
      // Fallback
    }
  }

  const found = mockStore.getOrderById(id);
  return found || null;
}

export async function getAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) return data as Order[];
    } catch {
      // Fallback
    }
  }

  return mockStore.getOrders();
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string, courierPartner?: string): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (trackingNumber) updates.tracking_number = trackingNumber;
      if (courierPartner) updates.courier_partner = courierPartner;

      const { data, error } = await adminClient
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select('*, items:order_items(*)')
        .single();

      if (!error && data) return data as Order;
    } catch {
      // Fallback
    }
  }

  return mockStore.updateOrderStatus(orderId, status, trackingNumber, courierPartner);
}
