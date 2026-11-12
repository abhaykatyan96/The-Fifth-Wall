'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '@/types/database';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';

interface BestsellerCarouselProps {
  products: Product[];
}

export default function BestsellerCarousel({ products }: BestsellerCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const bestsellers = products.filter((p) => p.is_bestseller);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#0D0D0D] border-t border-[#2E261B] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 border-b border-[#2E261B] pb-6">
          <div>
            <span className="section-kicker">04 / Permanent Classics</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F5EEDB] font-light mt-1">
              Bestsellers <em className="text-[#C5A059]">Carousel.</em>
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-11 h-11 rounded-full border border-[#2E261B] bg-[#141414] text-[#C5A059] hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0A0A] flex items-center justify-center transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full border border-[#2E261B] bg-[#141414] text-[#C5A059] hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0A0A] flex items-center justify-center transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestsellers.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[320px] max-w-[320px] flex-shrink-0">
              <ProductCard
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#C5A059]"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}
