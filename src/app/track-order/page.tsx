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
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="section-kicker">Consignment Status</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light">
            Track Your <em>Order.</em>
          </h1>
          <p className="text-xs sm:text-sm text-[#78746D] font-light leading-relaxed">
            Enter your order reference number (e.g. TFW-2026-XXXX) or order ID to view live transit milestones.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#EAE3D8] shadow-sm mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
                placeholder="Enter Order Number (e.g. TFW-2026-8910)"
                className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-4 py-3 uppercase focus:outline-none focus:border-[#B69A69] rounded-sm font-mono"
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
            <div className="mt-4 p-3 bg-[#fef2f2] text-[#b91c1c] text-xs rounded-sm flex items-center gap-2 border border-[#fecaca]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Order Timeline */}
        {order && (
          <div className="bg-white border border-[#EAE3D8] rounded-sm p-6 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
            {/* Header Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE3D8] gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B69A69] font-medium block">
                  Reference: {order.order_number}
                </span>
                <h2 className="font-serif text-2xl text-[#151515] font-light mt-0.5">
                  Status: <span className="capitalize text-[#B69A69]">{order.status.replace('_', ' ')}</span>
                </h2>
                <p className="text-xs text-[#78746D] mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              </div>

              {order.tracking_number && (
                <div className="bg-[#F6F3ED] p-3 rounded-sm border border-[#D9CFC0] text-right sm:text-left text-xs">
                  <span className="text-[#78746D] block uppercase text-[10px]">Courier Partner</span>
                  <span className="font-medium text-[#151515]">{order.courier_partner || 'BlueDart Luxury Express'}</span>
                  <span className="text-[#B69A69] font-mono block mt-0.5">Waybill: {order.tracking_number}</span>
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
                            ? 'bg-[#B69A69] text-white shadow-md'
                            : 'bg-[#EAE3D8] text-[#999]'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <p className={`text-[11px] font-medium ${isDone ? 'text-[#151515]' : 'text-[#999]'}`}>
                        {stepName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consignment Items */}
            <div className="border border-[#EAE3D8] rounded-sm divide-y divide-[#EAE3D8]">
              {order.items?.map((it) => (
                <div key={it.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={it.product_image} alt={it.product_name} className="w-12 h-14 object-cover rounded-sm border border-[#D9CFC0]" />
                    <div>
                      <h4 className="font-serif text-sm font-medium text-[#151515]">{it.product_name}</h4>
                      <p className="text-[#78746D]">Quantity: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-[#151515]">{formatINR(it.total_price_in_paise)}</span>
                </div>
              ))}
            </div>

            {/* Total and Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EAE3D8] text-xs">
              <div className="bg-[#F6F3ED] p-4 rounded-sm border border-[#D9CFC0] space-y-1">
                <span className="font-medium uppercase tracking-wider text-[#151515] block mb-1">
                  Delivery Destination
                </span>
                <p className="text-[#151515] font-medium">{order.shipping_address.full_name || order.shipping_address.fullName}</p>
                <p className="text-[#555]">{order.shipping_address.address_line1 || order.shipping_address.addressLine1}, {order.shipping_address.city}</p>
                <p className="text-[#555]">{order.shipping_address.state} — {order.shipping_address.pincode}</p>
              </div>

              <div className="bg-[#F6F3ED] p-4 rounded-sm border border-[#D9CFC0] space-y-2">
                <span className="font-medium uppercase tracking-wider text-[#151515] block mb-1">
                  Billing Overview
                </span>
                <div className="flex justify-between text-[#555]">
                  <span>Subtotal:</span>
                  <span>{formatINR(order.subtotal_in_paise)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-medium text-[#151515] pt-1 border-t border-[#D9CFC0]">
                  <span>Total Amount:</span>
                  <span className="text-[#B69A69]">{formatINR(order.total_in_paise)}</span>
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
    <Suspense fallback={<div className="pt-32 text-center text-xs text-[#78746D]">Loading Consignment Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
