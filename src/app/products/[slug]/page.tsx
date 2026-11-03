import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/services/productService';
import { mockStore } from '@/lib/supabase/mockStore';
import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found — THE FIFTH WALL',
    };
  }

  return {
    title: `${product.name} — Luxury Lighting | THE FIFTH WALL`,
    description: product.short_description || product.description,
    openGraph: {
      title: `${product.name} | THE FIFTH WALL`,
      description: product.short_description || product.description,
      images: [{ url: product.primary_image_url }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => p.id !== product.id && (product.category_id ? p.category_id === product.category_id : true))
    .slice(0, 4);

  const reviews = mockStore.getReviewsForProduct(product.id);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={related.length > 0 ? related : allProducts.filter((p) => p.id !== product.id).slice(0, 4)}
      initialReviews={reviews}
    />
  );
}
