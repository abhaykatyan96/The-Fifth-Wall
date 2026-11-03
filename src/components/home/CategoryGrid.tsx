'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/database';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-24 bg-[#F6F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#EAE3D8] pb-8">
          <div>
            <span className="section-kicker">01 / Curated Collections</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light mt-1">
              Top <em>Collections.</em>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#78746D] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            From sculptural chandeliers to ambient wall luminaires and considered furniture pieces, explore atmospheres designed to elevate every angle of your home.
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className={`group relative overflow-hidden bg-[#EAE3D8] border border-[#EAE3D8] hover:border-[#B69A69] transition-all duration-500 rounded-sm ${
                idx === 0 || idx === 6 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
              }`}
            >
              <img
                src={cat.image_url || 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1200&q=85'}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:from-black/90" />

              {/* Text Info */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between z-10 text-white">
                <div className="space-y-1.5 max-w-sm">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4C39E] font-medium block">
                    The Fifth Wall Collection
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#D9CFC0] line-clamp-2 font-light">
                    {cat.description}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white group-hover:bg-[#B69A69] group-hover:border-[#B69A69] group-hover:text-[#151515] transition flex-shrink-0 ml-4">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
