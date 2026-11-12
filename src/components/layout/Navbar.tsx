'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightingMenuOpen, setLightingMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  // Handle scroll state for transparent to solid transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Do not render consumer navbar in admin dashboard
  if (isAdmin) {
    return null;
  }

  const navClass = isHome && !isScrolled
    ? 'glass-nav-transparent text-[#F5EEDB]'
    : 'glass-nav-scrolled text-[#F5EEDB]';

  const logoColor = 'text-[#F5EEDB] group-hover:text-[#C5A059]';
  const subtextColor = 'text-[#C5A059]';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navClass}`}>
        {/* Top Announcement Bar */}
        <div className="bg-[#060606] text-[#C5A059] text-[11px] tracking-[0.2em] uppercase py-2 text-center border-b border-[#2E261B] px-4 font-medium flex items-center justify-center gap-4">
          <span>Complimentary White-Glove Shipping Across India On Orders Above ₹4,999</span>
          <span className="hidden md:inline text-[#E5C378]">✦</span>
          <span className="hidden md:inline text-[#E5C378]">Lucknow Flagship Showroom</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 rounded-md focus:outline-none hover:opacity-80 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center py-2">
              <Link href="/" className="group flex items-center">
                <img
                  src="/images/logo.png"
                  alt="THE FIFTH WALL — Lighting Interiors Beyond"
                  className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 text-[12px] tracking-[0.15em] uppercase font-medium">
              <Link
                href="/"
                className="hover:text-[#C5A059] transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="hover:text-[#C5A059] transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all"
              >
                Shop All
              </Link>

              {/* Lighting Mega-dropdown Trigger */}
              <div
                className="relative group py-4"
                onMouseEnter={() => setLightingMenuOpen(true)}
                onMouseLeave={() => setLightingMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-[#C5A059] transition py-1 uppercase"
                >
                  <span>Lighting</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>

                {/* Dropdown Menu */}
                {lightingMenuOpen && (
                  <div className="absolute top-full -left-12 w-64 bg-[#121212] text-[#F5EEDB] shadow-2xl border border-[#2E261B] py-4 px-2 rounded-sm transition-all animate-fadeIn">
                    <Link
                      href="/collections/chandeliers"
                      className="block px-4 py-2 hover:bg-[#1C1812] hover:text-[#C5A059] text-xs transition"
                    >
                      Chandeliers
                    </Link>
                    <Link
                      href="/collections/ceiling-lights"
                      className="block px-4 py-2 hover:bg-[#1C1812] hover:text-[#C5A059] text-xs transition"
                    >
                      Ceiling Lights
                    </Link>
                    <Link
                      href="/collections/wall-lights"
                      className="block px-4 py-2 hover:bg-[#1C1812] hover:text-[#C5A059] text-xs transition"
                    >
                      Wall Lights
                    </Link>
                    <Link
                      href="/collections/pendant-lights"
                      className="block px-4 py-2 hover:bg-[#1C1812] hover:text-[#C5A059] text-xs transition"
                    >
                      Pendant Lights
                    </Link>
                    <Link
                      href="/collections/floor-lamps"
                      className="block px-4 py-2 hover:bg-[#1C1812] hover:text-[#C5A059] text-xs transition"
                    >
                      Floor Lamps
                    </Link>
                    <Link
                      href="/collections/table-lamps"
                      className="block px-4 py-2 hover:bg-[#1C1812] hover:text-[#C5A059] text-xs transition"
                    >
                      Table Lamps
                    </Link>
                    <Link
                      href="/collections/outdoor-lighting"
                      className="block px-4 py-2 hover:bg-[#1C1812] hover:text-[#C5A059] text-xs transition"
                    >
                      Outdoor Lighting
                    </Link>
                    <Link
                      href="/collections/ceiling-fans"
                      className="block px-4 py-2 hover:bg-[#1C1812] hover:text-[#C5A059] text-xs transition"
                    >
                      Ceiling Fans
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/collections/furniture"
                className="hover:text-[#C5A059] transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all"
              >
                Furniture
              </Link>
              <Link
                href="/collections/interior-decor"
                className="hover:text-[#C5A059] transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all"
              >
                Interior Décor
              </Link>
              <Link
                href="/about"
                className="hover:text-[#C5A059] transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#C5A059] transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all"
              >
                Contact
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-5 sm:space-x-6">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('tfw:open-search'));
                }}
                className="hover:text-[#C5A059] transition p-1"
                aria-label="Open search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Account Dropdown */}
              <Link
                href={user ? '/account/profile' : '/login'}
                className="hover:text-[#C5A059] transition p-1 relative flex items-center"
                aria-label="My Account"
                title={user ? `Signed in as ${user.email}` : 'Sign In'}
              >
                <User className="w-5 h-5 stroke-[1.5]" />
                {user && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#16a34a]" />
                )}
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="hover:text-[#C5A059] transition p-1 relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C5A059] text-[#0A0A0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="hover:text-[#C5A059] transition p-1 relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C5A059] text-[#0A0A0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#E5C378]">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#101010] text-[#F5EEDB] border-t border-[#2E261B] px-6 py-8 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
            <nav className="flex flex-col space-y-4 text-sm tracking-[0.15em] uppercase font-medium">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#2E261B] hover:text-[#C5A059]"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#2E261B] hover:text-[#C5A059]"
              >
                Shop All Collection
              </Link>
              <div className="py-2 border-b border-[#2E261B]">
                <div className="font-semibold text-xs text-[#C5A059] mb-2">Lighting Collections</div>
                <div className="pl-4 space-y-2 text-xs normal-case tracking-normal">
                  <Link href="/collections/chandeliers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C5A059]">
                    Chandeliers
                  </Link>
                  <Link href="/collections/ceiling-lights" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C5A059]">
                    Ceiling Lights
                  </Link>
                  <Link href="/collections/wall-lights" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C5A059]">
                    Wall Lights
                  </Link>
                  <Link href="/collections/pendant-lights" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C5A059]">
                    Pendant Lights
                  </Link>
                  <Link href="/collections/floor-lamps" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C5A059]">
                    Floor Lamps
                  </Link>
                  <Link href="/collections/ceiling-fans" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C5A059]">
                    Ceiling Fans
                  </Link>
                </div>
              </div>
              <Link
                href="/collections/furniture"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#2E261B] hover:text-[#C5A059]"
              >
                Furniture
              </Link>
              <Link
                href="/collections/interior-decor"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#2E261B] hover:text-[#C5A059]"
              >
                Interior Décor
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#2E261B] hover:text-[#C5A059]"
              >
                About Our Story
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#2E261B] hover:text-[#C5A059]"
              >
                Contact & Showroom
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#2E261B] hover:text-[#C5A059]"
              >
                Track My Order
              </Link>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#C5A059] font-bold text-xs"
              >
                Admin Portal
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
