'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Loader2 } from 'lucide-react';
import { Product, Category } from '@/types/database';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSort, setSelectedSort] = useState<string>(initialSort);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Load categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (json.success) setCategories(json.data);
      } catch {}
    }
    loadCategories();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedSort) params.set('sort', selectedSort);
        if (searchQuery) params.set('search', searchQuery);

        if (priceRange === 'under_15000') {
          params.set('maxPrice', '15000');
        } else if (priceRange === '15000_30000') {
          params.set('minPrice', '15000');
          params.set('maxPrice', '30000');
        } else if (priceRange === 'above_30000') {
          params.set('minPrice', '30000');
        }

        if (selectedFinish !== 'all') params.set('finish', selectedFinish);
        if (selectedStyle !== 'all') params.set('style', selectedStyle);

        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredProducts();
  }, [selectedCategory, selectedSort, searchQuery, priceRange, selectedFinish, selectedStyle]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSort('newest');
    setSearchQuery('');
    setPriceRange('all');
    setSelectedFinish('all');
    setSelectedStyle('all');
  };

  const hasActiveFilters = Boolean(
    selectedCategory || priceRange !== 'all' || selectedFinish !== 'all' || selectedStyle !== 'all' || searchQuery
  );

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen text-[#F5EEDB]">
      {/* Header Banner */}
      <div className="bg-[#060606] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12 border-b border-[#2E261B]">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold block">
            The Complete Portfolio
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F5EEDB]">
            Catalogue & Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9788] max-w-xl mx-auto font-light leading-relaxed">
            Sculptural illumination, statement chandeliers, architectural wall sconces, and refined furniture curated for Indian and international luxury homes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#2E261B] gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden gold-button-outline py-2 px-4 text-xs flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <p className="text-xs text-[#9E9788]">
              Showing <strong className="text-[#F5EEDB]">{products.length}</strong> architectural pieces
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#9E9788] hidden sm:inline">Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-[#141414] border border-[#2E261B] text-xs px-3 py-2 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
            >
              <option value="newest" className="bg-[#141414] text-[#F5EEDB]">Newest Additions</option>
              <option value="price_asc" className="bg-[#141414] text-[#F5EEDB]">Price: Low to High</option>
              <option value="price_desc" className="bg-[#141414] text-[#F5EEDB]">Price: High to Low</option>
              <option value="popularity" className="bg-[#141414] text-[#F5EEDB]">Bestsellers First</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
            <span className="text-xs text-[#9E9788]">Active Filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 bg-[#1A1812] border border-[#2E261B] text-[#F5EEDB] text-xs px-3 py-1 rounded-sm">
                Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <X className="w-3 h-3 cursor-pointer text-[#C5A059]" onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#1A1812] border border-[#2E261B] text-[#F5EEDB] text-xs px-3 py-1 rounded-sm">
                Price: {priceRange === 'under_15000' ? 'Under ₹15,000' : priceRange === '15000_30000' ? '₹15,000 – ₹30,000' : 'Above ₹30,000'}
                <X className="w-3 h-3 cursor-pointer text-[#C5A059]" onClick={() => setPriceRange('all')} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-[#1A1812] border border-[#2E261B] text-[#F5EEDB] text-xs px-3 py-1 rounded-sm">
                Search: &ldquo;{searchQuery}&rdquo;
                <X className="w-3 h-3 cursor-pointer text-[#C5A059]" onClick={() => setSearchQuery('')} />
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-[#f87171] hover:underline ml-2 uppercase tracking-wider font-semibold"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-4 border-r border-[#2E261B]">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EEDB] mb-4 border-l-2 border-[#C5A059] pl-2.5">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs text-[#9E9788]">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left py-1 hover:text-[#C5A059] transition ${
                    selectedCategory === '' ? 'text-[#C5A059] font-bold' : ''
                  }`}
                >
                  All Collections
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`block w-full text-left py-1 hover:text-[#C5A059] transition ${
                      selectedCategory === c.slug ? 'text-[#C5A059] font-bold' : ''
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EEDB] mb-4 border-l-2 border-[#C5A059] pl-2.5">
                Price (INR)
              </h3>
              <div className="space-y-2 text-xs text-[#9E9788]">
                {[
                  { id: 'all', label: 'All Price Tiers' },
                  { id: 'under_15000', label: 'Under ₹15,000' },
                  { id: '15000_30000', label: '₹15,000 – ₹30,000' },
                  { id: 'above_30000', label: 'Above ₹30,000' },
                ].map((tier) => (
                  <label key={tier.id} className="flex items-center gap-2 cursor-pointer hover:text-[#F5EEDB]">
                    <input
                      type="radio"
                      name="priceTier"
                      checked={priceRange === tier.id}
                      onChange={() => setPriceRange(tier.id)}
                      className="accent-[#C5A059]"
                    />
                    <span>{tier.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Material & Finish */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EEDB] mb-4 border-l-2 border-[#C5A059] pl-2.5">
                Finish & Material
              </h3>
              <div className="space-y-1.5 text-xs text-[#9E9788]">
                {['all', 'Brass', 'Bronze', 'Travertine', 'Crystal', 'Walnut', 'Noir'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFinish(f)}
                    className={`block w-full text-left py-1 hover:text-[#C5A059] transition capitalize ${
                      selectedFinish === f ? 'text-[#C5A059] font-bold' : ''
                    }`}
                  >
                    {f === 'all' ? 'All Finishes' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Box */}
            <div className="bg-[#141414] p-5 rounded-sm border border-[#2E261B] text-xs space-y-2">
              <span className="font-serif text-sm text-[#F5EEDB] block">Bespoke Commissions</span>
              <p className="text-[#9E9788] leading-relaxed">
                Need customized dimensions or custom plating? Contact our Lucknow design studio.
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-28 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
                <p className="text-xs tracking-wider uppercase text-[#9E9788]">Loading Architectural Portfolio...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center bg-[#141414] border border-[#2E261B] rounded-sm p-12 space-y-4">
                <h3 className="font-serif text-2xl text-[#F5EEDB]">No Pieces Found</h3>
                <p className="text-xs text-[#9E9788] max-w-sm mx-auto">
                  We could not find any illumination pieces matching your selected filter parameters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="gold-button inline-flex py-3 px-6 text-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] pt-32 text-center text-xs text-[#9E9788]">Loading Catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
