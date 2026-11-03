'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const discountPercent =
    product.compare_at_price_in_paise && product.compare_at_price_in_paise > product.price_in_paise
      ? Math.round(
          ((product.compare_at_price_in_paise - product.price_in_paise) / product.compare_at_price_in_paise) * 100
        )
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <article className="group relative flex flex-col bg-white border border-[#EAE3D8] hover:border-[#B69A69]/60 transition-all duration-300 rounded-sm overflow-hidden hover:shadow-xl">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#EAE3D8] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.primary_image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent && (
            <span className="bg-[#151515] text-[#F6F3ED] text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider border border-[#B69A69]/40">
              {discountPercent}% Off
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-[#B69A69] text-[#151515] text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider">
              Bestseller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-[#242321] text-[#D4C39E] text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-[#B69A69] text-white shadow-md'
              : 'bg-white/80 text-[#151515] hover:bg-white hover:text-[#B69A69]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Add to Cart Hover Tray */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              className="flex-1 bg-white/90 hover:bg-white text-[#151515] py-2.5 px-3 text-[11px] font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition rounded-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`flex-1 py-2.5 px-3 text-[11px] font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition rounded-sm ${
              product.stock_quantity === 0
                ? 'bg-[#444] text-[#999] cursor-not-allowed'
                : 'bg-[#B69A69] hover:bg-[#8E7444] text-[#151515] hover:text-white'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.stock_quantity === 0 ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#B69A69] font-medium block">
            {product.style || 'The Fifth Wall'}
          </span>
          <h3 className="font-serif text-lg text-[#151515] group-hover:text-[#B69A69] transition mt-1 font-normal line-clamp-1">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-[#78746D] line-clamp-1 mt-0.5">
            {product.finish || product.material}
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-4 pt-3 border-t border-[#EAE3D8] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-base text-[#151515]">
              {formatINR(product.price_in_paise)}
            </span>
            {product.compare_at_price_in_paise && (
              <span className="text-xs text-[#999] line-through">
                {formatINR(product.compare_at_price_in_paise)}
              </span>
            )}
          </div>

          <span
            className={`text-[10px] tracking-wider uppercase font-semibold ${
              product.stock_quantity > 0 ? 'text-[#16a34a]' : 'text-[#b91c1c]'
            }`}
          >
            {product.stock_quantity > 0 ? 'In Stock' : 'Pre-order'}
          </span>
        </div>
      </div>
    </article>
  );
}
