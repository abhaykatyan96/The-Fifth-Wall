import React from 'react';
import { getCategories } from '@/services/categoryService';
import { getProducts } from '@/services/productService';
import { mockStore } from '@/lib/supabase/mockStore';
import HeroSlideshow from '@/components/home/HeroSlideshow';
import TrustBar from '@/components/home/TrustBar';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import EditorialSection from '@/components/home/EditorialSection';
import ShopByRoom from '@/components/home/ShopByRoom';
import BestsellerCarousel from '@/components/home/BestsellerCarousel';
import NewArrivals from '@/components/home/NewArrivals';
import BrandStory from '@/components/home/BrandStory';
import DesignConsultationForm from '@/components/home/DesignConsultationForm';
import TestimonialSlider from '@/components/home/TestimonialSlider';



export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const heroSlides = mockStore.getHeroSlides();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlideshow slides={heroSlides} />
      <TrustBar />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} />
      <EditorialSection />
      <ShopByRoom />
      <BestsellerCarousel products={products} />
      <NewArrivals products={products} />
      <BrandStory />
      <DesignConsultationForm />
      <TestimonialSlider />
    </div>
  );
}
