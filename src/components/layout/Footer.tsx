'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ShieldCheck, Truck, Headphones, Check } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  if (isAdmin) {
    return null;
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, source: 'footer' }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterMsg(data.message || 'Thank you for joining our private circle.');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMsg(data.error || 'Failed to subscribe.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-[#151515] text-[#D9CFC0] border-t border-[#242321] pt-16 pb-10">
      {/* Upper Features Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#242321]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#242321] flex items-center justify-center text-[#B69A69] flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-[0.15em] font-medium">Pan-India Delivery</h4>
              <p className="text-xs text-[#9B978F] mt-1">Complimentary on orders above ₹4,999</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#242321] flex items-center justify-center text-[#B69A69] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-[0.15em] font-medium">2-Year Warranty</h4>
              <p className="text-xs text-[#9B978F] mt-1">Comprehensive guarantee on all lighting</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#242321] flex items-center justify-center text-[#B69A69] flex-shrink-0">
              <span className="text-[#B69A69] text-xl font-serif">✦</span>
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-[0.15em] font-medium">Design Assistance</h4>
              <p className="text-xs text-[#9B978F] mt-1">Bespoke lighting plans for your residence</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#242321] flex items-center justify-center text-[#B69A69] flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-[0.15em] font-medium">Dedicated Support</h4>
              <p className="text-xs text-[#9B978F] mt-1">Mon – Sat, 10:30 am – 8:00 pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <h3 className="font-serif text-3xl tracking-[0.2em] font-light text-white uppercase">
                THE FIFTH WALL
              </h3>
              <p className="text-[10px] tracking-[0.35em] text-[#B69A69] uppercase mt-1">
                Lighting · Interiors · Beyond
              </p>
            </Link>

            <p className="text-xs leading-relaxed text-[#A8A29A] max-w-sm">
              Inspired by the ceiling—the often-overlooked Fifth Wall—our philosophy is to look beyond the ordinary and curate sculptural illumination and bespoke interior pieces that transform spaces into experiences.
            </p>

            <div className="space-y-1 text-xs text-[#A8A29A]">
              <p className="font-medium text-white uppercase tracking-wider text-[11px]">Flagship Showroom</p>
              <p>1/803, Sector 1, Gomti Nagar Vistar, Lucknow</p>
              <p>Hours: Mon – Sat, 10:30 am – 8:00 pm</p>
              <p>Direct Inquiries: studio@thefifthwall.in</p>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#242321] flex items-center justify-center text-[#D9CFC0] hover:text-[#B69A69] hover:bg-[#2e2d2a] transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#242321] flex items-center justify-center text-[#D9CFC0] hover:text-[#B69A69] hover:bg-[#2e2d2a] transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#242321] flex items-center justify-center text-[#D9CFC0] hover:text-[#B69A69] hover:bg-[#2e2d2a] transition"
                aria-label="Pinterest"
              >
                <span className="font-bold text-xs">P</span>
              </a>
            </div>
          </div>

          {/* Shop Col */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-5 border-l-2 border-[#B69A69] pl-3">
              Shop Collections
            </h4>
            <ul className="space-y-3 text-xs text-[#A8A29A]">
              <li><Link href="/collections/chandeliers" className="hover:text-[#B69A69] transition">Chandeliers</Link></li>
              <li><Link href="/collections/ceiling-lights" className="hover:text-[#B69A69] transition">Ceiling Lights</Link></li>
              <li><Link href="/collections/wall-lights" className="hover:text-[#B69A69] transition">Wall Sconces & Lights</Link></li>
              <li><Link href="/collections/pendant-lights" className="hover:text-[#B69A69] transition">Pendant Lights</Link></li>
              <li><Link href="/collections/floor-lamps" className="hover:text-[#B69A69] transition">Floor Lamps</Link></li>
              <li><Link href="/collections/table-lamps" className="hover:text-[#B69A69] transition">Table Lamps</Link></li>
              <li><Link href="/collections/outdoor-lighting" className="hover:text-[#B69A69] transition">Outdoor Luminaires</Link></li>
              <li><Link href="/collections/ceiling-fans" className="hover:text-[#B69A69] transition">Luxury Ceiling Fans</Link></li>
              <li><Link href="/collections/furniture" className="hover:text-[#B69A69] transition">Considered Furniture</Link></li>
              <li><Link href="/collections/interior-decor" className="hover:text-[#B69A69] transition">Interior Décor</Link></li>
            </ul>
          </div>

          {/* Company & Client Care */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-5 border-l-2 border-[#B69A69] pl-3">
              Client Care & Legal
            </h4>
            <ul className="space-y-3 text-xs text-[#A8A29A]">
              <li><Link href="/about" className="hover:text-[#B69A69] transition">Our Philosophy & Story</Link></li>
              <li><Link href="/contact" className="hover:text-[#B69A69] transition">Visit Lucknow Showroom</Link></li>
              <li><Link href="/contact#consultation" className="hover:text-[#B69A69] transition">Bespoke Design Consultation</Link></li>
              <li><Link href="/track-order" className="hover:text-[#B69A69] transition">Track Consignment</Link></li>
              <li><Link href="/faq" className="hover:text-[#B69A69] transition">Frequently Asked Questions</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#B69A69] transition">White-Glove Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-[#B69A69] transition">Return & Exchange Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#B69A69] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#B69A69] transition">Terms & Conditions</Link></li>
              <li><Link href="/admin/dashboard" className="text-[#B69A69] font-medium hover:underline">Admin Portal Access</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-5 border-l-2 border-[#B69A69] pl-3">
              The Private Journal
            </h4>
            <p className="text-xs text-[#A8A29A] mb-4 leading-relaxed">
              Receive private previews of limited edition architectural collections, interior design insights, and exclusive invitations.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#242321] border border-[#383633] text-white placeholder-[#78746D] text-xs px-4 py-3 focus:outline-none focus:border-[#B69A69] transition"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#B69A69] text-[#151515] hover:bg-[#8E7444] hover:text-white transition flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  {newsletterStatus === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : newsletterStatus === 'success' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {newsletterMsg && (
                <p className={`text-[11px] mt-2 ${newsletterStatus === 'success' ? 'text-[#86efac]' : 'text-[#fca5a5]'}`}>
                  {newsletterMsg}
                </p>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-[#242321]">
              <p className="text-[10px] text-[#78746D] uppercase tracking-wider mb-2">Accepted Payment Modes</p>
              <div className="flex items-center space-x-2 text-[10px] text-[#B69A69] font-mono">
                <span>Razorpay Secured</span> · <span>UPI</span> · <span>NetBanking</span> · <span>Visa/Mastercard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#242321] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78746D]">
        <p>© 2026 THE FIFTH WALL. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 tracking-[0.1em] uppercase text-[#A8A29A]">
          Lucknow · India · Made for the extraordinary
        </p>
      </div>
    </footer>
  );
}
