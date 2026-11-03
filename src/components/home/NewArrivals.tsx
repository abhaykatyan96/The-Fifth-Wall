'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types/database';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // New arrivals or freshly added items
  const newArrivals = products.filter((p) => p.is_new_arrival).slice(0, 4);

  return (
    <section className="py-24 bg-[#F6F3ED] border-t border-[#EAE3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#EAE3D8] pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="section-kicker mb-0">05 / Latest Additions</span>
              <Sparkles className="w-3.5 h-3.5 text-[#B69A69]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light mt-1">
              New <em>Arrivals.</em>
            </h2>
          </div>

          <Link
            href="/shop?sort=newest"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#151515] hover:text-[#B69A69] transition mt-4 md:mt-0"
          >
            <span>View All Fresh Releases</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>

        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}
