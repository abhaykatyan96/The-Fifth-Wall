import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen text-[#F5EEDB]">
      {/* Hero Banner */}
      <div className="relative bg-[#060606] text-white py-24 px-4 sm:px-6 lg:px-8 mb-16 overflow-hidden border-b border-[#2E261B]">
        <div className="absolute inset-0 opacity-25">
          <img
            src="/images/rooms/living-room.jpg"
            alt="The Fifth Wall Architectural Living Space"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
            About Us
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F5EEDB]">
            Lighting. Interiors. Beyond.
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-[#E5C378] italic font-light">
            Transforming spaces into experiences.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Core Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-5">
            <span className="section-kicker">Our Philosophy</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5EEDB] font-light leading-tight">
              Where Lighting & Interiors <br />
              <em className="text-[#C5A059]">Come Together.</em>
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#9E9788] font-light leading-relaxed">
              <p className="text-[#F5EEDB] font-medium text-sm sm:text-base leading-relaxed">
                The Fifth Wall is where lighting and interiors come together to transform the way a space feels.
              </p>
              <p>
                Inspired by the ceiling—the often-overlooked Fifth Wall—our philosophy is to look beyond the ordinary and create spaces with character, warmth, and elegance.
              </p>
              <p>
                From statement lighting and architectural illumination to refined interiors and décor, every element is thoughtfully curated to bring beauty and purpose into your home.
              </p>
              <p className="text-[#E5C378] font-medium">
                We believe great design is not just about how a space looks, but how it makes you feel.
              </p>
              <div className="pt-2 border-l-2 border-[#C5A059] pl-4">
                <p className="font-serif text-lg text-[#F5EEDB] italic">
                  The Fifth Wall — transforming spaces into experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="aspect-[4/5] bg-[#141414] rounded-sm overflow-hidden border border-[#2E261B] shadow-2xl">
              <img
                src="/images/about-chandelier.jpg"
                alt="The Fifth Wall Sculptural Illumination"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Pillars of Craftsmanship */}
        <div className="border-t border-[#2E261B] pt-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="section-kicker">02 / Discipline & Integrity</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5EEDB] font-light mt-1">
              Materiality & Atmosphere.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-[#141414] p-8 border border-[#2E261B] rounded-sm space-y-3 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#2E261B] text-[#C5A059] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#F5EEDB]">Architectural Precision</h3>
              <p className="text-xs text-[#9E9788] leading-relaxed">
                Every chandelier arm, ceiling canopy, and wall mount is machined with high-grade optical aluminum, solid brass castings, and honed Italian travertine.
              </p>
            </div>

            <div className="bg-[#141414] p-8 border border-[#2E261B] rounded-sm space-y-3 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#2E261B] text-[#C5A059] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#F5EEDB]">Circadian Warmth</h3>
              <p className="text-xs text-[#9E9788] leading-relaxed">
                We calibrate our light engines to soft, glare-free 2700K–3000K temperatures with CRI 95+ ratings, ensuring natural wood grains, fabrics, and skin tones are rendered faithfully.
              </p>
            </div>

            <div className="bg-[#141414] p-8 border border-[#2E261B] rounded-sm space-y-3 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#2E261B] text-[#C5A059] flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#F5EEDB]">Permanent Value</h3>
              <p className="text-xs text-[#9E9788] leading-relaxed">
                Backed by 2-year comprehensive manufacturer warranties and multi-tier timber crating for safe delivery to private residences across India.
              </p>
            </div>
          </div>
        </div>

        {/* Flagship Showroom Visit Callout */}
        <div className="bg-[#101010] text-[#F5EEDB] p-8 sm:p-14 rounded-sm border border-[#2E261B] text-center space-y-6 shadow-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
            Visit Us in Person
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#F5EEDB]">
            The Lucknow Flagship Showroom
          </h2>
          <p className="text-xs sm:text-sm text-[#9E9788] max-w-xl mx-auto font-light leading-relaxed">
            Experience our sculptural chandeliers, illuminated stone features, and bespoke furniture pieces in ambient architectural settings.
          </p>
          <div className="text-xs text-[#9E9788] space-y-1">
            <p>E1/803, Vardan Khand, Sector 1, Gomti Nagar, Lucknow, Uttar Pradesh 226010</p>
            <p>Monday – Saturday, 10:30 am – 8:00 pm</p>
          </div>
          <div className="pt-2">
            <Link href="/contact" className="gold-button inline-flex py-3.5 px-8 text-xs tracking-[0.2em]">
              <span>Plan Your Showroom Visit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
