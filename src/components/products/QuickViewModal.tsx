'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Heart, ShoppingBag, ArrowRight, ShieldCheck, Truck, Plus, Minus, Check } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatINR } from './ProductCard';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-10">
        <div className="relative bg-[#F6F3ED] w-full max-w-4xl rounded-sm shadow-2xl p-6 sm:p-10 text-left border border-[#EAE3D8] z-10 animate-fadeIn">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#78746D] hover:text-[#151515] transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Preview */}
            <div className="relative aspect-square bg-[#EAE3D8] rounded-sm overflow-hidden border border-[#D9CFC0]">
              <img
                src={product.primary_image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition ${
                  isWishlisted ? 'bg-[#B69A69] text-white' : 'bg-white/80 text-[#151515] hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Product Details */}
            <div className="space-y-5">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#B69A69] font-medium">
                  {product.style || 'The Fifth Wall Collection'}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#151515] font-normal mt-1">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-2xl font-serif text-[#151515]">
                    {formatINR(product.price_in_paise)}
                  </span>
                  {product.compare_at_price_in_paise && (
                    <span className="text-sm text-[#999] line-through">
                      {formatINR(product.compare_at_price_in_paise)}
                    </span>
                  )}
                  <span className="text-xs text-[#16a34a] font-medium ml-2">
                    Inclusive of all taxes
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-[#555] border-y border-[#EAE3D8] py-4">
                {product.short_description || product.description}
              </p>

              {/* Specs Brief */}
              <div className="grid grid-cols-2 gap-3 text-xs text-[#78746D]">
                <div>
                  <span className="text-[#151515] font-medium block">Material</span>
                  <span>{product.material || 'Solid Cast Brass & Optical Diffusers'}</span>
                </div>
                <div>
                  <span className="text-[#151515] font-medium block">Finish</span>
                  <span>{product.finish || 'Champagne Brass'}</span>
                </div>
                <div>
                  <span className="text-[#151515] font-medium block">Dimensions</span>
                  <span>{product.dimensions || 'Custom architectural scaling'}</span>
                </div>
                <div>
                  <span className="text-[#151515] font-medium block">Warranty</span>
                  <span>2 Years Comprehensive Guarantee</span>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center border border-[#D9CFC0] bg-white rounded-sm w-full sm:w-auto justify-between">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-[#555] hover:text-black transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-5 py-2 text-sm font-medium text-[#151515]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-[#555] hover:text-black transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 gold-button py-3.5 flex items-center justify-center gap-2"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EAE3D8] text-xs">
                <div className="flex items-center gap-2 text-[#78746D]">
                  <Truck className="w-4 h-4 text-[#B69A69]" />
                  <span>Pan-India White-Glove Dispatch</span>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-[#151515] font-medium hover:text-[#B69A69] flex items-center gap-1"
                >
                  <span>Full Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
