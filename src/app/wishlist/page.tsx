'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/products/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen text-[#F5EEDB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 border-b border-[#2E261B] mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="section-kicker">Curated Favorites</span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F5EEDB] font-light mt-1">
              Your <em className="text-[#C5A059]">Wishlist.</em>
            </h1>
          </div>
          <p className="text-xs text-[#9E9788]">
            Saved pieces: <strong className="text-[#F5EEDB]">{items.length}</strong>
          </p>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-[#141414] border border-[#2E261B] rounded-sm p-12 space-y-4 max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#2E261B] flex items-center justify-center mx-auto text-[#C5A059]">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl text-[#F5EEDB]">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#9E9788] max-w-sm mx-auto leading-relaxed">
              Curate your dream residence by saving statement chandeliers, sculpted luminaires, and furniture pieces.
            </p>
            <div className="pt-4">
              <Link href="/shop" className="gold-button inline-flex py-3.5 px-8 text-xs tracking-[0.2em]">
                <span>Discover Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
