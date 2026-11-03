import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Compass, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-[#151515] text-white py-24 px-4 sm:px-6 lg:px-8 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85"
            alt="The Fifth Wall Architectural Living Space"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B69A69] font-medium block">
            Our Point of View
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light">
            Lighting. Interiors. Beyond.
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-[#EAE3D8] italic font-light">
            Transforming Spaces Into Experiences.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Core Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-5">
            <span className="section-kicker">01 / The Origin</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#151515] font-light leading-tight">
              Looking to the Often-Overlooked <em>Fifth Wall.</em>
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#555] font-light leading-relaxed">
              <p>
                In classical architecture, every interior possesses four vertical boundaries: four walls that contain physical volume. Yet the ceiling—the expansive fifth plane above us—is too often dismissed as mere overhead utility.
              </p>
              <p>
                <strong>THE FIFTH WALL</strong> was founded on a singular conviction: when the ceiling speaks, the entire room transforms. Illumination is not simply functional brightness; it is the atmosphere that holds conversations, calms evening transitions, and lends monumental scale to everyday domestic living.
              </p>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="aspect-[4/5] bg-[#EAE3D8] rounded-sm overflow-hidden border border-[#D9CFC0] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1200&q=85"
                alt="Architectural Chandelier Illumination"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Pillars of Craftsmanship */}
        <div className="border-t border-[#EAE3D8] pt-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="section-kicker">02 / Discipline & Integrity</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#151515] font-light mt-1">
              Materiality & Atmosphere.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-white p-8 border border-[#EAE3D8] rounded-sm space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F6F3ED] text-[#B69A69] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#151515]">Architectural Precision</h3>
              <p className="text-xs text-[#78746D] leading-relaxed">
                Every chandelier arm, ceiling canopy, and wall mount is machined with high-grade optical aluminum, solid brass castings, and honed Italian travertine.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EAE3D8] rounded-sm space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F6F3ED] text-[#B69A69] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#151515]">Circadian Warmth</h3>
              <p className="text-xs text-[#78746D] leading-relaxed">
                We calibrate our light engines to soft, glare-free 2700K–3000K temperatures with CRI 95+ ratings, ensuring natural wood grains, fabrics, and skin tones are rendered faithfully.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EAE3D8] rounded-sm space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F6F3ED] text-[#B69A69] flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#151515]">Permanent Value</h3>
              <p className="text-xs text-[#78746D] leading-relaxed">
                Backed by 2-year comprehensive manufacturer warranties and multi-tier timber crating for safe delivery to private residences across India.
              </p>
            </div>
          </div>
        </div>

        {/* Flagship Showroom Visit Callout */}
        <div className="bg-[#242321] text-white p-8 sm:p-14 rounded-sm border border-[#383633] text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B69A69] font-medium block">
            Visit Us in Person
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light">
            The Lucknow Flagship Showroom
          </h2>
          <p className="text-xs sm:text-sm text-[#D9CFC0] max-w-xl mx-auto font-light leading-relaxed">
            Experience our sculptural chandeliers, illuminated stone features, and bespoke furniture pieces in ambient architectural settings.
          </p>
          <div className="text-xs text-[#A8A29A] space-y-1">
            <p>1/803, Sector 1, Gomti Nagar Vistar, Lucknow</p>
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
