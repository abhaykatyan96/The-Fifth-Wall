'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '@/types/database';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

const STATUS_STEPS: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get('orderNumber') || '';

  const [orderQuery, setOrderQuery] = useState(initialNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
      } else {
        setError(json.error || 'No consignment found matching this order reference.');
        setOrder(null);
      }
    } catch {
      setError('Error communicating with order tracking system.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNumber) {
      fetchOrder(initialNumber);
    }
  }, [initialNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderQuery);
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'pending') return 0;
    const idx = STATUS_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] text-[#F5EEDB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="section-kicker">Consignment Status</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F5EEDB] font-light">
            Track Your <em className="italic text-[#E5C378]">Order.</em>
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9788] font-light leading-relaxed">
            Enter your order reference number (e.g. TFW-2026-XXXX) or order ID to view live transit milestones.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#141414] p-6 sm:p-8 rounded-sm border border-[#2E261B] shadow-2xl mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
                placeholder="Enter Order Number (e.g. TFW-2026-8910)"
                className="w-full bg-[#181818] border border-[#2E261B] text-xs px-4 py-3 uppercase text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gold-button py-3 px-6 text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Track'}</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-[#2A1215] text-[#F87171] text-xs rounded-sm flex items-center gap-2 border border-[#7F1D1D]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Order Timeline */}
        {order && (
          <div className="bg-[#141414] border border-[#2E261B] rounded-sm p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            {/* Header Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#2E261B] gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                  Reference: {order.order_number}
                </span>
                <h2 className="font-serif text-2xl text-[#F5EEDB] font-light mt-0.5">
                  Status: <span className="capitalize text-[#C5A059]">{order.status.replace('_', ' ')}</span>
                </h2>
                <p className="text-xs text-[#9E9788] mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              </div>

              {order.tracking_number && (
                <div className="bg-[#181818] p-3 rounded-sm border border-[#2E261B] text-right sm:text-left text-xs">
                  <span className="text-[#9E9788] block uppercase text-[10px]">Courier Partner</span>
                  <span className="font-medium text-[#F5EEDB]">{order.courier_partner || 'BlueDart Luxury Express'}</span>
                  <span className="text-[#C5A059] font-mono block mt-0.5">Waybill: {order.tracking_number}</span>
                </div>
              )}
            </div>

            {/* Stepper Timeline */}
            <div className="py-6">
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {['Confirmed', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered'].map((stepName, idx) => {
                  const currentIdx = getStepIndex(order.status);
                  const isDone = idx <= currentIdx && order.status !== 'cancelled';
                  return (
                    <div key={stepName} className="space-y-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition ${
                          isDone
                            ? 'bg-gradient-to-br from-[#C5A059] to-[#D4AF37] text-[#0A0A0A] font-bold shadow-md shadow-[#C5A059]/20'
                            : 'bg-[#181818] border border-[#2E261B] text-[#6E6759]'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <p className={`text-[11px] font-medium ${isDone ? 'text-[#C5A059]' : 'text-[#6E6759]'}`}>
                        {stepName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consignment Items */}
            <div className="border border-[#2E261B] rounded-sm divide-y divide-[#2E261B]">
              {order.items?.map((it) => (
                <div key={it.id} className="p-4 flex items-center justify-between text-xs bg-[#141414]">
                  <div className="flex items-center space-x-3">
                    <img src={it.product_image} alt={it.product_name} className="w-12 h-14 object-cover rounded-sm border border-[#2E261B]" />
                    <div>
                      <h4 className="font-serif text-sm font-medium text-[#F5EEDB]">{it.product_name}</h4>
                      <p className="text-[#9E9788]">Quantity: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-[#F5EEDB]">{formatINR(it.total_price_in_paise)}</span>
                </div>
              ))}
            </div>

            {/* Total and Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#2E261B] text-xs">
              <div className="bg-[#181818] p-4 rounded-sm border border-[#2E261B] space-y-1">
                <span className="font-medium uppercase tracking-wider text-[#F5EEDB] block mb-1">
                  Delivery Destination
                </span>
                <p className="text-[#F5EEDB] font-medium">{order.shipping_address.full_name || order.shipping_address.fullName}</p>
                <p className="text-[#9E9788]">{order.shipping_address.address_line1 || order.shipping_address.addressLine1}, {order.shipping_address.city}</p>
                <p className="text-[#9E9788]">{order.shipping_address.state} — {order.shipping_address.pincode}</p>
              </div>

              <div className="bg-[#181818] p-4 rounded-sm border border-[#2E261B] space-y-2">
                <span className="font-medium uppercase tracking-wider text-[#F5EEDB] block mb-1">
                  Billing Overview
                </span>
                <div className="flex justify-between text-[#9E9788]">
                  <span>Subtotal:</span>
                  <span className="text-[#F5EEDB]">{formatINR(order.subtotal_in_paise)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-medium text-[#F5EEDB] pt-1 border-t border-[#2E261B]">
                  <span>Total Amount:</span>
                  <span className="text-[#C5A059]">{formatINR(order.total_in_paise)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs text-[#9E9788] bg-[#0A0A0A] min-h-screen">Loading Consignment Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
