import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/hooks/useCart';
import { WishlistProvider } from '@/hooks/useWishlist';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import SearchModal from '@/components/layout/SearchModal';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'THE FIFTH WALL — Lighting. Interiors. Beyond.',
  description:
    'International luxury lighting, statement chandeliers, architectural wall sconces, and curated interior décor for extraordinary living.',
  keywords: [
    'luxury lighting',
    'chandeliers india',
    'ceiling lights',
    'wall lights',
    'pendant lights',
    'luxury furniture',
    'the fifth wall',
    'interior decor lucknow',
  ],
  authors: [{ name: 'THE FIFTH WALL Studio' }],
  openGraph: {
    title: 'THE FIFTH WALL — Lighting. Interiors. Beyond.',
    description: 'Transforming Spaces Into Experiences through sculptural illumination and bespoke interior architecture.',
    url: 'https://thefifthwall.in',
    siteName: 'THE FIFTH WALL',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'THE FIFTH WALL Luxury Lighting',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F6F3ED] text-[#242321] selection:bg-[#B69A69] selection:text-[#151515]">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Suspense fallback={<div className="h-20 bg-[#151515]" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Suspense fallback={null}>
                <Footer />
                <WhatsAppButton />
              </Suspense>
              <CartDrawer />
              <SearchModal />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
