import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCategories } from '@/services/categoryService';
import { getProducts } from '@/services/productService';
import ProductCard from '@/components/products/ProductCard';

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export const instant = false;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      {/* Editorial Header Banner */}
      <div className="relative bg-[#151515] text-white py-20 px-4 sm:px-6 lg:px-8 mb-12 overflow-hidden">
        {category.image_url && (
          <div className="absolute inset-0 opacity-30">
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <nav className="text-[11px] uppercase tracking-widest text-[#B69A69] space-x-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:underline">Collections</Link>
            <span>/</span>
            <span className="text-[#D9CFC0]">{category.name}</span>
          </nav>

          <h1 className="font-serif text-4xl sm:text-6xl font-light">
            {category.name}
          </h1>

          <p className="text-xs sm:text-sm text-[#D9CFC0] max-w-xl mx-auto font-light leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-[#EAE3D8] mb-8">
          <p className="text-xs text-[#78746D]">
            Curated pieces: <strong className="text-[#151515]">{products.length}</strong>
          </p>

          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.15em] text-[#B69A69] hover:underline font-medium"
          >
            ← View All Collections
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center bg-white border border-[#EAE3D8] rounded-sm p-12 space-y-4">
            <h3 className="font-serif text-2xl text-[#151515]">Collection in Production</h3>
            <p className="text-xs text-[#78746D] max-w-sm mx-auto">
              Our artisanal workshops are completing handcrafted pieces for this category. Contact us for custom commissions.
            </p>
            <Link href="/contact" className="gold-button inline-flex py-3 px-6 text-xs">
              Inquire With Studio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
