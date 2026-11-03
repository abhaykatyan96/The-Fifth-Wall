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
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#151515] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B69A69] font-medium block">
            The Complete Portfolio
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light">
            Catalogue & Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#D9CFC0] max-w-xl mx-auto font-light leading-relaxed">
            Sculptural illumination, statement chandeliers, architectural wall sconces, and refined furniture curated for Indian and international luxury homes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EAE3D8] gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden gold-button-outline py-2 px-4 text-xs flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <p className="text-xs text-[#78746D]">
              Showing <strong className="text-[#151515]">{products.length}</strong> architectural pieces
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#78746D] hidden sm:inline">Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-white border border-[#D9CFC0] text-xs px-3 py-2 text-[#151515] rounded-sm focus:outline-none focus:border-[#B69A69]"
            >
              <option value="newest">Newest Additions</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Bestsellers First</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
            <span className="text-xs text-[#78746D]">Active Filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 bg-[#EAE3D8] text-[#151515] text-xs px-3 py-1 rounded-sm">
                Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#EAE3D8] text-[#151515] text-xs px-3 py-1 rounded-sm">
                Price: {priceRange === 'under_15000' ? 'Under ₹15,000' : priceRange === '15000_30000' ? '₹15,000 – ₹30,000' : 'Above ₹30,000'}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange('all')} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-[#EAE3D8] text-[#151515] text-xs px-3 py-1 rounded-sm">
                Search: &ldquo;{searchQuery}&rdquo;
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-[#b91c1c] hover:underline ml-2 uppercase tracking-wider font-semibold"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-4 border-r border-[#EAE3D8]">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#151515] mb-4 border-l-2 border-[#B69A69] pl-2.5">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs text-[#555]">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left py-1 hover:text-[#B69A69] transition ${
                    selectedCategory === '' ? 'text-[#B69A69] font-bold' : ''
                  }`}
                >
                  All Collections
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`block w-full text-left py-1 hover:text-[#B69A69] transition ${
                      selectedCategory === c.slug ? 'text-[#B69A69] font-bold' : ''
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#151515] mb-4 border-l-2 border-[#B69A69] pl-2.5">
                Price (INR)
              </h3>
              <div className="space-y-2 text-xs text-[#555]">
                {[
                  { id: 'all', label: 'All Price Tiers' },
                  { id: 'under_15000', label: 'Under ₹15,000' },
                  { id: '15000_30000', label: '₹15,000 – ₹30,000' },
                  { id: 'above_30000', label: 'Above ₹30,000' },
                ].map((tier) => (
                  <label key={tier.id} className="flex items-center gap-2 cursor-pointer hover:text-[#151515]">
                    <input
                      type="radio"
                      name="priceTier"
                      checked={priceRange === tier.id}
                      onChange={() => setPriceRange(tier.id)}
                      className="accent-[#B69A69]"
                    />
                    <span>{tier.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Material & Finish */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#151515] mb-4 border-l-2 border-[#B69A69] pl-2.5">
                Finish & Material
              </h3>
              <div className="space-y-1.5 text-xs text-[#555]">
                {['all', 'Brass', 'Bronze', 'Travertine', 'Crystal', 'Walnut', 'Noir'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFinish(f)}
                    className={`block w-full text-left py-1 hover:text-[#B69A69] transition capitalize ${
                      selectedFinish === f ? 'text-[#B69A69] font-bold' : ''
                    }`}
                  >
                    {f === 'all' ? 'All Finishes' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Box */}
            <div className="bg-[#EAE3D8] p-5 rounded-sm border border-[#D9CFC0] text-xs space-y-2">
              <span className="font-serif text-sm text-[#151515] block">Bespoke Commissions</span>
              <p className="text-[#666] leading-relaxed">
                Need customized dimensions or custom plating? Contact our Lucknow design studio.
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-28 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#B69A69] animate-spin" />
                <p className="text-xs tracking-wider uppercase text-[#78746D]">Loading Architectural Portfolio...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center bg-white border border-[#EAE3D8] rounded-sm p-12 space-y-4">
                <h3 className="font-serif text-2xl text-[#151515]">No Pieces Found</h3>
                <p className="text-xs text-[#78746D] max-w-sm mx-auto">
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
    <Suspense fallback={<div className="min-h-screen bg-[#F6F3ED] pt-32 text-center text-xs text-[#78746D]">Loading Catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
