'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotalInPaise,
    discountInPaise,
    shippingInPaise,
    totalInPaise,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const freeThreshold = 499900; // ₹4,999
  const differenceToFree = Math.max(0, freeThreshold - subtotalInPaise);
  const freeShippingProgress = Math.min(100, (subtotalInPaise / freeThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const res = await applyCoupon(inputCoupon.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCoupon('');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="pb-8 border-b border-[#EAE3D8] mb-10">
          <span className="section-kicker">Review Selected Pieces</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light mt-1">
            Shopping <em>Bag.</em>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-white border border-[#EAE3D8] rounded-sm p-12 space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F6F3ED] flex items-center justify-center mx-auto text-[#B69A69]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl text-[#151515]">Your Bag is Currently Empty</h2>
            <p className="text-xs text-[#78746D] max-w-sm mx-auto leading-relaxed">
              Explore thoughtfully curated lighting and interior pieces designed to bring character and warmth to your spaces.
            </p>
            <div className="pt-4">
              <Link href="/shop" className="gold-button inline-flex py-3.5 px-8 text-xs tracking-[0.2em]">
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping Notification Banner */}
              <div className="bg-[#EAE3D8] p-4 rounded-sm border border-[#D9CFC0] text-xs">
                {differenceToFree === 0 ? (
                  <div className="flex items-center gap-2 text-[#15803d] font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Complimentary white-glove shipping unlocked across India!</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-[#555]">
                      Add <strong className="text-[#151515]">{formatINR(differenceToFree)}</strong> more to your bag for complimentary white-glove shipping.
                    </p>
                    <div className="w-full bg-[#D9CFC0] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-[#B69A69] h-full transition-all duration-300"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items Card List */}
              <div className="bg-white border border-[#EAE3D8] rounded-sm divide-y divide-[#EAE3D8] shadow-sm">
                {items.map((entry) => {
                  const unitPrice = entry.variant ? entry.variant.price_in_paise : entry.product.price_in_paise;
                  return (
                    <div
                      key={`${entry.product.id}-${entry.variant?.id || 'std'}`}
                      className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-24 bg-[#EAE3D8] rounded-sm overflow-hidden flex-shrink-0 border border-[#D9CFC0]">
                          <img
                            src={entry.product.primary_image_url}
                            alt={entry.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#B69A69]">
                            {entry.product.style || 'The Fifth Wall'}
                          </span>
                          <h3 className="font-serif text-lg text-[#151515] font-medium">
                            <Link href={`/products/${entry.product.slug}`} className="hover:text-[#B69A69]">
                              {entry.product.name}
                            </Link>
                          </h3>
                          {entry.variant && (
                            <p className="text-xs text-[#78746D]">{entry.variant.name}</p>
                          )}
                          <p className="text-xs text-[#78746D] mt-1">
                            Unit Price: {formatINR(unitPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-[#D9CFC0] bg-white rounded-sm">
                          <button
                            type="button"
                            onClick={() => updateQuantity(entry.product.id, entry.quantity - 1, entry.variant?.id)}
                            className="px-2.5 py-1.5 text-[#555] hover:text-black transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-4 py-1.5 text-xs font-medium text-[#151515]">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(entry.product.id, entry.quantity + 1, entry.variant?.id)}
                            className="px-2.5 py-1.5 text-[#555] hover:text-black transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right min-w-[100px]">
                          <span className="font-medium text-base text-[#151515]">
                            {formatINR(unitPrice * entry.quantity)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(entry.product.id, entry.variant?.id)}
                          className="text-[#999] hover:text-[#b91c1c] transition p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link href="/shop" className="text-xs uppercase tracking-widest text-[#B69A69] hover:underline font-medium">
                  ← Continue Shopping
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-[#78746D] hover:text-[#b91c1c] uppercase tracking-wider"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Right: Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#EAE3D8] rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-xl text-[#151515] border-b border-[#EAE3D8] pb-4">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <div className="space-y-2">
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-[#F6F3ED] border border-[#B69A69] p-3 rounded-sm text-xs">
                      <div className="flex items-center gap-2 text-[#151515]">
                        <Tag className="w-4 h-4 text-[#B69A69]" />
                        <span>Code: <strong>{couponCode}</strong> (-{formatINR(discountInPaise)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-[#999] hover:text-[#b91c1c] uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3 py-2.5 uppercase focus:outline-none focus:border-[#B69A69]"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading}
                        className="px-4 bg-[#242321] text-white text-xs uppercase tracking-wider hover:bg-[#B69A69] hover:text-[#151515] transition"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-[#b91c1c]">{couponError}</p>}
                  {couponMessage && !couponError && (
                    <p className="text-[11px] text-[#15803d]">{couponMessage}</p>
                  )}
                </div>

                {/* Line Items */}
                <div className="space-y-3 text-xs text-[#555] border-t border-[#EAE3D8] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#151515] font-medium">{formatINR(subtotalInPaise)}</span>
                  </div>
                  {discountInPaise > 0 && (
                    <div className="flex justify-between text-[#15803d]">
                      <span>Promotional Discount</span>
                      <span>-{formatINR(discountInPaise)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>White-Glove Shipping</span>
                    <span className="text-[#151515]">
                      {shippingInPaise === 0 ? 'Complimentary' : formatINR(shippingInPaise)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#EAE3D8] text-lg font-serif font-medium text-[#151515]">
                    <span>Total Amount</span>
                    <span className="text-[#B69A69]">{formatINR(totalInPaise)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full gold-button py-4 text-center flex items-center justify-center gap-2 text-xs"
                >
                  <span>Proceed to Multi-Step Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-2 pt-2 text-[11px] text-[#78746D]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#B69A69]" />
                    <span>Inspected crated packaging for chandeliers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B69A69]" />
                    <span>2-Year Warranty on electrical components</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
