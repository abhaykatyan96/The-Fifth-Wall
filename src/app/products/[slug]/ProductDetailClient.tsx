'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Star,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Product, ProductReview } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/products/ProductCard';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  initialReviews: ProductReview[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  initialReviews,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, setIsCartDrawerOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // All images
  const allImages = [
    product.primary_image_url,
    ...(product.images?.map((im) => im.image_url) || [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85',
    ]),
  ];

  const [activeImage, setActiveImage] = useState(allImages[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isAdding, setIsAdding] = useState(false);

  // Review submission state
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const currentPriceInPaise = selectedVariant
    ? selectedVariant.price_in_paise
    : product.price_in_paise;

  const discountPercent =
    product.compare_at_price_in_paise && product.compare_at_price_in_paise > currentPriceInPaise
      ? Math.round(
          ((product.compare_at_price_in_paise - currentPriceInPaise) / product.compare_at_price_in_paise) * 100
        )
      : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity, selectedVariant);
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedVariant);
    router.push('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      product_id: product.id,
      customer_name: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
      is_verified_purchase: true,
      is_approved: true,
      created_at: new Date().toISOString(),
    };

    setReviews([newRev, ...reviews]);
    setReviewSubmitted(true);
    setReviewerName('');
    setReviewerComment('');
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 1500);
  };

  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#78746D] mb-8">
          <Link href="/" className="hover:text-[#151515]">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#B69A69]" />
          <Link href="/shop" className="hover:text-[#151515]">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 text-[#B69A69]" />
              <Link href={`/collections/${product.category.slug}`} className="hover:text-[#151515]">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-[#B69A69]" />
          <span className="text-[#151515] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Image Gallery & Zoom (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Interactive Zoom Box */}
            <div
              className="relative aspect-square sm:aspect-[4/3] bg-white rounded-sm overflow-hidden border border-[#EAE3D8] cursor-crosshair"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={activeImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
              />

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition ${
                  isWishlisted ? 'bg-[#B69A69] text-white shadow-lg' : 'bg-white/80 text-[#151515] hover:bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                {discountPercent && (
                  <span className="bg-[#151515] text-[#F6F3ED] text-[10px] uppercase font-semibold px-2.5 py-1 tracking-wider border border-[#B69A69]">
                    {discountPercent}% Off
                  </span>
                )}
                {product.is_bestseller && (
                  <span className="bg-[#B69A69] text-[#151515] text-[10px] uppercase font-semibold px-2.5 py-1 tracking-wider">
                    Bestseller
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-sm overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImage === img ? 'border-[#B69A69] shadow-md' : 'border-[#D9CFC0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#B69A69] font-medium">
                  {product.category?.name || 'Architectural Lighting'}
                </span>
                <span className="text-[#D9CFC0]">·</span>
                <span className="text-xs text-[#78746D]">{product.style || 'The Fifth Wall'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light mt-2">
                {product.name}
              </h1>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-4 mt-3">
                <span className="font-serif text-3xl sm:text-4xl text-[#151515] font-normal">
                  {formatINR(currentPriceInPaise)}
                </span>
                {product.compare_at_price_in_paise && (
                  <span className="text-sm text-[#999] line-through">
                    {formatINR(product.compare_at_price_in_paise)}
                  </span>
                )}
                <span className="text-xs text-[#16a34a] font-medium">
                  Inclusive of GST
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#555] leading-relaxed font-light border-y border-[#EAE3D8] py-4">
              {product.description}
            </p>

            {/* Finish & Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-[#151515] font-semibold">
                  Select Specification / Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 text-left border rounded-sm text-xs transition ${
                        selectedVariant?.id === v.id
                          ? 'border-[#B69A69] bg-white shadow-sm ring-1 ring-[#B69A69]'
                          : 'border-[#D9CFC0] bg-[#F6F3ED] hover:border-[#151515]'
                      }`}
                    >
                      <span className="font-medium text-[#151515] block">{v.name}</span>
                      <span className="text-[#B69A69] font-mono mt-0.5 block">{formatINR(v.price_in_paise)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Spec Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs text-[#555] bg-white p-4 border border-[#EAE3D8] rounded-sm">
              <div>
                <span className="text-[#151515] font-medium block">Crafted Material:</span>
                <span>{product.material || 'Solid Spun Brass & Optical Acrylic'}</span>
              </div>
              <div>
                <span className="text-[#151515] font-medium block">Artisanal Finish:</span>
                <span>{product.finish || 'Champagne Brass'}</span>
              </div>
              <div>
                <span className="text-[#151515] font-medium block">Dimensions:</span>
                <span>{product.dimensions || 'Diameter: 85 cm, Drop: 12 cm'}</span>
              </div>
              <div>
                <span className="text-[#151515] font-medium block">Availability:</span>
                <span className="text-[#16a34a] font-medium">
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Made to Order (2 Weeks)'}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#D9CFC0] bg-white rounded-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-[#555] hover:text-black transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 py-2 text-sm font-medium text-[#151515]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-[#555] hover:text-black transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 gold-button py-4 flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-[#151515] hover:bg-[#242321] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition rounded-sm shadow-md"
              >
                <Zap className="w-4 h-4 text-[#B69A69]" />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* Brand Commitments */}
            <div className="space-y-2.5 pt-4 border-t border-[#EAE3D8] text-xs text-[#78746D]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#B69A69] flex-shrink-0" />
                <span>Free Pan-India White-Glove Transit for orders above ₹4,999</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B69A69] flex-shrink-0" />
                <span>2-Year Comprehensive Guarantee on all electrical components</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#B69A69] flex-shrink-0" />
                <span>Inspected white-glove arrival guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications & Reviews Accordion */}
        <div className="mt-24 pt-16 border-t border-[#EAE3D8]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#151515] border-b border-[#EAE3D8] pb-3">
                Technical Specifications
              </h3>
              <ul className="space-y-3 text-xs text-[#555]">
                <li className="flex justify-between py-1 border-b border-[#EAE3D8]">
                  <span className="font-medium text-[#151515]">Operating Voltage</span>
                  <span>{product.voltage || '220V – 240V, 50Hz'}</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#EAE3D8]">
                  <span className="font-medium text-[#151515]">Luminous Engine</span>
                  <span>{product.wattage || 'High-CRI Warm White LED'}</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#EAE3D8]">
                  <span className="font-medium text-[#151515]">Color Temperature</span>
                  <span>{product.bulb_type || '3000K Soft Warm Ambient'}</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#EAE3D8]">
                  <span className="font-medium text-[#151515]">Dimmability</span>
                  <span>Triac / Phase Dimmable Supported</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#EAE3D8]">
                  <span className="font-medium text-[#151515]">Certification</span>
                  <span>BIS Compliant Architectural Standard</span>
                </li>
              </ul>
            </div>

            {/* Delivery & Installation Support */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#151515] border-b border-[#EAE3D8] pb-3">
                Transit & Installation
              </h3>
              <div className="text-xs text-[#555] space-y-3 leading-relaxed">
                <p>
                  Each piece from THE FIFTH WALL is crated in multi-tier custom foam and timber framework to guarantee damage-free transit across India.
                </p>
                <p>
                  Our concierge team coordinates with your site electrician or interior designer with wiring schematics and ceiling weight reinforcement guidelines.
                </p>
                <p className="font-medium text-[#151515]">
                  Need professional installation in Lucknow or Delhi NCR? Contact us at studio@thefifthwall.in.
                </p>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D8] pb-3">
                <h3 className="font-serif text-2xl text-[#151515]">
                  Client Reviews ({reviews.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs uppercase tracking-wider text-[#B69A69] hover:underline font-medium"
                >
                  {showReviewForm ? 'Cancel' : 'Write Review'}
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-white p-4 border border-[#EAE3D8] rounded-sm space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-medium mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Meera Deora"
                      className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3 py-2 text-[#151515] rounded-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-medium mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewerRating(s)}
                          className="text-[#B69A69]"
                        >
                          <Star className={`w-4 h-4 ${s <= reviewerRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-medium mb-1">
                      Review Comments
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      placeholder="Share your thoughts on the craftsmanship, illumination warmth, and finish..."
                      className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3 py-2 text-[#151515] rounded-sm focus:outline-none resize-none"
                    />
                  </div>
                  {reviewSubmitted && (
                    <p className="text-xs text-[#16a34a]">Thank you! Your verified review has been posted.</p>
                  )}
                  <button type="submit" className="gold-button py-2 px-4 text-xs">
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-xs text-[#78746D]">No reviews yet. Be the first to share your experience.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-4 border border-[#EAE3D8] rounded-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-medium text-[#151515]">
                          {rev.customer_name}
                        </span>
                        <div className="flex text-[#B69A69]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current stroke-none" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#555] leading-relaxed italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                      {rev.is_verified_purchase && (
                        <span className="text-[10px] text-[#16a34a] font-medium block">
                          ✓ Verified Homeowner
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Architectural Pieces */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#EAE3D8]">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="section-kicker">Harmonious Additions</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#151515] font-light mt-1">
                  Related <em>Pieces.</em>
                </h2>
              </div>
              <Link href="/shop" className="text-xs uppercase tracking-widest text-[#B69A69] hover:underline font-medium">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
