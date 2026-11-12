import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Package, Truck, ArrowRight, Printer } from 'lucide-react';
import { getOrderById } from '@/services/orderService';

export const instant = false;

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] text-[#F5EEDB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141414] border border-[#2E261B] rounded-sm p-8 sm:p-12 shadow-2xl text-center space-y-8">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-[#1A1812] border border-[#2E261B] text-[#C5A059] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
              Payment & Order Verified
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F5EEDB] font-light">
              Thank You, {order.customer_name}.
            </h1>
            <p className="text-xs sm:text-sm text-[#9E9788] max-w-md mx-auto leading-relaxed">
              Your bespoke pieces are currently being inspected and prepared for white-glove transit from our Lucknow studio.
            </p>
          </div>

          {/* Key Reference Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#181818] p-6 rounded-sm border border-[#2E261B] text-left text-xs">
            <div>
              <span className="text-[#9E9788] block uppercase tracking-wider text-[10px]">Order Number</span>
              <span className="font-mono font-bold text-sm text-[#F5EEDB]">{order.order_number}</span>
            </div>
            <div>
              <span className="text-[#9E9788] block uppercase tracking-wider text-[10px]">Payment Status</span>
              <span className="font-semibold text-sm text-[#34D399] uppercase">
                {order.payment_method.toUpperCase()} ({order.payment_status.toUpperCase()})
              </span>
            </div>
            <div>
              <span className="text-[#9E9788] block uppercase tracking-wider text-[10px]">Order Status</span>
              <span className="font-semibold text-sm text-[#C5A059] uppercase">
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="text-left border border-[#2E261B] rounded-sm overflow-hidden">
            <div className="bg-[#181818] px-6 py-3 border-b border-[#2E261B] text-xs font-semibold text-[#F5EEDB] uppercase tracking-wider">
              Purchased Architectural Illumination
            </div>
            <div className="divide-y divide-[#2E261B]">
              {order.items?.map((it) => (
                <div key={it.id} className="p-4 sm:p-6 flex items-center justify-between text-xs bg-[#141414]">
                  <div className="flex items-center space-x-4">
                    <img
                      src={it.product_image}
                      alt={it.product_name}
                      className="w-14 h-16 object-cover rounded-sm border border-[#2E261B]"
                    />
                    <div>
                      <h4 className="font-serif text-base text-[#F5EEDB] font-medium">{it.product_name}</h4>
                      {it.variant_name && <p className="text-[#9E9788]">{it.variant_name}</p>}
                      <p className="text-[#9E9788] mt-0.5">Quantity: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-sm text-[#F5EEDB]">
                    {formatINR(it.total_price_in_paise)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-[#101010] p-6 space-y-2 text-xs text-[#9E9788] border-t border-[#2E261B]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#F5EEDB]">{formatINR(order.subtotal_in_paise)}</span>
              </div>
              {order.discount_in_paise > 0 && (
                <div className="flex justify-between text-[#34D399]">
                  <span>Discount ({order.coupon_code || ''})</span>
                  <span>-{formatINR(order.discount_in_paise)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>White-Glove Shipping</span>
                <span className="text-[#C5A059]">{order.shipping_in_paise === 0 ? 'Complimentary' : formatINR(order.shipping_in_paise)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2E261B] text-base font-serif font-medium text-[#F5EEDB]">
                <span>Total Amount</span>
                <span className="text-[#C5A059]">{formatINR(order.total_in_paise)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="text-left bg-[#181818] p-6 rounded-sm border border-[#2E261B] text-xs space-y-1">
            <h4 className="font-medium text-sm text-[#F5EEDB] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>Consignment Destination</span>
            </h4>
            <p className="font-medium text-[#F5EEDB]">{order.shipping_address.full_name || order.shipping_address.fullName} ({order.shipping_address.phone})</p>
            <p className="text-[#9E9788]">{order.shipping_address.address_line1 || order.shipping_address.addressLine1}, {order.shipping_address.address_line2 || order.shipping_address.addressLine2 || ''}</p>
            <p className="text-[#9E9788]">{order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.pincode}</p>
            <p className="text-[#9E9788] pt-1">Email notification dispatched to: <strong className="text-[#F5EEDB]">{order.customer_email}</strong></p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/track-order?orderNumber=${order.order_number}`}
              className="gold-button py-3.5 px-8 text-xs tracking-[0.2em] flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Package className="w-4 h-4" />
              <span>Track Consignment</span>
            </Link>

            <Link
              href="/shop"
              className="gold-button-outline py-3.5 px-8 text-xs tracking-[0.2em] flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>Continue Exploring</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
