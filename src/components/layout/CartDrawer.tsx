'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeItem,
    updateQuantity,
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

  if (!isCartDrawerOpen) return null;

  // Free shipping threshold is ₹4,999 (499900 paise)
  const freeThreshold = 499900;
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F6F3ED] text-[#242321] shadow-2xl flex flex-col border-l border-[#EAE3D8]">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE3D8] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-[#B69A69]" />
              <h2 className="font-serif text-xl uppercase tracking-wider text-[#151515]">Shopping Bag</h2>
              <span className="text-xs text-[#8E7444] font-medium">({items.reduce((a, b) => a + b.quantity, 0)})</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-[#78746D] hover:text-[#151515] transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Meter */}
          <div className="bg-[#EAE3D8]/50 px-6 py-3 border-b border-[#EAE3D8] text-xs">
            {differenceToFree === 0 ? (
              <div className="flex items-center gap-2 text-[#15803d] font-medium">
                <Sparkles className="w-4 h-4" />
                <span>You unlocked complimentary white-glove shipping across India!</span>
              </div>
            ) : (
              <div>
                <p className="text-[#555]">
                  Add <strong className="text-[#151515]">{formatINR(differenceToFree)}</strong> more to qualify for complimentary shipping.
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

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EAE3D8] flex items-center justify-center mx-auto text-[#B69A69]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl text-[#151515]">Your Bag is Empty</h3>
                <p className="text-xs text-[#78746D] max-w-xs mx-auto">
                  Discover thoughtfully curated illumination pieces that bring character and warmth to your home.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="gold-button inline-flex mt-4"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((entry) => {
                const price = entry.variant ? entry.variant.price_in_paise : entry.product.price_in_paise;
                return (
                  <div
                    key={`${entry.product.id}-${entry.variant?.id || 'standard'}`}
                    className="flex space-x-4 pb-6 border-b border-[#EAE3D8] last:border-0"
                  >
                    <div className="relative w-20 h-24 bg-[#EAE3D8] flex-shrink-0 rounded-sm overflow-hidden border border-[#D9CFC0]">
                      <img
                        src={entry.product.primary_image_url}
                        alt={entry.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/products/${entry.product.slug}`}
                            onClick={() => setIsCartDrawerOpen(false)}
                            className="font-serif text-base text-[#151515] hover:text-[#B69A69] transition font-normal"
                          >
                            {entry.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(entry.product.id, entry.variant?.id)}
                            className="text-[#999] hover:text-[#b91c1c] transition p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {entry.variant && (
                          <p className="text-[11px] text-[#78746D] mt-0.5">{entry.variant.name}</p>
                        )}

                        <p className="text-xs font-semibold text-[#151515] mt-1">
                          {formatINR(price * entry.quantity)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3 mt-3">
                        <div className="flex items-center border border-[#D9CFC0] bg-white rounded-sm">
                          <button
                            type="button"
                            onClick={() => updateQuantity(entry.product.id, entry.quantity - 1, entry.variant?.id)}
                            className="px-2 py-1 text-[#555] hover:text-black transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-xs font-medium text-[#151515]">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(entry.product.id, entry.quantity + 1, entry.variant?.id)}
                            className="px-2 py-1 text-[#555] hover:text-black transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#EAE3D8] space-y-4">
              {/* Coupon Form */}
              <div className="space-y-1">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-[#F6F3ED] border border-[#B69A69] px-3 py-2 rounded-sm text-xs">
                    <div className="flex items-center gap-1.5 text-[#151515]">
                      <Tag className="w-3.5 h-3.5 text-[#B69A69]" />
                      <span>Applied: <strong>{couponCode}</strong> (-{formatINR(discountInPaise)})</span>
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
                      placeholder="Promo code (e.g. WELCOME10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3 py-2 uppercase placeholder:normal-case focus:outline-none focus:border-[#B69A69]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 bg-[#242321] text-[#F6F3ED] text-xs uppercase tracking-wider hover:bg-[#B69A69] hover:text-[#151515] transition"
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

              {/* Order Calculation */}
              <div className="space-y-1.5 text-xs text-[#78746D]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#151515]">{formatINR(subtotalInPaise)}</span>
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
                <div className="flex justify-between pt-2 border-t border-[#EAE3D8] text-base font-semibold text-[#151515]">
                  <span className="font-serif">Total</span>
                  <span className="text-[#B69A69]">{formatINR(totalInPaise)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full gold-button py-3 text-center flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="block text-center text-xs text-[#78746D] hover:text-[#151515] underline pt-1"
                >
                  View Full Cart Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
