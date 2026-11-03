'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '@/types/database';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('tfw:open-search', handleOpen);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('tfw:open-search', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const quickTags = ['Chandeliers', 'Wall Lights', 'Pendants', 'Travertine', 'Brushed Brass', 'Ceiling Fans'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="min-h-screen px-4 text-center flex items-start justify-center pt-20 sm:pt-28">
        <div className="relative bg-[#F6F3ED] w-full max-w-3xl rounded-sm shadow-2xl p-6 sm:p-8 text-left border border-[#EAE3D8] z-10 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#EAE3D8]">
            <div className="flex items-center gap-3 flex-1">
              <Search className="w-5 h-5 text-[#B69A69]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search luxury lighting, chandeliers, furniture, materials..."
                className="w-full bg-transparent text-lg sm:text-xl font-serif text-[#151515] placeholder-[#999] focus:outline-none"
              />
              {loading && <Loader2 className="w-5 h-5 text-[#B69A69] animate-spin" />}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 text-[#78746D] hover:text-[#151515] transition"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions */}
          {!query && (
            <div className="py-8">
              <p className="text-xs uppercase tracking-widest text-[#B69A69] font-medium mb-3">Popular Inquiries</p>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 bg-[#EAE3D8] hover:bg-[#B69A69] hover:text-[#151515] text-[#242321] text-xs transition rounded-sm font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="py-6 max-h-[60vh] overflow-y-auto space-y-4">
              {results.length === 0 && !loading ? (
                <div className="text-center py-12 text-[#78746D]">
                  <p className="font-serif text-lg text-[#151515]">No pieces matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs mt-1">Try exploring by category or contact our studio for custom commissions.</p>
                </div>
              ) : (
                results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 p-3 hover:bg-[#EAE3D8]/60 transition rounded-sm border border-transparent hover:border-[#D9CFC0]"
                  >
                    <div className="w-16 h-20 bg-[#EAE3D8] rounded-sm overflow-hidden flex-shrink-0">
                      <img
                        src={product.primary_image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#B69A69]">{product.style || 'The Fifth Wall'}</p>
                      <h4 className="font-serif text-base text-[#151515] truncate font-medium">{product.name}</h4>
                      <p className="text-xs text-[#78746D] truncate mt-0.5">{product.finish} · {product.material}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-sm text-[#151515]">{formatINR(product.price_in_paise)}</span>
                      <div className="flex items-center justify-end text-xs text-[#B69A69] mt-1 gap-1">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
